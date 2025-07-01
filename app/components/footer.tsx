import PropTypes from "prop-types";
import React from "react";
import { NavMenu } from "./footer-menu";

export const Footer = ({ text = "Parked" }) => {
  return (
    <div className="w-full bg-neutral-800">
      <div className="flex flex-col w-full max-w-screen-xl mx-auto items-start gap-8 py-10 px-4 md:px-8">
        <div className="flex flex-col md:flex-row flex-wrap md:items-start items-center justify-between w-full gap-8">
          <div className="flex flex-col w-full md:w-auto max-w-[319px] items-start gap-4">
            <div className="font-bold text-white text-3xl md:text-4xl">{text}</div>
            <p className="text-white text-base text-left">
              Memberdayakan melalui edukasi dan deteksi dini penyakit Parkinson.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-1 flex-wrap gap-8 justify-end w-full md:w-auto items-start">
            <div className="flex flex-col gap-4 min-w-[150px]">
              <div className="font-bold text-white text-base">Tautan Cepat</div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Cek Sekarang" type="footer" />
                <NavMenu text="Terapi" type="footer" />
                <NavMenu text="Artikel" type="footer" />
                <NavMenu text="Riwayat" type="footer" />
              </div>
            </div>
            <div className="flex flex-col gap-4 min-w-[150px]">
              <div className="font-bold text-white text-base">
                Alat Diagnosis
              </div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Gambar Spiral" type="footer" />
                <NavMenu text="Analisis Pola Suara" type="footer" />
              </div>
            </div>
            <div className="flex flex-col gap-4 min-w-[150px]">
              <div className="font-bold text-white text-base">Informasi</div>
              <div className="flex flex-col gap-2">
                <NavMenu text="Tentang Kami" type="footer" />
                <NavMenu text="Hubungi Kami" type="footer" />
              </div>
            </div>
          </div>
        </div>

        <hr className="w-full border-t border-neutral-600 my-6" />

        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <p className="font-medium text-white text-base text-center md:text-left">
            © 2024 Parked. Hak Cipta Dilindungi.
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end w-full md:w-auto">
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
