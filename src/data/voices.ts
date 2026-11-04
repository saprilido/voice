export interface Voice {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  pitch: 'Higher pitch' | 'Middle pitch' | 'Lower pitch';
  trait: string;
  styleTag: string;
  description: string;
  sampleEn: string;
  sampleId: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  tags: string[];
}

export const GEMINI_VOICES: Voice[] = [
  {
    id: 'Aoede',
    name: 'Aoede',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Breezy & Soft',
    styleTag: 'Soft Female',
    description: 'Suara wanita lembut dan santai dengan intonasi natural, sangat pas untuk narasi santai, wellness, dan audiobook.',
    sampleEn: 'Welcome back. Take a deep breath and let yourself unwind as we begin today’s relaxing journey.',
    sampleId: 'Selamat datang. Tarik napas dalam-dalam dan nikmati setiap detik dari perjalanan santai kita hari ini.',
    accentColor: 'from-pink-500 to-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-600',
    tags: ['Santai', 'Lembut', 'Audiobook', 'Wellness']
  },
  {
    id: 'Achernar',
    name: 'Achernar',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Friendly & Warm',
    styleTag: 'Friendly Male',
    description: 'Nada pria hangat dan ramah dengan artikulasi yang mengalir alami, cocok untuk tutorial, podcast, dan obrolan kasual.',
    sampleEn: 'Hey there! It’s great to have you with us today. Let’s dive straight into the latest updates.',
    sampleId: 'Halo semuanya! Senang sekali Anda bisa bergabung bersama kami. Mari langsung kita bahas informasi terbarunya.',
    accentColor: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-600',
    tags: ['Ramah', 'Hangat', 'Podcast', 'Tutorial']
  },
  {
    id: 'Alkaid',
    name: 'Alkaid',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Gravelly & Resonant',
    styleTag: 'Gravelly Male',
    description: 'Karakter suara pria berat dan bertekstur unik, memberi kesan dramatis, sinematik, dan berwibawa.',
    sampleEn: 'Deep in the heart of the ancient forest, a forgotten myth begins to stir once again.',
    sampleId: 'Jauh di pedalaman hutan kuno yang sunyi, sebuah legenda yang telah lama terlupakan bangkit kembali.',
    accentColor: 'from-stone-600 to-stone-800',
    badgeBg: 'bg-stone-100 text-stone-700 border-stone-300',
    badgeText: 'text-stone-700',
    tags: ['Berat', 'Dramatis', 'Sinematik', 'Narasi']
  },
  {
    id: 'Algol',
    name: 'Algol',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Smooth & Suave',
    styleTag: 'Smooth Male',
    description: 'Suara pria yang tenang, halus bagai beledu dengan pembawaan percaya diri untuk iklan premium dan presentasi.',
    sampleEn: 'Precision engineering meets timeless elegance. Experience comfort crafted just for you.',
    sampleId: 'Presisi teknologi berpadu dengan keanggunan abadi. Nikmati kenyamanan berkelas yang dirancang khusus untuk Anda.',
    accentColor: 'from-indigo-500 to-blue-600',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-600',
    tags: ['Halus', 'Premium', 'Iklan', 'Korporat']
  },
  {
    id: 'Alnilam',
    name: 'Alnilam',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Firm & Steady',
    styleTag: 'Firm Male',
    description: 'Penyampaian tegas, konsisten, dan membumi dengan intonasi jelas yang sangat cocok untuk berita dan panduan resmi.',
    sampleEn: 'All systems are operating within normal parameters. Standing by for protocol verification.',
    sampleId: 'Seluruh sistem beroperasi dalam parameter normal. Menunggu verifikasi protokol berikutnya.',
    accentColor: 'from-blue-600 to-slate-700',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-600',
    tags: ['Tegas', 'Mantap', 'Berita', 'Instruksi']
  },
  {
    id: 'Autonoe',
    name: 'Autonoe',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Bright & Vibrant',
    styleTag: 'Bright Female',
    description: 'Suara wanita ceria, hidup, dan penuh semangat dengan artikulasi segar yang cocok untuk konten kreatif dan iklan produk.',
    sampleEn: 'Good morning! Get ready to supercharge your creativity with today’s exciting challenges!',
    sampleId: 'Selamat pagi! Bersiaplah meningkatkan kreativitas dan energi positif Anda dengan ide-ide seru hari ini!',
    accentColor: 'from-yellow-500 to-amber-500',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeText: 'text-amber-600',
    tags: ['Ceria', 'Semangat', 'Sosial Media', 'Kreatif']
  },
  {
    id: 'Callirrhoe',
    name: 'Callirrhoe',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Easy-going & Approachable',
    styleTag: 'Easy-going Female',
    description: 'Irama bicara santai, bersahabat, dan menenangkan, ideal untuk percakapan sehari-hari dan asisten virtual.',
    sampleEn: 'No worries at all! Let’s figure this out together step by step, whenever you’re ready.',
    sampleId: 'Tidak perlu khawatir! Mari kita selesaikan ini bersama-sama langkah demi langkah dengan santai.',
    accentColor: 'from-teal-500 to-emerald-600',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeText: 'text-teal-600',
    tags: ['Santai', 'Bersahabat', 'Asisten', 'Kasual']
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Deep & Informative',
    styleTag: 'Deep Male',
    description: 'Karakter suara pria berwibawa, dalam, dan informatif yang memberikan rasa tenang dan otoritas profesional.',
    sampleEn: 'Throughout history, pivotal discoveries have redefined our understanding of science and humanity.',
    sampleId: 'Sepanjang sejarah peradaban, penemuan-penemuan besar telah mengubah cara pandang kita terhadap alam semesta.',
    accentColor: 'from-slate-700 to-slate-900',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    badgeText: 'text-slate-700',
    tags: ['Berwibawa', 'Dokumenter', 'Edukasi', 'Profesional']
  },
  {
    id: 'Despina',
    name: 'Despina',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Silky & Delicate',
    styleTag: 'Smooth Female',
    description: 'Vokal wanita halus dan anggun dengan sentuhan kehangatan yang pas untuk promosi elegan dan penceritaan naratif.',
    sampleEn: 'Every crafted piece tells an intimate tale of dedication, beauty, and subtle craftsmanship.',
    sampleId: 'Setiap karya yang tercipta mengisahkan dedikasi, keindahan, dan sentuhan seni yang begitu berharga.',
    accentColor: 'from-purple-500 to-indigo-600',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-600',
    tags: ['Anggun', 'Elegan', 'Narasi', 'Promosi']
  },
  {
    id: 'Enceladus',
    name: 'Enceladus',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Breathy & Intimate',
    styleTag: 'Breathy Male',
    description: 'Tekstur suara pria bernapas lembut dengan karakter mikrofon dekat, memberikan suasana akrab dan reflektif.',
    sampleEn: 'Listen closely. Sometimes the quietest moments hold the answers we have been searching for.',
    sampleId: 'Dengarkan baik-baik. Terkadang momen paling hening menyimpan jawaban yang selama ini kita cari.',
    accentColor: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    badgeText: 'text-cyan-600',
    tags: ['Intim', 'Reflektif', 'Meditasi', 'Puisi']
  },
  {
    id: 'Erinome',
    name: 'Erinome',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Clear & Lucid',
    styleTag: 'Clear Female',
    description: 'Artikulasi jernih, seimbang, dan mudah dipahami, menjadi pilihan terbaik untuk penjelasan materi dan e-learning.',
    sampleEn: 'In today’s lesson, we will explore key principles and evaluate practical case studies.',
    sampleId: 'Dalam materi pembelajaran kali ini, kita akan mempelajari prinsip-prinsip utama dan studi kasusnya.',
    accentColor: 'from-sky-500 to-blue-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-600',
    tags: ['Jernih', 'E-Learning', 'Edukasi', 'Tutorial']
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Dynamic & Excitable',
    styleTag: 'Dynamic Male',
    description: 'Gaya bicara pria energik, autentik, dan dinamis yang memikat perhatian pendengar untuk game dan konten aksi.',
    sampleEn: 'Unleash your full potential! We are pushing past every boundary on this mission!',
    sampleId: 'Kerahkan seluruh kemampuan terbaikmu! Kita akan melampaui segala batas dalam petualangan ini!',
    accentColor: 'from-red-500 to-amber-600',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
    badgeText: 'text-red-600',
    tags: ['Energik', 'Dinamis', 'Gaming', 'Aksi']
  },
  {
    id: 'Gacrux',
    name: 'Gacrux',
    gender: 'Male',
    pitch: 'Middle pitch',
    trait: 'Mature & Experienced',
    styleTag: 'Mature Male',
    description: 'Nada pria matang dan bijaksana dengan intonasi stabil, memberikan kesan mentor dan penutur kisah berpengalaman.',
    sampleEn: 'Over many decades of discovery, one truth remains: persistence is the mother of all mastery.',
    sampleId: 'Dari sekian lama pengalaman yang terlalui, satu hal pasti: ketekunan adalah kunci dari keberhasilan.',
    accentColor: 'from-orange-600 to-stone-700',
    badgeBg: 'bg-orange-50 text-orange-800 border-orange-200',
    badgeText: 'text-orange-600',
    tags: ['Matang', 'Bijaksana', 'Mentor', 'Audiobook']
  },
  {
    id: 'Iapetus',
    name: 'Iapetus',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Poised & Balanced',
    styleTag: 'Poised Male',
    description: 'Suara pria yang tenang dan terkontrol dengan keseimbangan ritme yang rapi, ideal untuk presentasi profesional.',
    sampleEn: 'Our strategic roadmap is designed to deliver sustained value and scalable performance.',
    sampleId: 'Rencana strategis kami dirancang untuk menghadirkan nilai berkelanjutan dan hasil yang terukur.',
    accentColor: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-600',
    tags: ['Tenang', 'Profesional', 'Presentasi', 'Bisnis']
  },
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Firm & Confident',
    styleTag: 'Firm Female',
    description: 'Vokal wanita tegas, mantap, dan berkarakter kuat, sangat populer untuk pengumuman penting dan narasi utama.',
    sampleEn: 'Attention all passengers: the express flight to Tokyo is now preparing for boarding at Gate 4.',
    sampleId: 'Perhatian para penumpang: penerbangan langsung menuju Tokyo kini telah siap untuk proses boarding.',
    accentColor: 'from-violet-600 to-purple-700',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    badgeText: 'text-violet-600',
    tags: ['Tegas', 'Percaya Diri', 'Pengumuman', 'Utama']
  },
  {
    id: 'Leda',
    name: 'Leda',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Youthful & Vibrant',
    styleTag: 'Youthful Female',
    description: 'Suara wanita muda yang riang, antusias, dan ramah, sempurna untuk video interaktif, game, dan vlog.',
    sampleEn: 'Hey guys! You won’t believe what just happened today, let’s check it out together!',
    sampleId: 'Hai teman-teman! Kalian pasti tidak akan percaya apa yang baru saja terjadi hari ini, yuk kita lihat!',
    accentColor: 'from-fuchsia-500 to-pink-600',
    badgeBg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    badgeText: 'text-fuchsia-600',
    tags: ['Muda', 'Antusias', 'Vlog', 'Interaktif']
  },
  {
    id: 'Orus',
    name: 'Orus',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Bold & Deep',
    styleTag: 'Bold Male',
    description: 'Suara pria yang tegap dan berwibawa tinggi, memberikan kesan gagah dan meyakinkan untuk trailer dan promosi.',
    sampleEn: 'A new chapter begins today. Prepare yourself for the ultimate adventure of a lifetime.',
    sampleId: 'Sebuah babak baru dimulai hari ini. Persiapkan diri Anda untuk petualangan terbesar sepanjang masa.',
    accentColor: 'from-blue-700 to-indigo-900',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeText: 'text-blue-700',
    tags: ['Gagah', 'Trailer', 'Iklan', 'Kuat']
  },
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Male',
    pitch: 'Middle pitch',
    trait: 'Upbeat & Lively',
    styleTag: 'Upbeat Male',
    description: 'Nada pria lincah, ceria, dan penuh energi positif yang menjadi favorit untuk podcast kasual dan media sosial.',
    sampleEn: 'Welcome back to the stream! Smash that like button and let’s get right into the action!',
    sampleId: 'Halo semuanya! Selamat datang kembali, jangan lupa klik suka dan mari kita mulai keseruan hari ini!',
    accentColor: 'from-amber-500 to-yellow-600',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-600',
    tags: ['Lincah', 'Ceria', 'Podcast', 'Sosial Media']
  },
  {
    id: 'Umbriel',
    name: 'Umbriel',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Calm & Resolute',
    styleTag: 'Calm Male',
    description: 'Suara pria tenang dan mantap dengan stabilitas yang menenteramkan untuk panduan meditasi dan audio instruksional.',
    sampleEn: 'Allow your mind to settle. Focus purely on each breath as tension gently leaves your body.',
    sampleId: 'Tenangkan pikiran Anda. Fokuslah pada hembusan napas saat segala ketegangan perlahan mereda.',
    accentColor: 'from-slate-600 to-slate-800',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
    badgeText: 'text-slate-700',
    tags: ['Tenang', 'Meditasi', 'Relaksasi', 'Instruksi']
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Bright & Crisp',
    styleTag: 'Bright Female',
    description: 'Vokal wanita segar, bersemangat, dan artikulatif yang memberikan daya tarik positif untuk konten modern.',
    sampleEn: 'Discover a smarter way to connect ideas and transform your daily productivity with ease.',
    sampleId: 'Temukan cara yang lebih cerdas untuk menghubungkan ide dan meningkatkan produktivitas harian Anda.',
    accentColor: 'from-sky-400 to-blue-500',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-600',
    tags: ['Segar', 'Produktivitas', 'Teknologi', 'Modern']
  },
  {
    id: 'Algieba',
    name: 'Algieba',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Velvet & Suave',
    styleTag: 'Smooth Male',
    description: 'Nada pria elegan bernuansa hangat dengan tempo tertata, pas untuk konten storytelling berkelas.',
    sampleEn: 'Beneath the starry canopy, the tranquil city rested in quiet contemplation and peace.',
    sampleId: 'Di bawah hamparan langit bertabur bintang, kota yang tenang beristirahat dalam kedamaian.',
    accentColor: 'from-purple-600 to-indigo-800',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-600',
    tags: ['Elegan', 'Storytelling', 'Halus', 'Hangat']
  },
  {
    id: 'Algenib',
    name: 'Algenib',
    gender: 'Male',
    pitch: 'Middle pitch',
    trait: 'Confident & Direct',
    styleTag: 'Direct Male',
    description: 'Karakter pria lugas dan percaya diri yang langsung pada inti informasi, cocok untuk briefing bisnis.',
    sampleEn: 'Here is the quarterly summary: growth metrics exceeded targets across all key sectors.',
    sampleId: 'Berikut rangkuman kuartal ini: pertumbuhan melampaui target yang ditetapkan di semua sektor.',
    accentColor: 'from-blue-600 to-cyan-700',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    badgeText: 'text-blue-600',
    tags: ['Lugas', 'Bisnis', 'Briefing', 'Tegas']
  },
  {
    id: 'Rasalgethi',
    name: 'Rasalgethi',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Resonant & Rich',
    styleTag: 'Rich Male',
    description: 'Suara pria beresonansi tebal dengan kedalaman vokal yang memukau untuk dokumenter sejarah dan sains.',
    sampleEn: 'Galaxies millions of light years away hold secrets waiting to be unlocked by modern telescopes.',
    sampleId: 'Galaksi yang berjarak jutaan tahun cahaya menyimpan rahasia besar yang kini mulai terungkap.',
    accentColor: 'from-amber-700 to-stone-900',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    badgeText: 'text-stone-700',
    tags: ['Resonan', 'Dokumenter', 'Sains', 'Mendalam']
  },
  {
    id: 'Laomedeia',
    name: 'Laomedeia',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Playful & Upbeat',
    styleTag: 'Playful Female',
    description: 'Karakter wanita riang, lincah, dan ekspresif dengan intonasi playful untuk animasi dan konten anak.',
    sampleEn: 'Once upon a time in a magical garden, tiny fireflies lit up the midnight sky with sparklers!',
    sampleId: 'Pada suatu ketika di taman ajaib, kunang-kunang kecil menerangi malam dengan cahaya keemasan!',
    accentColor: 'from-pink-400 to-rose-500',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
    badgeText: 'text-pink-600',
    tags: ['Ceria', 'Animasi', 'Anak-anak', 'Ekspresif']
  },
  {
    id: 'Schedar',
    name: 'Schedar',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Commanding & Deep',
    styleTag: 'Commanding Male',
    description: 'Vokal pria tegas berkharisma tinggi yang memberikan bobot kredibilitas kuat untuk pidato dan narasi monumental.',
    sampleEn: 'Leadership requires unwavering conviction, clear vision, and compassion in action.',
    sampleId: 'Kepemimpinan sejati membutuhkan keteguhan hati, visi yang jernih, dan tindakan yang nyata.',
    accentColor: 'from-indigo-700 to-slate-900',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    badgeText: 'text-indigo-700',
    tags: ['Kharismatik', 'Pidato', 'Berbobot', 'Otoritas']
  },
  {
    id: 'Pulcherrima',
    name: 'Pulcherrima',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Gentle & Melodic',
    styleTag: 'Melodic Female',
    description: 'Suara wanita lembut berirama merdu yang memancarkan ketenangan dan kenyamanan pendengar.',
    sampleEn: 'Peace begins from within. Cherish each breath and treasure the calm stillness around you.',
    sampleId: 'Kedamaian bermula dari dalam diri. Nikmati setiap napas dan resapi ketenangan di sekeliling Anda.',
    accentColor: 'from-violet-400 to-fuchsia-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    badgeText: 'text-violet-600',
    tags: ['Merdu', 'Lembut', 'Relaksasi', 'Ketenangan']
  },
  {
    id: 'Achird',
    name: 'Achird',
    gender: 'Male',
    pitch: 'Middle pitch',
    trait: 'Crisp & Articulate',
    styleTag: 'Crisp Male',
    description: 'Artikulasi tajam dan pengucapan bersih tanpa cela, sangat pas untuk panduan audio teknis dan dokumentasi.',
    sampleEn: 'Initialize step four by validating cryptographic hashes before starting data migration.',
    sampleId: 'Mulai langkah keempat dengan memvalidasi hash kriptografis sebelum migrasi data dijalankan.',
    accentColor: 'from-teal-600 to-cyan-700',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    badgeText: 'text-teal-600',
    tags: ['Artikulatif', 'Teknis', 'Jelas', 'Presisi']
  },
  {
    id: 'Zubenelgenubi',
    name: 'Zubenelgenubi',
    gender: 'Male',
    pitch: 'Lower pitch',
    trait: 'Dramatic & Heavy',
    styleTag: 'Dramatic Male',
    description: 'Suara pria yang kaya resonansi dan berbobot berat untuk peran dramatis, thriller, dan narasi mendalam.',
    sampleEn: 'In the shadows of midnight, secrets held for centuries finally began to unravel.',
    sampleId: 'Di balik bayang-bayang kegelapan malam, rahasia berabad-abad akhirnya mulai terungkap.',
    accentColor: 'from-purple-800 to-slate-900',
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
    badgeText: 'text-purple-700',
    tags: ['Dramatis', 'Thriller', 'Berat', 'Misterius']
  },
  {
    id: 'Vindemiatrix',
    name: 'Vindemiatrix',
    gender: 'Female',
    pitch: 'Higher pitch',
    trait: 'Serene & Warm',
    styleTag: 'Serene Female',
    description: 'Suara wanita teduh dan menyejukkan hati, sangat ideal untuk panduan meditasi dan cerita menjelang tidur.',
    sampleEn: 'Let all your thoughts drift away softly, like gentle ripples across a quiet lake at dusk.',
    sampleId: 'Biarkan pikiran Anda mengalir tenang, seperti riak air di danau yang damai saat senja.',
    accentColor: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-600',
    tags: ['Teduh', 'Meditasi', 'Tidur', 'Menenangkan']
  },
  {
    id: 'Sadachbia',
    name: 'Sadachbia',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Soft & Conversational',
    styleTag: 'Natural Female',
    description: 'Gaya bicara natural layaknya sahabat dekat, sangat pas untuk konten media sosial dan ulasan santai.',
    sampleEn: 'I tried out this new workflow yesterday, and honestly, it completely transformed my day.',
    sampleId: 'Kemarin saya mencoba metode kerja baru ini, dan hasilnya benar-benar membuat hari jauh lebih efisien.',
    accentColor: 'from-amber-400 to-rose-400',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-600',
    tags: ['Natural', 'Sahabat', 'Review', 'Sosial']
  },
  {
    id: 'Sadaltager',
    name: 'Sadaltager',
    gender: 'Male',
    pitch: 'Middle pitch',
    trait: 'Casual & Approachable',
    styleTag: 'Casual Male',
    description: 'Vokal pria santai dan natural yang terdengar akrab, sangat serasi untuk dialog kasual dan podcast santai.',
    sampleEn: 'That’s a really great point! Let’s think about how that works in real everyday scenarios.',
    sampleId: 'Poin yang sangat menarik! Mari kita diskusikan bagaimana penerapannya dalam kehidupan sehari-hari.',
    accentColor: 'from-sky-600 to-indigo-600',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-600',
    tags: ['Santai', 'Akrab', 'Diskusi', 'Kasual']
  },
  {
    id: 'Sulafat',
    name: 'Sulafat',
    gender: 'Female',
    pitch: 'Middle pitch',
    trait: 'Melodic & Warm',
    styleTag: 'Warm Female',
    description: 'Suara wanita berintonasi hangat dengan musikalitas tutur yang memikat hati pendengar untuk narasi sastra.',
    sampleEn: 'Words carry melodies of their own when spoken with sincerity, warmth, and emotion.',
    sampleId: 'Setiap kata memiliki melodinya sendiri saat diucapkan dengan ketulusan dan kehangatan rasa.',
    accentColor: 'from-rose-500 to-amber-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-600',
    tags: ['Hangat', 'Sastra', 'Emosional', 'Narasi']
  }
];

export const PRESET_SCRIPTS = [
  {
    title: 'Narasi YouTube Edukatif',
    category: 'YouTube',
    lang: 'id',
    text: 'Halo semuanya! Selamat datang kembali di channel ini. Pada video kali ini, kita akan mengungkap bagaimana kecerdasan buatan Gemini merevolusi cara kita berkomunikasi dan bekerja.'
  },
  {
    title: 'Customer Service Profesional',
    category: 'Bisnis',
    lang: 'id',
    text: 'Selamat datang di layanan bantuan prioritas kami. Untuk informasi tagihan tekan satu, untuk konsultasi produk tekan dua, atau tetap terhubung untuk berbicara dengan staf spesialis kami.'
  },
  {
    title: 'Pengumuman Bandara / Stasiun',
    category: 'Pengumuman',
    lang: 'id',
    text: 'Perhatian para penumpang, penerbangan Nusantara Air nomor penerbangan NA 402 tujuan Denpasar siap untuk menaiki pesawat melalui pintu lima. Pastikan kartu identitas dan boarding pass Anda telah siap.'
  },
  {
    title: 'Audiobook & Cerita Fantasi',
    category: 'Cerita',
    lang: 'id',
    text: 'Malam itu kabut turun perlahan menyelimuti lembah Sunyi. Di puncak bukit tertua, menara batu kuno mulai memancarkan cahaya biru safir yang sudah padam selama seribu tahun.'
  },
  {
    title: 'Motivasi & Podcast Intro',
    category: 'Podcast',
    lang: 'id',
    text: 'Setiap langkah kecil yang kamu ambil hari ini adalah batu loncatan menuju mimpi terbesarmu. Jangan biarkan keraguan menghentikan langkahmu, karena kesuksesan milik mereka yang berani mencoba.'
  },
  {
    title: 'Tech Review & Product Launch',
    category: 'Review',
    lang: 'en',
    text: 'Introducing the next generation of seamless text-to-speech. Built on cutting-edge neural audio models, delivering unmatched clarity, emotion, and conversational dynamics.'
  }
];

export const STUDIO_STYLES = [
  {
    id: 'Vocal Smile',
    label: 'Vocal Smile',
    description: "The 'Vocal Smile'. The soft palate is raised to keep the tone bright, sunny, and explicitly inviting.",
    prompt: 'Deliver with a warm, genuine vocal smile, keeping the tone bright, sunny, and inviting.'
  },
  {
    id: 'Newscaster',
    label: 'Newscaster',
    description: 'Professional, authoritative, clear articulation with standard broadcast cadence.',
    prompt: 'Deliver in a professional, authoritative, clear newscaster broadcast style with standard cadence.'
  },
  {
    id: 'Whisper',
    label: 'Whisper',
    description: 'Intimate, breathy, close-to-mic proximity effect.',
    prompt: 'Deliver in an intimate, breathy whispered tone with close-to-mic proximity effect.'
  },
  {
    id: 'Empathetic',
    label: 'Empathetic',
    description: 'Warm, understanding, soft tone with gentle inflections.',
    prompt: 'Deliver with warm, understanding, empathetic soft tone and gentle inflections.'
  },
  {
    id: 'Promo/Hype',
    label: 'Promo/Hype',
    description: 'High energy, punchy consonants, elongated vowels on excitement words.',
    prompt: 'Deliver with high energy promo/hype, punchy consonants, and enthusiastic excitement.'
  },
  {
    id: 'Deadpan',
    label: 'Deadpan',
    description: 'Flat affect, minimal pitch variation, dry delivery.',
    prompt: 'Deliver with flat affect, minimal pitch variation, calm and dry deadpan delivery.'
  }
];

export const STUDIO_PACES = [
  {
    id: 'Natural',
    label: 'Natural',
    description: 'Natural conversational pace.',
    prompt: 'Natural conversational pace.'
  },
  {
    id: 'Rapid Fire',
    label: 'Rapid Fire',
    description: 'Fast, energetic, no dead air. Sentences overlap slightly.',
    prompt: 'Fast, energetic rapid-fire pace with no dead air and crisp overlaps.'
  },
  {
    id: 'The Drift',
    label: 'The Drift',
    description: 'Slow, liquid, zero urgency. Long pauses for breath.',
    prompt: 'Slow, liquid leisurely pace with zero urgency and long pauses for breath.'
  },
  {
    id: 'Staccato',
    label: 'Staccato',
    description: 'Short, clipped sentences with distinct pauses between words.',
    prompt: 'Staccato cadence with short clipped phrases and distinct rhythmic pauses.'
  }
];

export const STUDIO_ACCENTS = [
  { id: 'Neutral', label: 'Neutral', prompt: 'Neutral, clean pronunciation.' },
  { id: 'American (Gen)', label: 'American (Gen)', prompt: 'General American standard accent.' },
  { id: 'American (Valley)', label: 'American (Valley)', prompt: 'American Valley tone with expressive intonation.' },
  { id: 'American (South)', label: 'American (South)', prompt: 'American Southern warm relaxed drawl.' },
  { id: 'British (RP)', label: 'British (RP)', prompt: 'Received Pronunciation British standard accent.' },
  { id: 'British (Brixton)', label: 'British (Brixton)', prompt: 'London Brixton urban British accent.' },
  { id: 'Transatlantic', label: 'Transatlantic', prompt: 'Transatlantic classic mid-Atlantic theatrical cadence.' },
  { id: 'Australian', label: 'Australian', prompt: 'Australian conversational accent.' },
  { id: 'Indonesian (Native)', label: 'Indonesian (Native)', prompt: 'Indonesian native accent with natural Indonesian phonetics.' }
];

export const STYLE_PRESETS = [
  { label: 'Promo/Hype', style: 'Promo/Hype' },
  { label: 'Vocal smile', style: 'Vocal smile' },
  { label: 'Newscaster', style: 'Newscaster' },
  { label: 'Whisper', style: 'Whisper' },
  { label: 'Empathic', style: 'Empathic' },
  { label: 'Deadpan', style: 'Deadpan' },
  { label: 'Standar / Natural', style: 'Natural, clear conversational delivery' },
  { label: 'Ramah & Hangat', style: 'Warm, approachable, friendly customer service tone' },
  { label: 'Berwibawa & Resmi', style: 'Clear, authoritative, professional corporate tone' }
];
