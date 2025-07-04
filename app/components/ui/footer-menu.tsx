import React from "react";

type NavMenuProps = {
  text: string;
  type?: "footer" | "default";
  className?: string;
  stateProp?: string;
};

export const NavMenu: React.FC<NavMenuProps> = ({
  text,
  type = "default",
  className = "",
  stateProp, // ambil tapi jangan diteruskan ke <a>
  ...props
}) => {
  const base = "py-1 rounded-full font-medium transition cursor-pointer";
  const styles =
    type === "footer"
      ? "bg-transparent text-white/50 hover:text-yellow-400"
      : "bg-blue-500 text-white hover:bg-blue-600";
  return (
    <a
      href="/"
      className={`${base} ${styles} ${className}`}
      // ...props tanpa stateProp
      {...props}
    >
      {text}
    </a>
  );
};
