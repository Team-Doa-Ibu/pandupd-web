import ScreeningResultPage from "../components/pages/ScreeningResultPage";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/footer";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function ScreeningResult() {
  return (
    <ProtectedRoute>
      <Navbar />
      <ScreeningResultPage />
      <Footer />
    </ProtectedRoute>
  );
}
