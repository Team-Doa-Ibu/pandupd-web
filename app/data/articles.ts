export interface Article {
  id: string;
  image: string;
  title: string;
  description: string;
  isi: string;
  likes: number;
  dislikes: number;
}

export const allArticles: Article[] = [
  {
    id: "1",
    image: "physiotherapy.png",
    title: "Fisioterapi",
    description:
      "Terapi untuk mengatasi kekakuan otot dan sendi, meningkatkan kemampuan gerak dan keseimbangan.",
    isi: `<h2>Apa itu Fisioterapi?</h2> <p>Fisioterapi adalah komponen penting dalam mengelola penyakit Parkinson. Ini melibatkan metode fisik untuk meningkatkan gerakan, fungsi, dan kesejahteraan secara keseluruhan. Bagi pasien Parkinson, fisioterapi bertujuan untuk mempertahankan dan meningkatkan mobilitas, keseimbangan, dan kualitas hidup.</p><h3>Teknik Utama Fisioterapi untuk Parkinson:</h3><ul> <li><strong>Latihan Berjalan:</strong> Meningkatkan pola berjalan dan mengurangi risiko jatuh.</li><li><strong>Latihan Keseimbangan:</strong> Meningkatkan stabilitas dan mencegah jatuh.</li><li><strong>Peregangan:</strong> Mempertahankan fleksibilitas dan mengurangi kekakuan otot.</li><li><strong>Latihan Kekuatan:</strong> Membangun kekuatan otot dan memperbaiki postur.</li> <li><strong>Latihan Aerobik:</strong> Meningkatkan kesehatan kardiovaskular dan tingkat energi.</li><li><strong>Latihan Motorik Halus:</strong> Meningkatkan ketangkasan tangan untuk tugas sehari-hari.</li></ul><h3>Proses Fisioterapi:</h3><ol><li><strong>Penilaian:</strong> Mengevaluasi kondisi dan kebutuhan spesifik pasien.</li><li><strong>Penetapan Tujuan:</strong> Menetapkan tujuan yang realistis dan dapat dicapai.</li><li><strong>Rencana Perawatan:</strong> Merancang program terapi yang dipersonalisasi.</li><li><strong>Sesi Rutin:</strong> Menerapkan latihan dan teknik di bawah bimbingan.</li><li><strong>Program Latihan di Rumah:</strong> Memberikan latihan untuk praktik berkelanjutan di rumah.</li><li><strong>Pemantauan Kemajuan:</strong> Evaluasi rutin untuk menyesuaikan rencana perawatan sesuai kebutuhan.</li></ol><p>Fisioterapi untuk Parkinson adalah proses berkelanjutan yang sering membutuhkan komitmen jangka panjang. Ini paling efektif ketika dimulai sejak dini dan dipertahankan secara konsisten sepanjang perjalanan penyakit.</p>`,
    likes: 12,
    dislikes: 2,
  },
  {
    id: "2",
    image: "speech-therapy.png",
    title: "Terapi Wicara",
    description:
      "Membantu pasien yang mengalami kesulitan berbicara dan komunikasi akibat Parkinson.",
    isi: `<h2>Apa itu Terapi Wicara untuk Parkinson?</h2> <p>Terapi wicara adalah intervensi penting untuk pasien Parkinson yang mengalami kesulitan komunikasi. Penyakit Parkinson dapat memengaruhi otot-otot yang terlibat dalam berbicara, menyebabkan suara pelan, monoton, dan kurang jelas.</p><h3>Manfaat Terapi Wicara:</h3><ul> <li><strong>Meningkatkan Volume Suara:</strong> Teknik untuk berbicara lebih keras dan jelas.</li><li><strong>Memperbaiki Artikulasi:</strong> Latihan untuk meningkatkan kejelasan ucapan.</li><li><strong>Melatih Kontrol Pernapasan:</strong> Teknik pernapasan untuk mendukung produksi suara.</li><li><strong>Meningkatkan Ekspresi Wajah:</strong> Latihan untuk mempertahankan ekspresi wajah yang penting dalam komunikasi.</li></ul><p>Terapi wicara dapat secara signifikan meningkatkan kualitas hidup pasien Parkinson dengan membantu mereka mempertahankan kemampuan berkomunikasi secara efektif.</p>`,
    likes: 12,
    dislikes: 2,
  },
  {
    id: "3",
    image: "psychoteraphy.jpg",
    title: "Psikoterapi",
    description:
      "Dukungan mental oleh psikolog untuk mengatasi dampak psikologis dari penyakit Parkinson.",
    isi: `<h2>Psikoterapi untuk Pasien Parkinson</h2> <p>Psikoterapi merupakan komponen penting dalam perawatan holistik pasien Parkinson. Diagnosis Parkinson dapat menimbulkan berbagai tantangan emosional dan psikologis yang perlu ditangani.</p><h3>Manfaat Psikoterapi:</h3><ul> <li><strong>Mengatasi Depresi dan Kecemasan:</strong> Kondisi yang sering menyertai Parkinson.</li><li><strong>Penyesuaian Terhadap Diagnosis:</strong> Membantu pasien menerima dan beradaptasi dengan kondisi mereka.</li><li><strong>Strategi Koping:</strong> Mengembangkan cara-cara sehat untuk menghadapi tantangan penyakit.</li><li><strong>Dukungan Keluarga:</strong> Melibatkan keluarga dalam proses terapi untuk meningkatkan sistem dukungan.</li></ul><p>Psikoterapi dapat dilakukan secara individual, kelompok, atau melibatkan keluarga, tergantung pada kebutuhan pasien.</p>`,
    likes: 12,
    dislikes: 2,
  },
  {
    id: "4",
    image: "DBS.jpg",
    title: "Deep Brain Stimulation (DBS)",
    description:
      "Prosedur bedah yang melibatkan pemasangan elektroda ke area otak tertentu untuk mengurangi gejala Parkinson.",
    isi: `<h2>Deep Brain Stimulation (DBS) untuk Parkinson</h2> <p>Deep Brain Stimulation adalah prosedur bedah canggih yang melibatkan pemasangan elektroda ke area otak tertentu untuk mengirimkan impuls listrik yang dapat mengurangi gejala Parkinson.</p><h3>Cara Kerja DBS:</h3><p>Elektroda ditempatkan di area otak yang terlibat dalam kontrol gerakan. Elektroda ini terhubung ke generator pulsa yang diimplan di bawah kulit di dada. Sistem ini mengirimkan stimulasi listrik ke otak untuk memblokir sinyal yang menyebabkan gejala motorik Parkinson.</p><h3>Manfaat DBS:</h3><ul> <li><strong>Pengurangan Tremor:</strong> Dapat secara signifikan mengurangi getaran.</li><li><strong>Perbaikan Kekakuan:</strong> Mengurangi kekakuan otot.</li><li><strong>Pengurangan Diskinesia:</strong> Mengurangi gerakan tidak terkontrol yang sering merupakan efek samping dari obat Parkinson.</li><li><strong>Pengurangan Dosis Obat:</strong> Memungkinkan pengurangan dosis obat Parkinson.</li></ul><p>DBS tidak menyembuhkan Parkinson, tetapi dapat secara signifikan meningkatkan kualitas hidup pasien dengan mengendalikan gejala.</p>`,
    likes: 14,
    dislikes: 7,
  },
  {
    id: "5",
    image: "gamma-knife-surgery.jpg",
    title: "Operasi Otak Gamma",
    description:
      "Teknik operasi menggunakan sinar gamma untuk menargetkan area otak tertentu.",
    isi: `<h2>Operasi Otak Gamma untuk Parkinson</h2> <p>Operasi Otak Gamma, juga dikenal sebagai Gamma Knife Surgery, adalah prosedur non-invasif yang menggunakan sinar gamma yang sangat terfokus untuk menargetkan area otak tertentu yang terlibat dalam penyakit Parkinson.</p><h3>Cara Kerja Operasi Gamma:</h3><p>Tidak seperti operasi tradisional, Gamma Knife tidak melibatkan sayatan. Sebaliknya, ratusan sinar gamma diarahkan secara tepat ke area target di otak. Radiasi ini dapat memodifikasi jaringan otak yang menyebabkan gejala Parkinson.</p><h3>Manfaat Operasi Gamma:</h3><ul> <li><strong>Non-invasif:</strong> Tidak memerlukan pembedahan terbuka.</li><li><strong>Rawat Jalan:</strong> Biasanya dilakukan sebagai prosedur rawat jalan.</li><li><strong>Pemulihan Cepat:</strong> Waktu pemulihan yang lebih singkat dibandingkan dengan operasi tradisional.</li><li><strong>Pengurangan Tremor:</strong> Terutama efektif untuk tremor yang terkait dengan Parkinson.</li></ul><p>Operasi Gamma biasanya dipertimbangkan untuk pasien yang tidak merespons dengan baik terhadap pengobatan atau yang bukan kandidat yang baik untuk DBS.</p>`,
    likes: 10,
    dislikes: 3,
  },
]; 