import HistoryPage from '../components/history-page';
import { Navbar } from '../components/navbar';
import { Footer } from '../components/footer';
import { ChatBot } from '../components/chat-bot';

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