import { ArrowRight, BookOpenText, Clock3, Sparkles } from "lucide-react";

const MOCKUP_ARTICLES = [
  {
    id: "a1",
    title: "Kenali Perbedaan KB Suntik 1 Bulan dan 3 Bulan",
    excerpt: "Panduan ringkas memilih jenis KB suntik sesuai gaya hidup, jadwal, dan kondisi tubuh Anda.",
    tag: "KB Suntik",
    readTime: "4 min read",
    date: "05 Mei 2026",
  },
  {
    id: "a2",
    title: "Tips Minum Pil KB Tepat Waktu Setiap Hari",
    excerpt: "Strategi sederhana agar tidak lupa minum pil, termasuk alarm, habit stacking, dan checklist mingguan.",
    tag: "KB Pil",
    readTime: "3 min read",
    date: "03 Mei 2026",
  },
  {
    id: "a3",
    title: "Mitos vs Fakta: Efek Samping Kontrasepsi",
    excerpt: "Pisahkan informasi valid dan hoaks populer agar Anda lebih percaya diri mengambil keputusan kesehatan.",
    tag: "Edukasi",
    readTime: "6 min read",
    date: "01 Mei 2026",
  },
];

export default function BlogMockupSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-[#18464d] via-[#23606a] to-[#2e7c89] p-5 text-white md:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
            <Sparkles size={14} />
            Artikel Edukasi (Mockup)
          </div>
          <h2 className="text-2xl font-bold leading-tight md:text-3xl">Belajar KB dari Artikel Ringkas dan Terpercaya</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">Nantinya bagian ini menampilkan artikel terbaru dari admin untuk membantu user memahami KB suntik, KB pil, dan kesehatan reproduksi.</p>
        </div>
        <button type="button" className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1f5a63] transition hover:translate-x-0.5 hover:bg-[#f4fbfc] md:inline-flex">
          Lihat Semua Artikel
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MOCKUP_ARTICLES.map((article) => (
          <article key={article.id} className="group rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="rounded-full bg-[#9fe3eb] px-2.5 py-1 font-semibold text-[#0e4f58]">{article.tag}</span>
              <span className="text-white/85">{article.date}</span>
            </div>

            <h3 className="mb-2 text-lg font-bold leading-snug">{article.title}</h3>
            <p className="mb-4 text-sm text-white/85">{article.excerpt}</p>

            <div className="flex items-center justify-between border-t border-white/20 pt-3 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} />
                {article.readTime}
              </span>
              <button type="button" className="inline-flex items-center gap-1 font-semibold text-[#d6fbff] group-hover:text-white">
                Baca Artikel
                <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1f5a63] transition hover:bg-[#f4fbfc] md:hidden">
        <BookOpenText size={16} />
        Lihat Semua Artikel
      </button>
    </section>
  );
}
