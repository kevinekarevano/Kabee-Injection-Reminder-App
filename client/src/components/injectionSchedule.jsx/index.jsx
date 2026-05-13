import Calendar from "react-calendar";
import { formatDate } from "@/helpers/formatDate";
import formatRemainingDays from "@/helpers/formatRemainingDays";
import useAppStore from "@/stores/useAppStore";
import parseISOToDate from "@/helpers/parseISOToDate";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import "react-calendar/dist/Calendar.css";
import "@/styles/calendar.css";

const InjectionSchedule = () => {
  const userData = useAppStore((state) => state.userData);
  const pillConfirmation = useAppStore((state) => state.pillConfirmation);
  const contraceptiveMethod = userData?.contraceptiveMethod || "injection";
  const isPillUser = contraceptiveMethod === "pill";

  const nextInjectionDate = parseISOToDate(userData?.nextInjectionDate);
  const lastInjectionDate = parseISOToDate(userData?.lastInjectionDate);

  const getNextPillReminderDate = (dailyPillTime) => {
    if (!dailyPillTime) return null;

    const [hours, minutes] = dailyPillTime.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    const now = new Date();
    const nextPillDate = new Date();
    nextPillDate.setHours(hours, minutes, 0, 0);

    if (nextPillDate <= now) {
      nextPillDate.setDate(nextPillDate.getDate() + 1);
    }

    return nextPillDate;
  };

  const nextPillDate = getNextPillReminderDate(userData?.dailyPillTime);

  const [remainingMs, setRemainingMs] = useState(null);

  useEffect(() => {
    if (!isPillUser) {
      setRemainingMs(null);
      return;
    }

    const scheduledDate = parseISOToDate(userData?.nextInjectionDate) || nextPillDate;
    if (!scheduledDate) {
      setRemainingMs(null);
      return;
    }

    const update = () => {
      const diff = scheduledDate.getTime() - Date.now();
      setRemainingMs(diff > 0 ? diff : 0);
    };

    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [userData?.nextInjectionDate, userData?.dailyPillTime, nextPillDate, isPillUser]);

  const formatMs = (ms) => {
    if (ms == null) return "";
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };
  const formatDateTime = (date) => {
    if (!date) return "-";

    try {
      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) return "-";
      return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch (e) {
      console.warn("formatDateTime error:", e, date);
      return "-";
    }
  };

  const formatRemainingTime = (date) => {
    if (!date) return "";

    const diffMs = date.getTime() - new Date().getTime();
    if (diffMs <= 0) return "sekarang";

    const totalMinutes = Math.ceil(diffMs / (1000 * 60));
    if (totalMinutes < 60) return `${totalMinutes} menit lagi`;

    const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
    if (totalHours < 24) return `${totalHours} jam lagi`;

    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${totalDays} hari lagi`;
  };

  const scheduleTitle = isPillUser ? "Next Minum Pil" : "Next Injection";
  const scheduleDateLabel = isPillUser ? formatDateTime(nextPillDate) : formatDate(userData?.nextInjectionDate) || "-";
  const scheduleRemainingLabel = isPillUser ? formatRemainingTime(nextPillDate) : `${formatRemainingDays(userData?.nextInjectionDate)} days remaining`;

  return (
    <>
      <div className="rounded-2xl border border-[#e3eae4] bg-[#fbf8f1] p-4 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
        <Calendar
          className={"rounded-2xl border border-[#e3eae4] bg-white p-3 font-poppins text-[#24302b]"}
          tileClassName={({ date, view }) => {
            if (view === "month") {
              // Tandai jadwal berikutnya berdasarkan metode KB
              if (!isPillUser && nextInjectionDate && date.toDateString() === nextInjectionDate.toDateString()) {
                return "next-injection";
              }
              // Tandai tanggal last injection
              if (!isPillUser && lastInjectionDate && date.toDateString() === lastInjectionDate.toDateString()) {
                return "last-injection";
              }
              if (isPillUser && nextPillDate && date.toDateString() === nextPillDate.toDateString()) {
                return "pill-schedule";
              }
            }
            return null; // Tidak ada class tambahan untuk tanggal lainnya
          }}
        />
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 pb-2 font-poppins italic text-[#5d6f69]">
          <div className="flex items-center gap-1 whitespace-nowrap">
            <div className="h-4 w-4 rounded-full bg-[#273737] shadow-md"></div>
            <p className="text-sm font-medium">Today</p>
          </div>
          {!isPillUser ? (
            <>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <div className="h-4 w-4 rounded-full bg-[#3d5859] shadow-md"></div>
                <p className="text-sm font-medium">Last Injection</p>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <div className="h-4 w-4 rounded-full bg-[#937e90] shadow-md"></div>
                <p className="text-sm font-medium">Next Injection</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1 whitespace-nowrap">
              <div className="h-4 w-4 rounded-full bg-[#c08a2d] shadow-md"></div>
              <p className="text-sm font-medium">Daily Pill Schedule</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 font-poppins md:mt-0">
        <div className="rounded-2xl border border-[#e3eae4] bg-white px-5 py-5 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#72827a]">Schedule</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#223530] md:text-3xl">{scheduleTitle}</h1>
          <p className="mt-3 text-3xl font-semibold text-[#2f7c6d] md:text-4xl">{scheduleDateLabel}</p>
          <p className="mt-2 text-sm text-[#5d6f69]">{scheduleRemainingLabel}</p>
          {isPillUser && userData?.dailyPillTime && <p className="mt-1 text-sm text-[#5d6f69]">Daily pill time: {userData.dailyPillTime}</p>}
          {isPillUser &&
            (() => {
              const scheduledDate = parseISOToDate(userData?.nextInjectionDate) || nextPillDate;
              const lastPillDate = parseISOToDate(userData?.lastPillDate || userData?.lastInjectionDate);
              const today = new Date();
              const isScheduledToday = scheduledDate && scheduledDate.toDateString() === today.toDateString();
              const alreadyConfirmedToday = lastPillDate && lastPillDate.toDateString() === today.toDateString();

              // Always show button for pill users; change appearance/text based on status
              const scheduledTimeDiff = scheduledDate ? scheduledDate.getTime() - Date.now() : null;
              const isAvailableNow = scheduledTimeDiff !== null && scheduledTimeDiff <= 0 && !alreadyConfirmedToday;

              // Already confirmed today
              if (alreadyConfirmedToday) {
                const nextDate = parseISOToDate(userData?.nextInjectionDate) || nextPillDate;
                return (
                  <div className="mt-4">
                    <Button disabled className="rounded-full bg-[#cbdad5] font-semibold text-white">
                      Sudah Minum Hari Ini
                    </Button>
                    <p className="mt-2 text-sm text-[#5d6f69]">Next: {formatDateTime(nextDate)}</p>
                  </div>
                );
              }

              // If it's time (or passed) — enabled button
              if (isAvailableNow) {
                return (
                  <Button onClick={pillConfirmation} className="mt-4 rounded-full bg-[#2f7c6d] font-semibold text-white hover:bg-[#275f55]">
                    Saya Sudah Minum Pil
                  </Button>
                );
              }

              // Not yet time — show disabled button with countdown
              return (
                <div className="mt-4">
                  <Button disabled title={`Akan tersedia dalam ${formatMs(remainingMs)}`} className="rounded-full bg-[#9fbfb5] font-semibold text-white">
                    Minum dalam {formatMs(remainingMs)}
                  </Button>
                  {scheduledDate && <p className="mt-2 text-sm text-[#5d6f69]">Jadwal: {formatDateTime(scheduledDate)}</p>}
                </div>
              );
            })()}
        </div>

        {userData?.telegramChatID ? (
          <div onClick={() => window.open("https://t.me/Kabee_official_bot", "_blank")} className="mt-5 cursor-pointer rounded-2xl border border-[#e3eae4] bg-[#fbf8f1] px-5 py-5 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
            <div className="flex items-center gap-2">
              <h1 className="cursor-pointer text-2xl font-semibold text-[#223530]">Help via Telegram</h1>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12" viewBox="0 0 496 512">
                <path
                  fill="#2f7c6d"
                  d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                />
              </svg>
            </div>
            <p className="mt-2 text-sm font-light text-[#5d6f69] underline underline-offset-2">Contact via Telegram</p>
          </div>
        ) : (
          <div onClick={() => window.open("https://t.me/Kabee_official_bot", "_blank")} className="mt-5 cursor-pointer rounded-2xl border border-[#f1d9d9] bg-[#fff7f7] px-5 py-5 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
            <div className="flex items-center gap-2">
              <h1 className="cursor-pointer text-2xl font-semibold text-[#7D1315] underline underline-offset-2 md:text-3xl">Sync to Kabee Bot</h1>
              <svg xmlns="http://www.w3.org/2000/svg" className="md:w-12 w-10" viewBox="0 0 496 512">
                <path
                  fill="#7D1315"
                  d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <p className="mt-2 text-sm italic font-light text-[#7D1315]">
                Your registration code: <span className="rounded bg-[#7D1315] px-2 font-semibold text-white">{userData?.registrationCode?.toUpperCase()}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InjectionSchedule;
