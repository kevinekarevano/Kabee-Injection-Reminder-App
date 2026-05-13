import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CalendarDays, ImageOff, PenLine, Plus, Sparkles, Trash2, AlertCircle } from "lucide-react";

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "-";
  }
};

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles`);
      if (data.success) setArticles(data.data || []);
      else toast.error("Gagal mengambil daftar artikel");
    } catch (e) {
      console.error(e);
      toast.error("Gagal mengambil daftar artikel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, { withCredentials: true });
      if (data.success) {
        toast.success("Artikel dihapus");
        fetchArticles();
        setDeleteConfirm(null);
      } else {
        toast.error(data.message || "Gagal menghapus artikel");
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus artikel");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full text-[#24302b]">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)] md:flex-row md:items-end md:justify-between md:p-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight text-[#24352f] md:text-3xl">Manage Articles</h1>
        </div>

        <Link to="/dashboard/articles/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f7c6d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#275f55]">
          <Plus size={16} />
          Create Article
        </Link>
      </div>

      <div className="mt-4 rounded-[2rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)] md:p-5">
        {loading ? (
          <p className="text-[#5d6f69]">Loading articles...</p>
        ) : articles.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#cfd9d2] bg-[#fbf8f1] p-8 text-center text-[#5d6f69]">
            <p className="text-base font-medium text-[#24352f]">No articles yet.</p>
            <p className="mt-1 text-sm text-[#5d6f69]">Mulai buat artikel pertama untuk tampil di landing page dan halaman user.</p>
            <Link to="/dashboard/articles/create" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#2f7c6d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#275f55]">
              <Plus size={16} />
              Create First Article
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((a) => {
              return (
                <article key={a._id} className="overflow-hidden rounded-[1.75rem] border border-[#dde4db] bg-white shadow-[0_12px_25px_rgba(34,53,48,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(34,53,48,0.08)]">
                  <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                    <div className="relative min-h-56 bg-[#edf4ef] md:min-h-64">
                      {a.coverImage ? (
                        <img src={a.coverImage} alt={a.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full min-h-56 items-center justify-center px-4 text-center text-[#72827a] md:min-h-64">
                          <div>
                            <div className="mx-auto mb-2 inline-flex rounded-full bg-white p-3 text-[#2f7c6d] shadow-sm">
                              <ImageOff size={18} />
                            </div>
                            <p className="text-sm font-medium">No cover image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col p-4 md:p-5">
                      <div className="flex items-center gap-2 text-xs text-[#72827a]">
                        <CalendarDays size={13} />
                        {formatDate(a.createdAt)}
                      </div>

                      <h2 className="mt-2 text-xl font-semibold leading-snug text-[#24352f]">{a.title}</h2>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(a.tags || []).slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-[#dde4db] bg-[#edf4ef] px-3 py-1 text-xs font-medium text-[#2f7c6d]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button onClick={() => navigate(`/dashboard/articles/edit/${a._id}`)} className="inline-flex items-center gap-2 rounded-full bg-[#d8a64d] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#c89537]">
                          <PenLine size={15} />
                          Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(a)} className="inline-flex items-center gap-2 rounded-full bg-[#c34a39] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#ab3e30]">
                          <Trash2 size={15} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24302b]/45 px-4 backdrop-blur-sm">
          <div className="max-w-3xl rounded-[2rem] border border-[#dde4db] bg-white p-4 text-[#24302b] shadow-[0_24px_70px_rgba(34,53,48,0.18)] md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#72827a]">Article Detail</p>
                <h2 className="mt-1 text-xl font-semibold text-[#24352f]">{selected.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full border border-[#dde4db] bg-[#fbf8f1] px-3 py-1.5 text-sm font-medium text-[#5d6f69] transition hover:bg-white">
                Close
              </button>
            </div>

            {selected.coverImage && <img src={selected.coverImage} alt="cover" className="my-4 w-full max-h-72 rounded-2xl object-cover" />}
            <div className="prose max-w-full prose-headings:text-[#24352f] prose-p:text-[#5d6f69]" dangerouslySetInnerHTML={{ __html: selected.contentHtml || "" }} />
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24302b]/45 px-4 backdrop-blur-sm">
          <div className="max-w-sm rounded-[2rem] border border-[#dde4db] bg-white p-6 text-[#24302b] shadow-[0_24px_70px_rgba(34,53,48,0.18)]">
            <div className="mb-4 inline-flex rounded-full bg-[#fef3f2] p-3 text-[#c34a39]">
              <AlertCircle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-[#24352f]">Hapus artikel?</h3>
            <p className="mt-2 text-sm text-[#5d6f69]">
              Artikel "<span className="font-medium">{deleteConfirm.title}</span>" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-full border border-[#dde4db] bg-white px-4 py-2.5 text-sm font-semibold text-[#24302b] transition hover:bg-[#fbf8f1]">
                Batalkan
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={isDeleting} className="flex-1 rounded-full bg-[#c34a39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ab3e30] disabled:opacity-60">
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
