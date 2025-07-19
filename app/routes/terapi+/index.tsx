import { ProtectedRoute } from "../../components/ProtectedRoute";
import CourseIndex from "~/components/pages/TerapiPage";
import { ChatBot } from "~/components/ui/chat-bot";
import { Footer } from "~/components/ui/footer";
import { Navbar } from "~/components/ui/Navbar";

export default function terapi() {
  return (
    <ProtectedRoute>
      <Navbar />
      <CourseIndex />
      <Footer />
      <ChatBot />
    </ProtectedRoute>
  );
}
