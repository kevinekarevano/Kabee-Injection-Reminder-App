import useAppStore from "@/stores/useAppStore";
import dayjs from "dayjs";

const Announcement = () => {
  const userData = useAppStore((state) => state.userData);

  if (!userData) return null;

  const today = dayjs().startOf("day");

  // Injection users: show when nextInjectionDate is today or in the past and not confirmed
  if (userData.contraceptiveMethod === "injection") {
    const injectionDay = userData?.nextInjectionDate ? dayjs(userData.nextInjectionDate).startOf("day") : null;
    if (!injectionDay || userData.isConfirmed || injectionDay.isAfter(today)) return null;

    return (
      <div className="py-3 bg-emerald-800">
        <p className="text-center text-white font-poppins">
          <span className="font-semibold">Sudah waktunya suntik KB!</span> Silahkan segera datang ke tempat KB hari ini 💉
        </p>
      </div>
    );
  }

  // Pill users: show when they haven't confirmed pill intake today
  if (userData.contraceptiveMethod === "pill") {
    const lastPillDay = userData?.lastPillDate ? dayjs(userData.lastPillDate).startOf("day") : null;
    // if last pill taken today, don't show
    if (lastPillDay && lastPillDay.isSame(today)) return null;

    return (
      <div className="py-3 bg-emerald-800">
        <p className="text-center text-white font-poppins">
          <span className="font-semibold">Sudah waktunya minum pil KB!</span> Jangan lupa minum pil hari ini 💊
        </p>
      </div>
    );
  }

  return null;
};

export default Announcement;
