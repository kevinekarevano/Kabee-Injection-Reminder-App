import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAppStore from "@/stores/useAppStore";
import { Search, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const ChatListPage = () => {
  const users = useAppStore((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Chat List</h1>
      <div className="sm:flex mt-3 justify-between mb-5  items-center">
        <div className="flex min-w-1/2 items-center mb-2 sm:mb-0    border-zinc-800 border-2  bg-zinc-700 px-2   rounded-md  ">
          <Search className="text-zinc-500" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none shadow-none text-zinc-200 placeholder:text-zinc-500"} />
        </div>
      </div>
      <div className=" bg-zinc-700 rounded-sm  p-3   mt-2 w-full">
        <Table>
          <TableCaption>Table of Chat List.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Telegram Chat ID</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={10} className={"text-zinc-500 text-center italic text-lg pt-3  "}>
                  No users found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((item, index) => (
                <TableRow key={index} className={"text-white text-center"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.username}</TableCell>

                  <TableCell>
                    <Badge className={`${item.telegramChatID ? "bg-sky-900 text-sky-300" : "bg-red-900 text-red-300"}  rounded-sm font-bold`}>{item.telegramChatID ? item.telegramChatID : "Not Synced"}</Badge>
                  </TableCell>

                  <TableCell>
                    <Avatar className="w-10 h-10 mx-auto cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-zinc-800  border-2 border-zinc-500"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <Link to={`/dashboard/user/chat/${item._id}`} className="flex items-center cursor-pointer ">
                      <div className="flex items-center bg-teal-700 px-3 py-1 rounded-sm cursor-pointer font-semibold text-white border-teal-800 border-2 gap-2">
                        <p>Chat</p>
                        <MessageCircleMore size={16} />
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChatListPage;
