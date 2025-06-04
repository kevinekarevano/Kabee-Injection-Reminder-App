import getInitials from "@/helpers/getInitials";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import formatInjectionType from "@/helpers/formatInjectionType";
import useAppStore from "@/stores/useAppStore";

const Profile = () => {
  const userData = useAppStore((state) => state.userData);

  return (
    <>
      <Avatar className="w-14 md:w-18 h-14 md:h-18 hover:scale-105 transition-all duration-500 cursor-pointer ease-in-out">
        <AvatarImage className={" object-cover"} src={userData?.avatar} />
        <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-[#0B2E33]"}>{getInitials(userData?.username)}</AvatarFallback>
      </Avatar>
      <div className="font-poppins  text-[#0B2E33] ">
        <h1 className="font-medium text-md  sm:text-3xl transition-all duration-500 ">Welcome, {userData?.username} 👋</h1>
        <div className="flex items-center gap-2">
          <p className="font-light text-sm">{formatInjectionType(userData?.injectionType)} </p>
          {userData?.telegramChatID ? <p className="bg-teal-900 rounded font-medium text-xs sm:text-sm italic px-2 text-white">Synced</p> : <p className="bg-red-900 rounded font-medium text-sm italic px-2 text-white">Not Synced</p>}
        </div>
      </div>
    </>
  );
};

export default Profile;
