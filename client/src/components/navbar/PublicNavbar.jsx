import { Link } from "react-router";
import useAppStore from "@/stores/useAppStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import getInitials from "@/helpers/getInitials";

const PublicNavbar = ({ onScrollToSection = null }) => {
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);
  const userData = useAppStore((s) => s.userData);

  const handleSmoothScroll = (id) => {
    if (!onScrollToSection) return;
    onScrollToSection(id);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[#fbf8f1]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="inline-flex items-center">
          <img className="w-10 md:w-25" src="/logo.svg" alt="Kabee Logo" />
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          {onScrollToSection ? (
            <button type="button" onClick={() => handleSmoothScroll("profil")} className="rounded-full border border-[#bfd0c6] px-3 py-1.5 text-sm font-medium text-[#35544d] transition hover:bg-white md:px-4">
              Profil Kabee
            </button>
          ) : (
            <Link to="/#profil" className="rounded-full border border-[#bfd0c6] px-3 py-1.5 text-sm font-medium text-[#35544d] transition hover:bg-white md:px-4">
              Profil Kabee
            </Link>
          )}

          {isLoggedIn && userData ? (
            <Link to={userData.role === "admin" ? "/dashboard" : "/user"} className="inline-flex items-center gap-2 rounded-full px-2 py-1.5 bg-white border border-[#e6eee7]">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userData?.avatar} />
                <AvatarFallback className="bg-[#2f7c6d] text-white">{getInitials(userData?.username)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-[#24302b] md:inline">{userData?.username}</span>
            </Link>
          ) : (
            <Link to="/auth/login" className="rounded-full bg-[#2f7c6d] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#275f55] md:px-4">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
