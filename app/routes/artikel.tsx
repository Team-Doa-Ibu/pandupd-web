import React from "react";
import { Navbar } from "~/components/ui/Navbar";
import { Footer } from "~/components/ui/footer";
import { ArtikelPage } from "~/components/pages/ArtikelPage";
import { ChatBot } from "~/components/ui/chat-bot";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function Artikel() {
  return (
    <>
      <Navbar />
      <ArtikelPage />
      <Footer />
      <ChatBot />
    </>
  );
}
