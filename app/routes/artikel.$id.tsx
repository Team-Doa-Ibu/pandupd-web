import { useParams } from "@remix-run/react";
import { Navbar } from "~/components/ui/Navbar";
import { Footer } from "~/components/ui/footer";
import { ChatBot } from "~/components/ui/chat-bot";
import { DetailPage } from "~/components/pages/DetailPage";

export default function ArtikelDetail() {
  const { id } = useParams();
  
  return (
    <>
      <Navbar />
      <DetailPage articleId={id} />
      <Footer />
      <ChatBot />
    </>
  );
} 