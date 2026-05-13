import { useState } from "react";
import { Link } from "react-router";
import { ChevronRight, Search } from "lucide-react";
import ArticlePreviewSection from "@/components/article/ArticlePreviewSection";
import Footer from "@/components/footer";
import PublicNavbar from "@/components/navbar/PublicNavbar";

const PublicArticlesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-[#f7f4ec]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center text-sm text-[#72827a]">
          <Link to="/" className="font-medium text-[#35544d] transition hover:text-[#275f55]">
            Beranda
          </Link>
          <ChevronRight size={16} className="mx-1.5" />
          <span className="font-semibold text-[#24352f]">Semua Artikel</span>
        </nav>

        <div className="mb-5 flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)] md:max-w-xl">
          <Search className="text-[#72827a]" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari artikel berdasarkan judul..."
            className="w-full border-none bg-transparent px-3 text-sm text-[#24302b] outline-none placeholder:text-[#8b9a93]"
          />
        </div>

        <ArticlePreviewSection
          theme="light"
          eyebrow="Artikel Kabee"
          title="Semua Artikel"
          description="Kumpulan artikel edukasi seputar KB, kesehatan reproduksi, dan panduan praktis yang ditulis admin Kabee."
          limit={24}
          searchQuery={searchTerm}
          moreLink={null}
          className="bg-white"
        />
      </main>

      <Footer />
    </div>
  );
};

export default PublicArticlesPage;
