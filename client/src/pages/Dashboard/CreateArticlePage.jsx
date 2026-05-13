import { ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "@/components/ui/loader";

const CreateArticlePage = () => {
  const makeSlug = (value = "") =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

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

    // React StrictMode can mount twice in dev; clear existing Quill markup before re-init.
    editorElement.innerHTML = "";

    quillRef.current = new Quill(editorElement, {
      theme: "snow",
      placeholder: "Tulis isi artikel di sini...",
      modules: {
        toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ list: "ordered" }, { list: "bullet" }], ["blockquote", "code-block"], ["link"], ["clean"]],
      },
    });

    return () => {
      quillRef.current = null;
      editorElement.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageName("");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      setImageName("");
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setImageName(file.name);
    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreviewUrl;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const contentHtml = quillRef.current?.root?.innerHTML || "";
    const plainText = contentHtml.replace(/<[^>]+>/g, "").trim();

    if (!title.trim()) {
      toast.warning("Judul harus diisi");
      return;
    }

    if (!selectedFile) {
      toast.warning("Cover image harus dipilih");
      return;
    }

    if (!plainText) {
      toast.warning("Isi artikel tidak boleh kosong");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slugPreview);
      formData.append("excerpt", excerpt);
      formData.append("contentHtml", contentHtml);
      formData.append("cover", selectedFile);

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/articles`, formData, {
        withCredentials: true,
      });

      if (data?.success) {
        toast.success("Artikel berhasil dibuat");
        // reset form
        setTitle("");
        setExcerpt("");
        setSelectedFile(null);
        setImageName("");
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return "";
        });
        if (quillRef.current) quillRef.current.setContents([]);
      } else {
        toast.error(data?.message || "Gagal membuat artikel");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Terjadi kesalahan saat membuat artikel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Article Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Create New Article</h1>
      </div>

      <div className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-5 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <div className="border-b border-[#dde4db] pb-4">
          <p className="text-sm text-[#5d6f69]">Lengkapi form di bawah untuk menulis artikel baru.</p>
        </div>

        <form className="space-y-6 pt-5">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div className="space-y-2">
              <label htmlFor="article-title" className="text-sm font-medium text-[#24302b]">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="article-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full rounded-xl border border-[#dde4db] bg-white px-3 py-2.5 text-sm text-[#24302b] outline-none transition focus:border-[#2f7c6d] focus:ring-2 focus:ring-[#2f7c6d]/15"
              />
              <div className="rounded-xl border border-[#dde4db] bg-[#fbf8f1] px-3 py-2 text-xs text-[#5d6f69]">
                <span className="font-semibold text-[#24302b]">Slug preview:</span> {slugPreview || "slug-akan-muncul-di-sini"}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="article-image" className="text-sm font-medium text-[#24302b]">
                Image <span className="text-red-400">*</span>
              </label>
              <input
                id="article-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-[#dde4db] bg-white px-3 py-2 text-sm text-[#5d6f69] file:mr-3 file:rounded-full file:border-0 file:bg-[#2f7c6d] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#275f55]"
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-dashed border-[#cfd9d2] bg-[#fbf8f1] p-4">
            {previewUrl ? (
              <div className="overflow-hidden rounded-[1.25rem] border border-[#dde4db] bg-white shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
                <img src={previewUrl} alt="Article preview" className="h-[240px] w-full object-cover" />
                <div className="border-t border-[#dde4db] px-3 py-2 text-xs text-[#5d6f69]">{imageName}</div>
              </div>
            ) : (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[1.25rem] border border-[#dde4db] bg-white text-center text-[#5d6f69] shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
                <ImagePlus size={30} className="mb-2 text-[#2f7c6d] opacity-80" />
                <p className="text-base font-medium text-[#24352f]">Article Image</p>
                <p className="mt-1 text-xs text-[#72827a]">Preview gambar akan tampil di area ini.</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#24302b]">
              Content <span className="text-red-400">*</span>
            </label>
            <div className="overflow-hidden rounded-[1.25rem] border border-[#dde4db] bg-white text-[#24302b] shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
              <div ref={editorRef} className="min-h-[300px]" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              type="button"
              className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-[#2f7c6d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#275f55] disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-4" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create"
              )}
            </button>
            <button type="button" className="inline-flex min-w-[100px] items-center justify-center rounded-full bg-[#c34a39] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#ab3e30]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticlePage;
