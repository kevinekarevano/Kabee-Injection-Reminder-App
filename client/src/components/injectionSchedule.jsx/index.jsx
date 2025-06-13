import Calendar from "react-calendar";
import { formatDate } from "@/helpers/formatDate";
import formatRemainingDays from "@/helpers/formatRemainingDays";
import useAppStore from "@/stores/useAppStore";
import parseISOToDate from "@/helpers/parseISOToDate";

import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const InjectionSchedule = () => {
  const userData = useAppStore((state) => state.userData);

  const nextInjectionDate = parseISOToDate(userData?.nextInjectionDate);
  const lastInjectionDate = parseISOToDate(userData?.lastInjectionDate);

  return (
    <>
     
      <div className="bg-[#4f7c82] h-full rounded-md">
        <Calendar
          className={"rounded-md p-3   font-poppins border-2 text-white "}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              // Tandai tanggal next injection
              if (nextInjectionDate && date.toDateString() === nextInjectionDate.toDateString()) {
                return "next-injection";
              }
              // Tandai tanggal last injection
              if (lastInjectionDate && date.toDateString() === lastInjectionDate.toDateString()) {
                return "last-injection";
              }
            }
            return null; // Tidak ada class tambahan untuk tanggal lainnya
          }}
        />
        <div className="font-poppins italic ml-5 mt-3 pb-5 text-zinc-100 flex items-center gap-2 ">
          <div className="flex items-center gap-1">
            <div className="bg-[#273737] shadow-md  h-4 w-4 rounded-full"></div>
            <p className="font-medium text-sm "> Today.</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-[#3d5859] shadow-md  h-4 w-4 rounded-full"></div>
            <p className="font-medium text-sm "> Last Injection.</p>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-[#937e90] shadow-md   h-4 w-4 rounded-full"></div>
            <p className="font-medium text-sm "> Next Injection.</p>
          </div>
        </div>
      </div>

      <div className="  font-poppins md:w-2/4 mt-5    md:mt-0  ">
        <div className="bg-[#93B1B5] px-4 py-2 rounded-md">
          <h1 className="font-semibold text-[#061416] mt-3 text-3xl">Next Injection</h1>
          <p className="text-[#0B2E33] font-medium text-4xl mt-3">{formatDate(userData?.nextInjectionDate) || "-"}</p>
          <p className="text-[#343B3C] font-light mt-2">{formatRemainingDays(userData?.nextInjectionDate)} days remaining</p>
        </div>

        {userData?.telegramChatID ? (
          <div onClick={() => window.open("https://t.me/Kabee_official_bot", "_blank")} className="bg-[#93B1B5]  mt-5    px-4 py-2 rounded-md">
            <div className="flex items-center gap-2 mt-5">
              <h1 className="font-semibold text-[#132D31] cursor-pointer  text-3xl">Help Via Telegram</h1>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12" viewBox="0 0 496 512">
                <path
                  fill="#0b2e33"
                  d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                />
              </svg>
            </div>
            <p className="text-[#343B3C] font-light mt-2 underline-offset-1 cursor-pointer underline ">Contact via telegram</p>
          </div>
        ) : (
          <div onClick={() => window.open("https://t.me/Kabee_official_bot", "_blank")} className=" bg-[#AA7575] mt-5   px-4 py-2 rounded-md">
            <div className="flex items-center gap-2 mt-5">
              <h1 className="font-semibold text-[#7D1315] underline cursor-pointer underline-offset-2  text-2xl md:text-3xl">Sycn to Kabee Bot</h1>
              <svg xmlns="http://www.w3.org/2000/svg" className="md:w-12 w-10" viewBox="0 0 496 512">
                <path
                  fill="#7D1315"
                  d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-red-900 italic mt-2 md:mt-0  font-light">
                Your registration code : <span className="bg-red-900 rounded font-semibold px-2 text-white">{userData?.registrationCode?.toUpperCase()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InjectionSchedule;
