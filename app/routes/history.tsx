import HistoryPage from "../components/pages/HistoryPage";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/footer";
import { ChatBot } from "../components/ui/chat-bot";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function History() {
  return (
    <ProtectedRoute>
      <Navbar />
      <HistoryPage />
      <Footer />
      <ChatBot />
    </ProtectedRoute>
  );
}
