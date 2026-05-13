import getInitials from "@/helpers/getInitials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import formatInjectionType from "@/helpers/formatInjectionType";
import useAppStore from "@/stores/useAppStore";

const Profile = () => {
  const userData = useAppStore((state) => state.userData);

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Avatar className="h-14 w-14 cursor-pointer transition-all duration-500 ease-in-out hover:scale-105 md:h-18 md:w-18">
        <AvatarImage className="object-cover" src={userData?.avatar} />
        <AvatarFallback className="bg-[#2f7c6d] font-poppins text-xl font-bold text-white">{getInitials(userData?.username)}</AvatarFallback>
      </Avatar>
      <div className="font-poppins text-[#24302b]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#72827a]">User Dashboard</p>
        <h1 className="text-xl font-semibold transition-all duration-500 sm:text-3xl">Welcome, {userData?.username} 👋</h1>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <p className="text-sm font-light text-[#5d6f69]">{formatInjectionType(userData?.injectionType)}</p>
          {userData?.contraceptiveMethod === "pill" ? (
            <Badge className="rounded-full bg-[#edf4ef] px-2.5 py-1 text-xs font-bold text-[#2f7c6d]">Pill</Badge>
          ) : (
            <Badge className="rounded-full bg-[#edf4ef] px-2.5 py-1 text-xs font-bold text-[#2f7c6d]">Injection</Badge>
          )}
          {userData?.telegramChatID ? <p className="rounded-full bg-[#2f7c6d] px-2 py-1 text-xs font-medium text-white">Synced</p> : <p className="rounded-full bg-[#be1c1c] px-2 py-1 text-xs font-medium text-white">Not Synced</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
