import PropTypes from "prop-types";
import { NavMenu } from "./footer-menu";

export const Footer = ({ text = "PANDU‑PD" }) => {
  return (
    <div className="w-full bg-neutral-800">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-8 px-4 py-10 md:px-8">
        <div className="flex w-full flex-col flex-wrap justify-between gap-8 md:flex-row md:items-start">
          <div className="flex w-full flex-col gap-4 md:w-auto">
            <div className="text-3xl font-bold text-white md:text-4xl">
              {text}
            </div>
            <p className="text-left text-base text-white">
              Memberdayakan melalui edukasi dan deteksi dini penyakit Parkinson.
            </p>
          </div>

          <div className="flex w-full flex-col flex-wrap items-start gap-8 sm:flex-row md:w-auto md:justify-end">
            <div className="flex min-w-[150px] flex-col gap-4">
              <div className="text-base font-bold text-white">Tautan Cepat</div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Cek Sekarang" type="footer" />
                <NavMenu text="Terapi" type="footer" />
                <NavMenu text="Artikel" type="footer" />
                <NavMenu text="Riwayat" type="footer" />
              </div>
            </div>
            <div className="flex min-w-[150px] flex-col gap-4">
              <div className="text-base font-bold text-white">
                Alat Diagnosis
              </div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Gambar Spiral" type="footer" />
                <NavMenu text="Analisis Pola Suara" type="footer" />
              </div>
            </div>
            <div className="flex min-w-[150px] flex-col gap-4">
              <div className="text-base font-bold text-white">Informasi</div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Tentang Kami" type="footer" />
                <NavMenu text="Hubungi Kami" type="footer" />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 w-full border-t border-neutral-600" />

        <div className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-base font-medium text-white md:text-left">
            © 2025 PANDU‑PD. Hak Cipta Dilindungi.
          </p>
          <div className="flex w-full flex-wrap items-center justify-center gap-3 md:w-auto md:justify-end">
            <NavMenu text="Kebijakan Privasi" type="footer" />
            <NavMenu text="Ketentuan Layanan" type="footer" />
            <NavMenu text="Kebijakan Cookie" type="footer" />
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  text: PropTypes.string,
};
