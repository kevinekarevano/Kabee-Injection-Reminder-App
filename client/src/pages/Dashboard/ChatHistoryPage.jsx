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
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Chat History</h1>
      <div className="sm:flex mt-3 justify-between mb-5  items-center">
        <div className="flex min-w-1/2 items-center mb-2 sm:mb-0    border-zinc-800 border-2  bg-zinc-700 px-2   rounded-md  ">
          <Search className="text-zinc-500" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Example: 24 April 2025" className={"border-none shadow-none text-zinc-200 placeholder:text-zinc-500"} />
        </div>
      </div>
      <div className=" bg-zinc-700 rounded-sm  p-3   mt-2 w-full">
        <Table>
          <TableCaption>Table of chat histories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChats?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={10} className={"text-zinc-500 text-center italic text-lg pt-3  "}>
                  No chat found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredChats?.map((item, index) => (
                <TableRow key={index} className={"text-white text-center"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className={"text-pink-300"}>{item.username}</TableCell>
                  <TableCell>
                    <div className="max-w-xs text-start">{item.message}</div>
                  </TableCell>
                  <TableCell className={"italic"}>{dayjs(item.createdAt).format("D MMMM YYYY HH:mm")}</TableCell>
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
