import axios from "axios";
import { ArrowRight, BookOpenText, Clock3, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncateText = (value = "", max = 130) => {
  const s = (value || "").trim();
  if (!s) return "";
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 0) return cut.slice(0, lastSpace) + "...";
  return cut + "...";
};

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
  } catch {
    return "";
  }
};

const ArticlePreviewSection = ({ theme = "light", title, className = "", limit = 3, moreLink = "/articles", moreLabel = "Lihat Semua Artikel", searchQuery = "" }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles?limit=${limit}`);
        if (data.success) {
          setArticles(data.data || []);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  const isDark = theme === "dark";
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredArticles = useMemo(() => {
    if (!normalizedQuery) return articles;
    return articles.filter((article) => article.title?.toLowerCase().includes(normalizedQuery));
  }, [articles, normalizedQuery]);

  const sectionClassName = useMemo(() => {
    return isDark
      ? `rounded-2xl bg-gradient-to-br from-[#18464d] via-[#23606a] to-[#2e7c89] p-5 text-white md:p-8 ${className}`
      : `rounded-[2rem] border border-[#dde4db] bg-white/90 p-5 text-[#24352f] shadow-[0_18px_40px_rgba(34,53,48,0.05)] md:p-8 ${className}`;
  }, [className, isDark]);

  const cardClassName = isDark
    ? "group rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15"
    : "group rounded-2xl border border-[#e3eae4] bg-white p-5 shadow-[0_12px_25px_rgba(34,53,48,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(34,53,48,0.08)]";

  const titleClassName = isDark ? "text-2xl font-bold leading-tight md:text-3xl" : "text-2xl font-bold leading-tight md:text-3xl text-[#223530]";
  const descriptionClassName = isDark ? "mt-2 max-w-2xl text-sm text-white/85 md:text-base" : "mt-2 max-w-2xl text-sm text-[#5d6f69] md:text-base";

  return (
    <section className={sectionClassName}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className={titleClassName}>{title || "Belajar KB dari Artikel Ringkas dan Terpercaya"}</h2>
        </div>

        {moreLink ? (
          <Link
            to={moreLink}
            className={
              isDark
                ? "hidden items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1f5a63] transition hover:translate-x-0.5 hover:bg-[#f4fbfc] md:inline-flex"
                : "hidden items-center gap-2 rounded-xl bg-[#2f7c6d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#275f55] md:inline-flex"
            }
          >
            {moreLabel}
            <ArrowRight size={16} />
          </Link>
        ) : null}
      </div>

      {loading ? (
        <div className={isDark ? "rounded-xl border border-white/15 bg-white/5 p-5 text-sm text-white/80" : "rounded-xl border border-[#e3eae4] bg-white p-5 text-sm text-[#5d6f69]"}>Memuat artikel...</div>
      ) : filteredArticles.length === 0 ? (
        <div className={isDark ? "rounded-xl border border-white/15 bg-white/5 p-5 text-sm text-white/80" : "rounded-xl border border-[#e3eae4] bg-white p-5 text-sm text-[#5d6f69]"}>
          {normalizedQuery ? `Tidak ada artikel dengan judul "${searchQuery}".` : "Belum ada artikel yang dipublikasikan."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredArticles.map((article) => {
            const tag = article.tags?.[0] || article.status || "Artikel";
            const raw = article.excerpt ? article.excerpt : stripHtml(article.contentHtml || "");
            const excerpt = truncateText(raw, 130);
            return (
              <article key={article._id} className={cardClassName}>
                <Link to={`/articles/${article.slug}`} className="block">
                  <div className="mb-3 flex items-center justify-end text-xs">
                    <span className={isDark ? "text-white/80" : "text-[#72827a]"}>{formatDate(article.createdAt)}</span>
                  </div>

                  {article.coverImage ? (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img src={article.coverImage} alt={article.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                    </div>
                  ) : null}

                  <h3 className={isDark ? "mb-2 text-lg font-bold leading-snug" : "mb-2 text-lg font-bold leading-snug text-[#24352f]"}>{article.title}</h3>
                  <p className={isDark ? "mb-4 text-sm text-white/85" : "mb-4 text-sm text-[#5d6f69]"}>{excerpt}</p>

                  <div className={isDark ? "flex items-center justify-end border-t border-white/20 pt-3 text-xs text-white/85" : "flex items-center justify-end border-t border-[#e7ece8] pt-3 text-xs text-[#6e7e77]"}>
                    <span className={isDark ? "inline-flex items-center gap-1 font-semibold text-[#d6fbff] group-hover:text-white" : "inline-flex items-center gap-1 font-semibold text-[#2f7c6d] group-hover:text-[#275f55]"}>
                      Baca Artikel
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}

      {moreLink ? (
        <Link
          to={moreLink}
          className={
            isDark
              ? "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1f5a63] transition hover:bg-[#f4fbfc] md:hidden"
              : "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f7c6d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#275f55] md:hidden"
          }
        >
          <BookOpenText size={16} />
          {moreLabel}
        </Link>
      ) : null}
    </section>
  );
};

export default ArticlePreviewSection;
