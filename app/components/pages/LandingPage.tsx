import { Link } from "@remix-run/react";
import {
  IconArrowUpRight,
  IconBooks,
  IconClipboardText,
  IconHourglassEmpty,
  IconLogin2,
  IconStethoscope,
} from "@tabler/icons-react";

{
  /* ================================== Feature Card Hero */
}

type FeatureCardData = {
  iconSrc: string;
  iconBg?: string;
  title: string;
  description: string;
};

const FEATURE_CARDS: FeatureCardData[] = [
  {
    iconSrc: "/AI-icon.png",
    iconBg: "bg-blue-100",
    title: "Didukung AI Canggih",
    description:
      "Teknologi kecerdasan buatan terbaru menganalisis data medis dengan tingkat akurasi tinggi, membantu deteksi dini Parkinson agar pengguna dapat mengambil langkah yang tepat lebih awal.",
  },
  {
    iconSrc: "/fast-icon.png",
    iconBg: "bg-blue-100",
    title: "Deteksi Cepat & Mudah",
    description:
      "Dengan proses sederhana dan intuitif, pengguna dapat memperoleh hasil analisis hanya dalam beberapa langkah, tanpa perlu pemeriksaan yang rumit atau memakan waktu lama.",
  },
];

const FeatureCard = ({
  iconSrc,
  iconBg = "bg-blue-100",
  title,
  description,
}: FeatureCardData) => (
  <div className="flex h-full items-start gap-4 rounded-2xl bg-white p-5 shadow">
    <div
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
    >
      <img src={iconSrc} alt={title} className="h-full w-full object-contain" />
    </div>
    <div>
      <div className="mb-1 font-bold text-neutral-800">{title}</div>
      <div className="text-sm text-neutral-600">{description}</div>
    </div>
  </div>
);

{
  /* ================================== ScreeningMethod Card */
}

type ScreeningMethod = {
  id: string;
  icon: string;
  title: string;
  image: string;
  imageAlt: string;
  tags: {
    icon: React.ReactNode;
    text: string;
    color: "blue" | "amber";
  }[];
  description: string;
};

// Constants
const SCREENING_METHODS: ScreeningMethod[] = [
  {
    id: "spiral",
    icon: "/spiral-icon.png",
    title: "Skrining dengan Gambar Spiral",
    image: "/spiral-draw.png",
    imageAlt: "Gambar spiral untuk skrining Parkinson",
    tags: [
      {
        icon: <IconHourglassEmpty size={20} />,
        text: "<1-2 Menit",
        color: "blue",
      },
      {
        icon: <IconStethoscope size={20} />,
        text: "Motorik Halus",
        color: "amber",
      },
    ],
    description:
      "Menggambar spiral membantu kami untuk menganalisis gerakan tangan untuk mendeteksi tanda-tanda awal tremor dan penyakit Parkinson.",
  },
  {
    id: "voice",
    icon: "/voice-spectrum-icon.png",
    title: "Skrining dengan Analisis Suara",
    image: "/voice-analysis.png",
    imageAlt: "Analisis suara untuk skrining Parkinson",
    tags: [
      {
        icon: <IconHourglassEmpty size={20} />,
        text: "<1-2 Menit",
        color: "blue",
      },
      {
        icon: <IconStethoscope size={20} />,
        text: "Pola Suara",
        color: "amber",
      },
    ],
    description:
      "Menganalisis perubahan nada suara untuk menganalisis pola suara untuk deteksi tanda-tanda awal penyakit Parkinson.",
  },
];

const Tag = ({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: "blue" | "amber";
}) => {
  const colorClasses = {
    blue: "border-blue-500 bg-blue-100 text-blue-500",
    amber: "border-amber-500 bg-amber-100 text-amber-500",
  };

  return (
    <div
      className={`flex items-center justify-center gap-1 rounded-full border-2 ${colorClasses[color]} px-3 py-1 text-sm font-bold`}
    >
      {icon}
      <p>{text}</p>
    </div>
  );
};

const ScreeningCard = ({ method }: { method: ScreeningMethod }) => (
  <div className="flex-1 rounded-2xl border border-neutral-300 bg-white p-4 sm:p-5 md:mb-0">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 sm:h-12 sm:w-12">
        <img
          src={method.icon}
          alt={method.title}
          className="h-full w-full object-contain"
        />
      </div>
      <h3 className="text-base font-bold text-neutral-800 sm:text-lg">
        {method.title}
      </h3>
    </div>

    <div className="mb-3 overflow-hidden rounded-lg">
      <img src={method.image} alt={method.imageAlt} className="h-auto w-full" />
    </div>

    <div className="mb-3 flex flex-wrap gap-1">
      {method.tags.map((tag, index) => (
        <Tag key={index} {...tag} />
      ))}
    </div>

    <p className="text-xs text-neutral-600 sm:text-sm">{method.description}</p>
  </div>
);

{
  /* ================================== HowItWorks Card */
}

type StepCardProps = {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  heading: string;
  description: string;
};

const STEPS_DATA: StepCardProps[] = [
  {
    stepNumber: 1,
    title: "Langkah Pertama",
    icon: <IconLogin2 size={20} />,
    heading: "Masuk",
    description:
      "Daftar atau masuk ke akun PANDU-PD Anda untuk memulai proses skrining",
  },
  {
    stepNumber: 2,
    title: "Langkah Kedua",
    icon: <IconClipboardText size={20} />,
    heading: "Pilih Metode & Lakukan",
    description:
      "Pilih satu atau lebih metode skrining yang tersedia sesuai kebutuhan Anda",
  },
  {
    stepNumber: 3,
    title: "Langkah Ketiga",
    icon: <IconStethoscope size={20} />,
    heading: "Tunggu Hasil analisis",
    description:
      "Hasil skrining akan segera tersedia setelah proses analisis selesai",
  },
];

const StepCard = ({
  stepNumber,
  title,
  icon,
  heading,
  description,
}: StepCardProps) => (
  <div className="w-full rounded-3xl border border-neutral-300 bg-neutral-100 p-3">
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-amber-200 px-5 py-3">
        <span className="font-mono font-semibold text-neutral-800">
          {title}
        </span>
        <span className="font-mono font-semibold text-neutral-800">
          {stepNumber.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1 text-neutral-800">
            {icon}
            <h3 className="font-bold">{heading}</h3>
          </div>
          <div>
            <p className="text-neutral-600">{description}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StepsSection = () => (
  <div className="max-w-6xl space-y-4 rounded-[44px] border border-amber-300 bg-amber-50 p-4 shadow-sm">
    {STEPS_DATA.map((step) => (
      <StepCard key={step.stepNumber} {...step} />
    ))}
  </div>
);

{
  /* ================================== Research Card  */
}

type ResearchItem = {
  href: string;
  text: string;
};

type ModelItem = {
  text: string;
  href: string;
};

type AnalysisCardProps = {
  title: string;
  researchSources: ResearchItem[];
  dataSources: ResearchItem[];
  models: ModelItem[];
};

const ANALYSIS_DATA: AnalysisCardProps[] = [
  {
    title: "Analisis Gambar Spiral",
    researchSources: [
      {
        href: "/",
        text: "Toye & Kompali (2021)",
      },
    ],
    dataSources: [
      {
        href: "/",
        text: "Italian Voice and Speech",
      },
      {
        href: "/",
        text: "MDVR-KCL",
      },
    ],
    models: [
      {
        href: "/",
        text: "Scikit-learn's KNN Classifier",
      },
    ],
  },
  {
    title: "Analisis Pola Suara",
    researchSources: [
      {
        href: "/",
        text: "Kamran et al. (2021)",
      },
    ],
    dataSources: [
      {
        href: "/",
        text: "NewHandPD Dataset",
      },
    ],
    models: [
      {
        text: "TensorFlow/Keras's ImageNet (Convolutional Layers/Base Model)",
        href: "/",
      },
      {
        href: "/",
        text: "TensorFlow/Keras's RasNet50 (Pre-Trained Model)",
      },
    ],
  },
];

const ResearchLink = ({ href, text }: ResearchItem) => (
  <a
    href={href}
    className="flex items-center justify-between rounded-full border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
  >
    <span className="text-xs font-bold text-neutral-700">{text}</span>
    <IconArrowUpRight size={16} className="text-neutral-700" />
  </a>
);

const ModelLink = ({ text, href }: ModelItem) => (
  <a href={href}>
    <span className="text-xs font-bold text-neutral-700 hover:text-blue-500 hover:underline">
      {text}
    </span>
  </a>
);

const AnalysisCard = ({
  title,
  researchSources,
  dataSources,
  models,
}: AnalysisCardProps) => (
  <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white">
    <div className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <IconBooks className="text-amber-500" />
        <span className="whitespace-nowrap font-bold text-neutral-800">
          {title}
        </span>
      </div>

      <div className="border-t border-neutral-300 pt-4">
        <div className="mb-2 text-sm text-neutral-500">Sumber Penelitian</div>
        <div className="mb-4 space-y-2">
          {researchSources.map((source, index) => (
            <ResearchLink key={index} {...source} />
          ))}
        </div>

        <div className="mb-2 text-sm text-neutral-500">Data</div>
        <div className="mb-4 space-y-2">
          {dataSources.map((source, index) => (
            <ResearchLink key={index} {...source} />
          ))}
        </div>

        <div className="mb-2 text-sm text-neutral-500">Model</div>
        <div className="flex flex-col gap-1">
          {models.map((model, index) => (
            <ModelLink key={index} {...model} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const LandingPage = () => {
  return (
    <div
      className="flex w-full flex-col overflow-x-hidden"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* ================= HERO SECTION ================= */}
      <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/image-5.png')" }}
          aria-hidden="true"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0 z-10 bg-neutral-800/40"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-20 mx-auto flex w-full flex-col gap-10 px-4 pb-12 pt-32 sm:max-w-6xl">
          {/* Headline & CTA */}
          <div className="flex flex-col gap-3 sm:gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 text-pretty text-center sm:text-start">
              <h1 className="mb-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                Sistem Deteksi Dini
                <br />
                Penyakit <span className="text-amber-500">Parkinson</span>
                <br />
                Berbasis <span className="text-blue-400">AI</span>
              </h1>
            </div>
            <div className="flex flex-1 flex-col gap-4 text-pretty text-center sm:text-start">
              <p className="px-4 text-sm text-white sm:px-0 sm:text-base">
                Teknologi kecerdasan buatan kami membantu mengidentifikasi
                tanda-tanda awal Parkinson dengan cepat dan akurat. Ambil
                langkah pencegahan sekarang untuk masa depan yang lebih baik.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-4">
                <Link
                  to="/deteksi"
                  className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600"
                >
                  Coba Sekarang
                </Link>
                <button className="rounded-full bg-white px-6 py-2 font-semibold text-neutral-800 transition hover:bg-blue-50">
                  Pelajari lebih
                </button>
              </div>
            </div>
          </div>

          {/* Card Section*/}
          <div className="flex w-full flex-col gap-6 md:flex-row">
            <div className="flex w-full flex-col gap-4 rounded-3xl bg-white/20 p-4 shadow-lg backdrop-blur-sm md:flex-row">
              {/* Left: Image Card */}
              <div className="relative flex max-h-[340px] min-h-[260px] flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-neutral-800/80 shadow-lg">
                <img
                  src="/image-4.png"
                  alt="Parkinson"
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <p className="mb-1 text-lg font-bold text-amber-400 drop-shadow sm:text-xl">
                    Jangan Tunggu Gejala Muncul!
                  </p>
                  <p className="text-sm text-white drop-shadow">
                    Cegah lebih awal untuk kehidupan yang lebih berkualitas.
                  </p>
                </div>
              </div>

              {/* Right: Feature Cards */}
              <div className="flex h-full flex-1 flex-col gap-4">
                <div className="flex h-full flex-1 flex-col gap-4">
                  {FEATURE_CARDS.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INFO SECTION ================= */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <div className="w-full md:w-[40%]">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/Neuron.png"
                  alt="Ilustrasi neuron Parkinson dengan statistik"
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Teks informasi */}
            <div className="w-full px-2 md:w-[60%]">
              <h2 className="mb-3 text-2xl font-bold text-neutral-800 md:text-3xl">
                Apa itu <span className="text-amber-500">PARKINSON?</span>
              </h2>
              <p className="mb-4 text-sm italic text-neutral-700">
                Penyakit Parkinson adalah gangguan sistem saraf progresif yang
                mempengaruhi gerakan.
              </p>
              <p className="text-sm leading-relaxed text-neutral-600">
                Gejala dimulai secara bertahap, terkadang dengan tremor yang
                hampir tidak terlihat pada satu tangan. Tremor adalah gejala
                umum, tetapi gangguan ini juga sering menyebabkan kekakuan atau
                perlambatan gerakan. Pada tahap awal penyakit Parkinson, wajah
                Anda mungkin menunjukkan sedikit atau tidak ada ekspresi. Lengan
                Anda mungkin tidak berayun saat Anda berjalan. Suara Anda
                mungkin menjadi lembut atau pelo. Gejala penyakit Parkinson
                memburuk seiring berjalannya waktu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= METHODE SECTION ================= */}
      <section className="w-full bg-neutral-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-neutral-800 md:text-3xl">
            Metode <span className="text-amber-500">PREDIKSI</span>
          </h2>
          <p className="mb-8 text-center text-sm text-neutral-600">
            Platform kami menyediakan dua fitur utama untuk mendeteksi
            kemungkinan penyakit Parkinson
          </p>

          {/* Card Container dengan background abu-abu */}
          <div className="rounded-3xl border border-neutral-400 bg-neutral-200 p-4 shadow-md sm:p-4">
            {/* Card putih yang terbagi dua dengan gap di tengah */}
            <div className="flex flex-col space-y-4 md:space-y-0  md:flex-row md:gap-4">
              {SCREENING_METHODS.map((method) => (
                <ScreeningCard key={method.id} method={method} />
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center sm:mt-10">
            <Link
              to="/deteksi"
              className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white shadow-inner shadow-white/50 transition hover:bg-blue-600"
            >
              Coba Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold text-neutral-800 md:text-3xl">
            Bagaimana cara menggunakan{" "}
            <span className="text-amber-500">PANDU‑PD?</span>
          </h2>
          <p className="mb-8 text-center text-sm text-neutral-600">
            Ikuti langkah sederhana ini untuk menggunakan platform kami
          </p>
          <StepsSection />
        </div>
      </section>

      {/* ================= ABOUT OUR TOOLS SECTION ================= */}
      <section className="w-full bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          {/* Judul di tengah */}
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-neutral-800 md:text-3xl">
              Tentang{" "}
              <span className="text-amber-500">Alat Prediksi Parkinson</span>{" "}
              kami
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Memahami Alat Prediksi Parkinson
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Bagian kiri - Teks */}
            <div className="flex w-full flex-col justify-between lg:w-1/2">
              <div className="mb-8 text-sm leading-relaxed text-neutral-700">
                <p className="text-pretty">
                  Model pembelajaran mesin kami dilatih menggunakan kumpulan
                  data pasien yang besar untuk mengidentifikasi pola dari
                  penderita yang menunjukkan penyakit Parkinson. Dengan
                  menganalisis rekaman suara, sampel tulisan tangan, dan pola
                  cara berjalan, algoritma kami dapat mendeteksi perubahan halus
                  yang mungkin menunjukkan tahap awal penyakit. Keuntungan
                  menggunakan pembelajaran mesin termasuk akurasi yang lebih
                  tinggi, deteksi dini, dan kemampuan untuk terus meningkat
                  seiring bertambahnya data yang dikumpulkan.
                </p>
              </div>

              {/* Bagian kartu metode */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ANALYSIS_DATA.map((data, index) => (
                  <AnalysisCard key={index} {...data} />
                ))}
              </div>
            </div>

            {/* Bagian kanan - Gambar */}
            <div className="order-first mt-8 w-full lg:order-last lg:mt-0 lg:w-1/2">
              <div className="overflow-hidden rounded-lg">
                <img
                  src="/processor-image.png"
                  alt="Ilustrasi chip AI untuk prediksi Parkinson"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
