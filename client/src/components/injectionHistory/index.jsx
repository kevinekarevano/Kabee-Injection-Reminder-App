import useAppStore from "@/stores/useAppStore";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import formatInjectionType from "@/helpers/formatInjectionType";
import { formatDate } from "@/helpers/formatDate";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";

const InjectionHistory = () => {
  const injectionHistory = useAppStore((state) => state.injectionHistory);
  const userData = useAppStore((state) => state.userData);
  const [searchTerm, setSearchTerm] = useState("");
  const isPillUser = userData?.contraceptiveMethod === "pill";

  const filteredHistory = injectionHistory?.filter((item) => {
    return dayjs(item.injectionDate).format("D MMMM YYYY HH:mm").toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getHistoryTitle = () => (isPillUser ? "Pill History" : "Injection History");
  const getHistoryCaption = () => (isPillUser ? "A list of your recent pill activity." : "A list of your recent injection.");
  const formatDateTime = (value) => (value ? dayjs(value).format("D MMMM YYYY HH:mm") : "-");
  const formatDelay = (minutes) => {
    const delay = Number(minutes || 0);
    if (delay <= 0) return "On time";
    const hours = Math.floor(delay / 60);
    const mins = delay % 60;
    if (hours > 0) return `${hours}j ${mins}m terlambat`;
    return `${mins}m terlambat`;
  };

  return (
    <>
      <div className="mb-5  w-full items-center justify-between px-2 md:px-0">
        <h1 className="w-full pb-2 pt-1 text-2xl font-semibold text-[#223530] md:text-3xl">{getHistoryTitle()}</h1>

        <div className="flex w-full max-w-md items-center rounded-2xl border border-[#e3eae4] bg-white px-3 py-2 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
          <Search color="#72827a" size={18} />
          <Input
            placeholder={isPillUser ? "Search pill history by date..." : "Search for history by date..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={"border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]"}
          />
        </div>
      </div>
      <div className="max-h-72 overflow-auto rounded-2xl border border-[#e3eae4] bg-white px-4 py-2 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"text-[#72827a] italic"}>{getHistoryCaption()}</TableCaption>
          <TableHeader>
            <TableRow className={"text-xl text-left"}>
              <TableHead className={"w-10 font-semibold text-[#24302b]"}>#</TableHead>
              <TableHead className={"font-semibold text-[#24302b]"}>{isPillUser ? "Confirmed At" : "Date"}</TableHead>
              {isPillUser && <TableHead className={"font-semibold text-[#24302b]"}>Scheduled At</TableHead>}
              <TableHead className={"font-semibold text-[#24302b]"}>{isPillUser ? "Method" : "Type"}</TableHead>
              <TableHead className={"font-semibold text-[#24302b]"}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={isPillUser ? 5 : 4} className={"text-center italic text-[#5d6f69]"}>
                  {isPillUser ? "No pill history found." : "No injection history found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory?.map((item, index) => (
                <TableRow key={index} className={"text-lg"}>
                  <TableCell className={"font-bold text-[#24302b]"}>{index + 1}</TableCell>
                  <TableCell className={"text-[#5d6f69]"}>{formatDateTime(item.consumedAt || item.injectionDate || item.createdAt)}</TableCell>
                  {isPillUser && <TableCell className={"text-[#5d6f69]"}>{formatDateTime(item.scheduledAt)}</TableCell>}
                  <TableCell className={"italic text-[#5d6f69]"}>{isPillUser ? <Badge className={"rounded-full bg-[#edf4ef] px-2.5 py-1 font-bold text-[#2f7c6d]"}>Pill</Badge> : formatInjectionType(item?.injectionType)}</TableCell>
                  <TableCell className={"text-[#0B2E33] underline"}>
                    <Badge className={isPillUser ? "rounded-full bg-[#edf4ef] px-2.5 py-1 text-[#2f7c6d]" : "rounded-full bg-[#edf4ef] px-2.5 py-1 text-[#2f7c6d]"}>{isPillUser ? formatDelay(item.delayMinutes) : "Completed"}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InjectionHistory;
