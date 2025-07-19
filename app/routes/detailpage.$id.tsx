import { useParams } from "@remix-run/react";
import { Navbar } from "~/components/ui/Navbar";
import { Footer } from "~/components/ui/footer";
import { DetailPage } from "~/components/pages/DetailPage";
import { ChatBot } from "~/components/ui/chat-bot";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function ArtikelDetail() {
  const { id } = useParams();

  return (
    <ProtectedRoute>
      <Navbar />
      <DetailPage articleId={id} />
      <Footer />
      <ChatBot />
    </ProtectedRoute>
  );
}
