import axios from "axios";
import { ArrowLeft, Clock3, CalendarDays, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Footer from "@/components/footer";
import PublicNavbar from "@/components/navbar/PublicNavbar";

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles/${slug}`);
        if (data.success) setArticle(data.article);
        else setArticle(null);
      } catch (error) {
        console.error("Failed to fetch article detail:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const readTime = useMemo(() => {
    const words = stripHtml(article?.contentHtml || "")
      .split(" ")
      .filter(Boolean).length;
    return `${Math.max(1, Math.ceil(words / 200))} min read`;
  }, [article]);

  if (loading) {
    return <div className="min-h-screen bg-[#f7f4ec] px-5 py-10 text-[#24352f] md:px-8">Memuat artikel...</div>;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f7f4ec] px-5 py-10 text-[#24352f] md:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#dde4db] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Artikel tidak ditemukan</h1>
          <p className="mt-2 text-[#5d6f69]">Artikel yang Anda cari tidak tersedia atau telah dihapus.</p>
          <button onClick={() => navigate(-1)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2f7c6d] px-5 py-2.5 text-white">
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#24352f]">
      <PublicNavbar />

      <main className="mx-auto w-full max-w-4xl px-5 py-8 md:px-8 md:py-12">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center text-sm text-[#72827a]">
          <Link to="/" className="font-medium text-[#35544d] transition hover:text-[#275f55]">
            Beranda
          </Link>
          <ChevronRight size={16} className="mx-1.5" />
          <Link to="/articles" className="font-medium text-[#35544d] transition hover:text-[#275f55]">
            Artikel
          </Link>
          <ChevronRight size={16} className="mx-1.5" />
          <span className="line-clamp-1 font-semibold text-[#24352f]">{article.title}</span>
        </nav>

        <article className="rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#72827a]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} />
              {new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(article.createdAt))}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#223530] md:text-5xl">{article.title}</h1>
          {article.excerpt ? <p className="mt-4 max-w-3xl text-base leading-7 text-[#5d6f69] md:text-lg">{article.excerpt}</p> : null}

          {article.coverImage ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-[#e3eae4]">
              <img src={article.coverImage} alt={article.title} className="h-[280px] w-full object-cover md:h-[420px]" />
            </div>
          ) : null}

          <div className="prose prose-zinc mt-8 max-w-none prose-headings:text-[#223530] prose-p:text-[#42514b] prose-a:text-[#2f7c6d] prose-strong:text-[#223530]" dangerouslySetInnerHTML={{ __html: article.contentHtml || "" }} />
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
