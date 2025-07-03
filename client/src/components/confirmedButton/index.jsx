import useAppStore from "@/stores/useAppStore";
import dayjs from "dayjs";

const Announcement = () => {
  const userData = useAppStore((state) => state.userData);
  const injectionConfirmation = useAppStore((state) => state.injectionConfirmation);

  const today = dayjs().startOf("day");
  const injectionDay = dayjs(userData?.nextInjectionDate).startOf("day");

  if (userData?.isConfirmed || injectionDay.isAfter(today) || !userData?.nextInjectionDate) {
    return null;
  } else {
    return (
      <div className="py-3 bg-emerald-800">
        <p className="text-center text-white font-poppins">
          {" "}
          <span className="font-semibold">Sudah waktunya KB!</span> Silahkan segera datang ke tempat KB hari ini 💊
        </p>
      </div>
    );
  }
};

export default Announcement;
