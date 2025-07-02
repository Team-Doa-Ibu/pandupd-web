import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { LandingPage } from "../components/landing-page";
import { ChatBot } from "../components/chat-bot";
export const meta: MetaFunction = () => {
  return [
    { title: "Doa Ibu - Platform Prediksi Parkinson" },
    { name: "description", content: "Platform kami menawarkan dua fitur utama untuk membantu memprediksi penyakit Parkinson" },
  ];
};

export default function Index() {
  return (
    <>
    <Navbar />
    <LandingPage />
    <Footer />
    <ChatBot />
    </>
  );
}