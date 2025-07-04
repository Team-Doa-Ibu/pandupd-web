import HistoryPage from "../components/pages/HistoryPage";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/footer";
import { ChatBot } from "../components/ui/chat-bot";

export default function History() {
  return (
    <>
      <Navbar />
      <HistoryPage />
      <Footer />
      <ChatBot />
    </>
  );
}
