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
    <div className="w-full">
      <h1 className="text-white font-bold text-xl">Home</h1>
      <div className=" flex flex-col sm:flex-row  gap-3 mt-3 w-full">
        <div className="bg-zinc-700 w-full text-white rounded-sm flex justify-start sm:flex-col lg:flex-row sm:items-start items-center gap-3 p-3">
          <img src="/women.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold">
              <CountUp preserveValue={true} end={users?.length} duration={5} />
            </h1>
            <h2 className="text-md f sm:text-sm lg:text-ont-light">User</h2>
          </div>
        </div>
        <div className="bg-zinc-700 w-full text-white rounded-sm flex justify-start sm:flex-col lg:flex-row sm:items-start items-center gap-3 p-3">
          <img src="/bell.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold">
              <CountUp end={reminderStats.autoToday} duration={5} />
            </h1>
            <h2 className="text-md sm:text-sm lg:text- font-light">Reminder otomatis hari ini</h2>
          </div>
        </div>
        <div className="bg-zinc-700 w-full text-white rounded-sm flex justify-start sm:flex-col lg:flex-row sm:items-start items-center gap-3 p-3">
          <img src="/openedMail.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold">
              <CountUp end={reminderStats.adminToday} duration={5} />
            </h1>
            <h2 className="text-md sm:text-sm lg:text- font-light">Pesan Terkirim dari Admin</h2>
          </div>
        </div>
        <div className="bg-zinc-700 w-full text-white rounded-sm flex justify-start sm:flex-col lg:flex-row sm:items-start items-center gap-3 p-3">
          <img src="/closedMail.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold">
              <CountUp end={reminderStats.totalMonth} duration={5} />
            </h1>
            <h2 className="text-md sm:text-sm lg:text- font-light">Total reminder bulan ini</h2>
          </div>
        </div>
        <div className="bg-zinc-700 w-full text-white rounded-sm flex justify-start sm:flex-col lg:flex-row sm:items-start items-center gap-3 p-3">
          <img src="/suntikan.png" alt="women" className="w-11 lg:w-15" />
          <div>
            <h1 className="text-2xl font-semibold">
              <CountUp end={pendingInjectionUsers.length} duration={5} />
            </h1>
            <h2 className="text-md sm:text-sm lg:text- font-light">Pending injection users</h2>
          </div>
        </div>
      </div>
      <div className="">
        <Calendar className={"rounded-sm mt-3 p-3 text-white"} />
      </div>
    </div>
  );
};

export default HomePage;
