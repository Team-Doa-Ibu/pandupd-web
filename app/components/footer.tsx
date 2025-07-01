import PropTypes from "prop-types";
import React from "react";
import { NavMenu } from "./footer-menu";

export const Footer = ({ text = "Parked", line = "line-4.svg" }) => {
  return (
    <div className="w-[1440px] h-[512px] bg-neutral-800">
      <div className="flex flex-col w-[1152px] items-start gap-6 relative top-[101px] left-36">
        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex flex-col w-[319px] items-start gap-6 relative">
            <div className="relative self-stretch mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-white text-4xl tracking-[0] leading-[normal]">
              {text}
            </div>

            <p className="relative self-stretch [font-family:'Lato',Helvetica] text-white text-base tracking-[0] leading-[normal]">
              Memberdayakan melalui edukasi dan deteksi dini penyakit Parkinson.
            </p>
          </div>

          <div className="flex w-[489px] items-start gap-6 relative">
            <div className="flex flex-col items-start gap-6 relative flex-1 grow">
              <div className="flex items-center justify-center gap-2.5 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex-1 mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal]">
                  Tautan Cepat
                </div>
              </div>

              <div className="flex flex-col items-start justify-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                <NavMenu
                  className="!flex-[0_0_auto]"
                  stateProp="default"
                  text="Cek Sekarang"
                  type="footer"
                />
                <NavMenu
                  className="!flex-[0_0_auto]"
                  stateProp="default"
                  text="Terapi"
                  type="footer"
                />
                <NavMenu
                  className="!flex-[0_0_auto]"
                  stateProp="default"
                  text="Artikel"
                  type="footer"
                />
                <NavMenu
                  className="!flex-[0_0_auto]"
                  stateProp="default"
                  text="Riwayat"
                  type="footer"
                />
              </div>
            </div>

            <div className="flex flex-col items-start justify-center gap-6 relative flex-1 grow">
              <div className="flex items-center justify-center gap-2.5 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex-1 mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal]">
                  Alat Diagnosis
                </div>
              </div>

              <div className="flex flex-col items-start justify-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                <NavMenu
                  className="!flex-[0_0_auto]"
                  stateProp="default"
                  text="Gambar Spiral"
                  type="footer"
                />
                <NavMenu
                  className="!mr-[-4.00px] !flex-[0_0_auto]"
                  stateProp="default"
                  text="Analisis Pola Suara"
                  type="footer"
                />
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 relative flex-1 grow">
              <div className="flex items-center justify-center gap-2.5 px-2.5 py-0 relative self-stretch w-full flex-[0_0_auto]">
                <div className="relative flex-1 mt-[-1.00px] [font-family:'Lato-Bold',Helvetica] font-bold text-white text-base tracking-[0] leading-[normal]">
                  Informasi
                </div>
              </div>

              <div className="flex flex-col items-start justify-center gap-[15px] relative self-stretch w-full flex-[0_0_auto]">
                <NavMenu
                  className="!self-stretch !flex-[0_0_auto] ![justify-content:unset] !flex !w-full"
                  stateProp="default"
                  text="Tentang Kami"
                  type="footer"
                />
                <NavMenu
                  className="!flex-[0_0_auto] ![justify-content:unset]"
                  stateProp="default"
                  text="Hubungi Kami"
                  type="footer"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="relative self-stretch w-full border-t border-neutral-600 my-6" />

        <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
          <p className="relative w-fit [font-family:'Lato-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            © 2024 Parked. Hak Cipta Dilindungi.
          </p>

          <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
            <NavMenu
              className="!flex-[0_0_auto]"
              stateProp="default"
              text="Kebijakan Privasi"
              type="footer"
            />
            <NavMenu
              className="!flex-[0_0_auto]"
              stateProp="default"
              text="Ketentuan Layanan"
              type="footer"
            />
            <NavMenu
              className="!flex-[0_0_auto]"
              stateProp="default"
              text="Kebijakan Cookie"
              type="footer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Footer.propTypes = {
  text: PropTypes.string,
  line: PropTypes.string,
};
