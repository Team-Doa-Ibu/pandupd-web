// footer.tsx
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
                <NavMenu text="Cek Sekarang" type="footer" href="/deteksi" />
                <NavMenu text="Terapi" type="footer" href="/terapi" />
                <NavMenu text="Artikel" type="footer" href="/artikel" />
                <NavMenu text="Riwayat" type="footer" href="/history" />
              </div>
            </div>
            <div className="flex min-w-[150px] flex-col gap-4">
              <div className="text-base font-bold text-white">
                Alat Diagnosis
              </div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Gambar Spiral" type="footer" href="/deteksi" />
                <NavMenu
                  text="Analisis Pola Suara"
                  type="footer"
                  href="/deteksi"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 w-full border-t border-neutral-600" />

        <div className="flex w-full flex-col items-center justify-center gap-4">
          <p className="text-center text-base font-medium text-white">
            © 2025 PANDU‑PD. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  text: PropTypes.string,
};
