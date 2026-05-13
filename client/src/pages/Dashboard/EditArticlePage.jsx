import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router";
import Loader from "@/components/ui/loader";

const EditArticlePage = () => {
  const makeSlug = (value = "") =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const slugPreview = makeSlug(title);

  useEffect(() => {
    const editorElement = editorRef.current;
    if (!editorElement || quillRef.current) return;
    editorElement.innerHTML = "";
    quillRef.current = new Quill(editorElement, { theme: "snow", modules: { toolbar: [[{ header: [1, 2, false] }], ["bold", "italic"], ["link"], ["clean"]] } });
    return () => {
      quillRef.current = null;
      editorElement.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/articles/id/${id}`);
        if (data.success) {
          const a = data.article;
          setTitle(a.title || "");
          setExcerpt(a.excerpt || "");
          setPreviewUrl(a.coverImage || "");
          setImageName("");
          if (quillRef.current) quillRef.current.root.innerHTML = a.contentHtml || "";
        } else {
          toast.error("Article not found");
        }
      } catch (e) {
        console.error(e);
        toast.error("Gagal mengambil artikel");
      }
    };

    fetchArticle();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setImageName(file.name);
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contentHtml = quillRef.current?.root?.innerHTML || "";
    if (!title.trim()) return toast.warning("Judul harus diisi");
    if (!contentHtml.replace(/<[^>]+>/g, "").trim()) return toast.warning("Isi harus diisi");

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", makeSlug(title));
      formData.append("excerpt", excerpt);
      formData.append("contentHtml", contentHtml);
      if (selectedFile) formData.append("cover", selectedFile);

      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/articles/${id}`, formData, { withCredentials: true });
      if (data.success) {
        toast.success("Artikel diperbarui");
        navigate("/dashboard/articles");
      } else {
        toast.error(data.message || "Gagal memperbarui artikel");
      }
    } catch (e) {
      console.error(e);
      toast.error("Gagal memperbarui artikel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Article Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Edit Article</h1>
      </div>
      <div className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-[#24302b]">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[#dde4db] bg-white px-3 py-2 text-[#24302b] outline-none focus:border-[#2f7c6d] focus:ring-2 focus:ring-[#2f7c6d]/15" />
            <div className="mt-2 rounded-xl border border-[#dde4db] bg-[#fbf8f1] px-3 py-2 text-xs text-[#5d6f69]">
              <span className="font-semibold text-[#24302b]">Slug preview:</span> {slugPreview || "slug-akan-muncul-di-sini"}
            </div>
          </div>

          <div>
            <label className="text-sm text-[#24302b]">Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-[#dde4db] bg-white px-3 py-2 text-[#5d6f69]" />
            {previewUrl && <img src={previewUrl} alt="preview" className="mt-2 w-full max-h-48 rounded-2xl object-cover" />}
          </div>

          <div>
            <label className="text-sm text-[#24302b]">Content</label>
            <div className="overflow-hidden rounded-[1.25rem] border border-[#dde4db] bg-white text-[#24302b] shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
              <div ref={editorRef} className="min-h-[300px]" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={isLoading} className="rounded-full bg-[#2f7c6d] px-4 py-2 text-white transition hover:bg-[#275f55] disabled:opacity-60">
              {isLoading ? <Loader className="w-4" /> : "Save"}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="rounded-full bg-[#c34a39] px-4 py-2 text-white transition hover:bg-[#ab3e30]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditArticlePage;
