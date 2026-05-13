import { ArrowRight, ArrowUp, BadgeCheck, CalendarClock, Clock3, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import ArticlePreviewSection from "@/components/article/ArticlePreviewSection";
import Footer from "@/components/footer";
import PublicNavbar from "@/components/navbar/PublicNavbar";

const features = [
  {
    icon: <CalendarClock size={22} />,
    title: "Jadwal KB yang Selalu Terlihat",
    description: "Pengguna bisa melihat jadwal suntik atau pil harian secara jelas, sehingga lebih siap sebelum waktu kontrol tiba.",
  },
  {
    icon: <BadgeCheck size={22} />,
    title: "Catatan dan Riwayat Lebih Rapi",
    description: "Riwayat KB, status pemantauan, dan data penting tersusun ringkas agar mudah dibaca saat dibutuhkan.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Mudah untuk Pengguna dan Admin",
    description: "Alur dibuat sederhana agar pengguna nyaman memantau jadwal, sementara admin lebih cepat melakukan pendampingan.",
  },
];

const highlights = [
  {
    label: "Tata letak",
    value: "Clean & fokus",
  },
  {
    label: "Pengingat",
    value: "Lebih terarah",
  },
  {
    label: "Pengelolaan",
    value: "Rapi untuk admin",
  },
];

const profileCards = [
  {
    title: "Alur Pengguna yang Mudah",
    description: "Setiap menu dibuat singkat dan jelas. Pengguna bisa menemukan jadwal KB, catatan, dan informasi penting tanpa harus membuka banyak halaman.",
    icon: <Sparkles size={18} />,
  },
  {
    title: "Jadwal KB Lebih Terpantau",
    description: "Kabee membantu menampilkan jadwal penting secara rapi, mulai dari jadwal suntik dan pil sesuai kebutuhan pengguna.",
    icon: <Clock3 size={18} />,
  },
  {
    title: "Informasi Penting Lebih Jelas",
    description: "Konten disusun dengan fokus pada kebutuhan utama pengguna. Jadwal, status, dan catatan KB ditampilkan ringkas agar lebih mudah dibaca dan dipahami.",
    icon: <MapPin size={18} />,
  },
];

const LandingPage = () => {
  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSmoothScroll = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen  bg-[#f7f4ec] font-poppins text-[#24302b]">
      <PublicNavbar onScrollToSection={handleSmoothScroll} />

      <section
        className="relative isolate overflow-hidden border-b border-[#dde5dd]"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(247,244,236,0.96) 0%, rgba(247,244,236,0.86) 52%, rgba(247,244,236,0.7) 100%), url('/GAMBARKB.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <section className="max-w-3xl">
            <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-[#223530] md:text-6xl">Ingat Jadwal KB Lebih Tepat, Jalani Hari dengan Lebih Tenang.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5d6f69] md:text-lg">
              Kabee membantu anda mencatat metode KB, memantau jadwal kontrol, dan menyimpan informasi penting dalam satu tempat yang rapi, mudah dibaca, dan aman digunakan.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleSmoothScroll("fitur")}
                className="inline-flex items-center justify-center rounded-full bg-[#2f7c6d] px-6 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(47,124,109,0.18)] transition hover:bg-[#275f55] md:text-base"
              >
                Lihat Fitur
              </button>
              <button
                type="button"
                onClick={() => handleSmoothScroll("profil")}
                className="inline-flex items-center justify-center rounded-full border border-[#cfd9d2] bg-white/75 px-6 py-3 text-sm font-medium text-[#35544d] transition hover:bg-white md:text-base"
              >
                Profil Kabee
              </button>
            </div>

            {/* <div className="mt-8 flex flex-wrap gap-3">
              {highlights.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#7a8c85]">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#24352f]">{item.value}</p>
                </div>
              ))}
            </div> */}
          </section>
        </div>
      </section>

      <section id="profil" className="mx-auto w-full max-w-6xl px-5 pb-8 pt-14 md:px-8">
        <div className="flex flex-col gap-4 md:max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Profil Kabee</p>
          <h3 className="text-3xl font-semibold tracking-tight text-[#24352f] md:text-4xl">Satu tempat untuk mengingat jadwal KB, mencatat data, dan merasa lebih tenang.</h3>
          <p className="text-base leading-7 text-[#5d6f69] md:text-lg">
            Kabee membantu pengguna memantau jadwal KB, menyimpan catatan penting, dan mengakses informasi utama dengan tampilan yang sederhana. Semua dirancang agar pengguna tidak mudah lupa, sementara admin tetap dapat mengelola data
            dengan rapi.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-6 md:px-8">
        <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
          <article className="rounded-[2rem] border border-[#dde4db] bg-white p-6 shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:p-7">
            <div className="flex items-center gap-3">
              <img className="w-16 rounded-2xl border border-[#e4ece5] bg-[#f7faf6] p-2" src="/logo.svg" alt="Kabee Logo" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#72827a]">Brand</p>
                <h4 className="text-xl font-semibold text-[#24352f]">Kabee</h4>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#5d6f69] md:text-base">
              Kabee hadir sebagai pendamping digital untuk wanita yang sedang menjalani KB. Pengguna dapat mencatat jadwal, melihat pengingat, dan memantau informasi penting tanpa alur yang rumit.
            </p>
          </article>

          <div className="grid gap-4 md:grid-cols-2">
            {profileCards.slice(0, 2).map((item) => (
              <article key={item.title} className="rounded-[1.5rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
                <div className="inline-flex rounded-xl bg-[#edf4ef] p-2 text-[#2f7c6d]">{item.icon}</div>
                <h4 className="mt-4 text-lg font-semibold text-[#24352f]">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-[#5d6f69]">{item.description}</p>
              </article>
            ))}

            <article className="rounded-[1.5rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)] md:col-span-2">
              <div className="inline-flex rounded-xl bg-[#edf4ef] p-2 text-[#2f7c6d]">
                <MapPin size={18} />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-[#24352f]">Arah Informasi Lebih Jelas</h4>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6f69]">Struktur konten dibuat untuk mengurangi distraksi, menjaga fokus pada informasi utama, dan membuat setiap blok terasa lebih ringan dibaca.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f] md:text-4xl">Fitur utama Kabee untuk bantu pengguna lebih disiplin menjalani program KB.</h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d6f69] md:text-base">Dari pengingat jadwal sampai pencatatan riwayat, setiap fitur dirancang agar informasi lebih cepat dipahami dan tindak lanjut lebih mudah dilakukan.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.title} className="rounded-[1.5rem] border border-[#dde4db] bg-white p-6 shadow-[0_16px_30px_rgba(34,53,48,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(34,53,48,0.08)]">
              <div className="inline-flex rounded-xl bg-[#edf4ef] p-2 text-[#2f7c6d]">{item.icon}</div>
              <h4 className="mt-4 text-xl font-semibold text-[#24352f]">{item.title}</h4>
              <p className="mt-2 text-sm leading-7 text-[#5d6f69] md:text-base">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/auth/login" className="inline-flex items-center gap-2 rounded-full bg-[#2f7c6d] px-6 py-3 text-sm font-medium text-white shadow-[0_12px_28px_rgba(47,124,109,0.18)] transition hover:bg-[#275f55] md:text-base">
            Masuk ke Kabee
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 md:px-8">
        <ArticlePreviewSection
          theme="light"
          eyebrow="Artikel Edukasi"
          title="Baca artikel terbaru seputar KB dan kesehatan reproduksi"
          description="Admin dapat menulis artikel informatif yang akan tampil di halaman landing dan preview user untuk memudahkan pembaca membuka detail lengkapnya."
          moreLink="/articles"
          moreLabel="Lihat Semua Artikel"
        />
      </section>

      <Footer />

      {showGoTop ? (
        <button
          type="button"
          onClick={handleGoTop}
          aria-label="Go to top"
          className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2f7c6d] text-white shadow-[0_12px_28px_rgba(47,124,109,0.28)] transition hover:-translate-y-0.5 hover:bg-[#275f55]"
        >
          <ArrowUp size={20} />
        </button>
      ) : null}
    </div>
  );
};

export default LandingPage;
