import DeteksiPage from "~/components/pages/DeteksiPage";
import { Navbar } from "~/components/ui/Navbar";
import { ProtectedRoute } from "~/components/ProtectedRoute";

const deteksi = () => {
  return (
    <ProtectedRoute>
      <Navbar />
      <DeteksiPage />
    </ProtectedRoute>
  );
};

export default deteksi;
