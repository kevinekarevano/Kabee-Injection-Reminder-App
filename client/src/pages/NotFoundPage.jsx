import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import PublicNavbar from "@/components/navbar/PublicNavbar";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#f7f4ec] font-poppins text-[#24302b]">
      <PublicNavbar />

      <div className="relative isolate overflow-hidden border-b border-[#dde4db]">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex rounded-full bg-[#fef3f2] p-4 text-[#c34a39]">
              <span className="text-5xl font-bold">404</span>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#223530] md:text-5xl">Halaman Tidak Ditemukan</h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-7 text-[#5d6f69] md:text-lg">Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan. Silakan kembali ke halaman utama.</p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2f7c6d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#275f55]">
                <ArrowLeft size={18} />
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
