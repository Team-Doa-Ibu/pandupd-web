import type { MetaFunction } from "@remix-run/node";
import { Navbar } from "../components/navbar";

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
    </>
  );
}