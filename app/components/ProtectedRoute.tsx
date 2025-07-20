import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { supabase } from "../data/supabaseClient";

export function ProtectedRoute({
  children,
  onlyGuest = false,
  adminOnly = false,
}: {
  children: React.ReactNode;
  onlyGuest?: boolean;
  adminOnly?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Guest only (login/register)
      if (onlyGuest && user) {
        navigate("/profile", { replace: true });
        return;
      }

      // Admin only
      if (adminOnly) {
        if (!user) {
          navigate("/login", { replace: true });
          return;
        }
        const { data: roleData } = await supabase
          .from("role")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();
        if (!roleData || roleData.role !== "Admin") {
          navigate("/error/403", { replace: true });
          return;
        }
        if (isMounted) setAllowed(true);
        return;
      }

      // User only
      if (!onlyGuest && !user) {
        navigate("/login", { replace: true });
        return;
      }
      if (isMounted) setAllowed(true);
    };
    checkAuth();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [location.pathname]);

  if (!allowed && !onlyGuest) return null;
  return <>{children}</>;
}
