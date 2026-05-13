import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import axios from "axios";
import dayjs from "dayjs";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ChatHistoryPage = () => {
  //   const users = useAppStore((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const getChatHistory = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/chat-history`, { withCredentials: true });
      if (data.success) {
        setChatHistory(data.data);
      } else {
        toast.error(data.message || "Failed to fetch chat history");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.warning(error.response.data.message);
      } else {
        toast.error("An error occurred while fetching chat history, please try again");
      }
    }
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  const filteredChats = chatHistory?.filter((item) => {
    // Format tanggal sesuai tampilan di tabel, misal: "2 July 2025"
    const formattedDate = dayjs(item.createdAt).format("D MMMM YYYY");
    return formattedDate.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Chat Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Chat History</h1>
      </div>
      <div className="mb-5 mt-6 flex items-center justify-between gap-3 sm:flex-row">
        <div className="flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)] sm:max-w-xl">
          <Search className="text-[#72827a]" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Example: 24 April 2025" className={"border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]"} />
        </div>
      </div>
      <div className="mt-2 w-full rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"text-[#72827a]"}>Table of chat histories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#24302b]">#</TableHead>
              <TableHead className="font-semibold text-[#24302b]">User</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Message</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChats?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={10} className={"pt-3 text-center text-lg italic text-[#5d6f69]"}>
                  No chat found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredChats?.map((item, index) => (
                <TableRow key={index} className={"text-center text-[#24302b]"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className={"text-[#2f7c6d]"}>{item.username}</TableCell>
                  <TableCell>
                    <div className="max-w-xs text-start text-[#5d6f69]">{item.message}</div>
                  </TableCell>
                  <TableCell className={"italic text-[#72827a]"}>{dayjs(item.createdAt).format("D MMMM YYYY HH:mm")}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChatHistoryPage;
