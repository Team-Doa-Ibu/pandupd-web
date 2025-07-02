import React from "react";
import { Navbar } from "~/components/navbar";
import { Footer } from "~/components/footer";
import { ArtikelPage } from "~/components/artikel-page";
import { ChatBot } from "~/components/chat-bot";

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