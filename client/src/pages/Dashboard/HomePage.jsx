import useAppStore from "@/stores/useAppStore";
import axios from "axios";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import CountUp from "react-countup";

const HomePage = () => {
  const users = useAppStore((state) => state.users);
  const pendingInjectionUsers = useAppStore((state) => state.pendingInjectionUsers);

  const [reminderStats, setReminderStats] = useState({
    autoToday: 0,
    adminToday: 0,
    totalMonth: 0,
  });

  const fetchReminderStats = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/cron/reminder-stats`, {
        withCredentials: true,
      });

      if (data.success) {
        setReminderStats({
          autoToday: data.autoToday,
          adminToday: data.adminToday,
          totalMonth: data.totalMonth,
        });
      }
    } catch (error) {
      console.error("Error fetching reminder stats:", error);
    }
  };

  // Fetch reminder stats when the component mounts
  useEffect(() => {
    fetchReminderStats();
  }, []);

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Dashboard Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f] md:text-4xl">Home</h1>
        <p className="mt-2 text-base leading-7 text-[#5d6f69]">Ringkasan aktivitas admin ditampilkan dengan tampilan yang lebih bersih dan selaras dengan landing page.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
          <img src="/women.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold text-[#24352f]">
              <CountUp preserveValue={true} end={users?.length} duration={5} />
            </h1>
            <h2 className="text-sm font-medium text-[#5d6f69]">User</h2>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
          <img src="/bell.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold text-[#24352f]">
              <CountUp end={reminderStats.autoToday} duration={5} />
            </h1>
            <h2 className="text-sm font-medium text-[#5d6f69]">Reminder otomatis hari ini</h2>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
          <img src="/openedMail.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold text-[#24352f]">
              <CountUp end={reminderStats.adminToday} duration={5} />
            </h1>
            <h2 className="text-sm font-medium text-[#5d6f69]">Pesan Terkirim dari Admin</h2>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
          <img src="/closedMail.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold text-[#24352f]">
              <CountUp end={reminderStats.totalMonth} duration={5} />
            </h1>
            <h2 className="text-sm font-medium text-[#5d6f69]">Total reminder bulan ini</h2>
          </div>
        </div>
        <div className="flex w-full items-center gap-3 rounded-[1.5rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
          <img src="/suntikan.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold text-[#24352f]">
              <CountUp end={pendingInjectionUsers.length} duration={5} />
            </h1>
            <h2 className="text-sm font-medium text-[#5d6f69]">Pending injection users</h2>
          </div>
        </div>
      </div>
      <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#dde4db] bg-white p-4 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Calendar className={"rounded-[1.5rem] p-2 text-[#24302b]"} />
      </div>
    </div>
  );
};

export default HomePage;
