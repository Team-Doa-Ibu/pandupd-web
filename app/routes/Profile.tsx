import React from "react";
import ProfilePage from "../components/pages/ProfilePage";
import { Navbar } from "~/components/ui/Navbar";
import { Footer } from "~/components/ui/footer";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function profile() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ProfilePage />
      <Footer />
    </ProtectedRoute>
  );
}
