import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/helpers/formatDate";
import formatInjectionType from "@/helpers/formatInjectionType";
import useAppStore from "@/stores/useAppStore";
import { Trash2, Pencil, Search, UserPlus, History, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const UsersPage = () => {
  const users = useAppStore((state) => state.users);
  const deleteUser = useAppStore((state) => state.deleteUser);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Users Data</h1>
      <div className="sm:flex mt-3 justify-between mb-5  items-center">
        <div className="flex min-w-1/2 items-center mb-2 sm:mb-0    border-zinc-800 border-2  bg-zinc-700 px-2   rounded-md  ">
          <Search className="text-zinc-500" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none shadow-none text-zinc-200 placeholder:text-zinc-500"} />
        </div>

        <Link to={"/dashboard/create-user"}>
          <Button className={"bg-teal-800 duration-300 hover:text-zinc-200 transition-all hover:bg-teal-900 cursor-pointer font-semibold"}>
            Create New User <UserPlus />
          </Button>
        </Link>
      </div>
      <div className=" bg-zinc-700 rounded-sm  p-3   mt-2 w-full">
        <Table>
          <TableCaption>Table of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Injection Type</TableHead>
              <TableHead>Next Injection</TableHead>
              <TableHead>Last Injection</TableHead>
              <TableHead>Telegram Chat ID</TableHead>
              <TableHead>Registration Code</TableHead>
              <TableHead>Status</TableHead>
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
                  <TableCell className={"italic"}>{formatInjectionType(item.injectionType)}</TableCell>
                  <TableCell className={"text-pink-300"}>{formatDate(item.nextInjectionDate)}</TableCell>
                  <TableCell className={"text-zinc-400"}>{formatDate(item.lastInjectionDate)}</TableCell>
                  <TableCell>
                    <Badge className={`${item.telegramChatID ? "bg-sky-900 text-sky-300" : "bg-red-900 text-red-300"}  rounded-sm font-bold`}>{item.telegramChatID ? item.telegramChatID : "Not Synced"}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.registrationCode ? <Badge className={"bg-red-900 text-red-300 rounded-sm font-bold"}>{item.registrationCode}</Badge> : <Badge className={"bg-green-900 rounded-sm text-green-300 font-bold"}>Synced</Badge>}
                  </TableCell>
                  <TableCell>{item.telegramChatID ? <Badge className={"bg-green-900 rounded-sm text-green-300 font-bold"}>Synced</Badge> : <Badge className={"bg-red-900 rounded-sm text-red-300 font-bold"}>Not Synced</Badge>}</TableCell>
                  <TableCell>
                    <Avatar className="w-10 h-10 mx-auto cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-zinc-800  border-2 border-zinc-500"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <Link to={`/dashboard/user/${item._id}`} className="flex items-center bg-blue text-blue-500 underline">
                      <Pencil className="w-4" />
                      <p>Edit</p>
                    </Link>
                    <Link to={`/dashboard/user/history/${item._id}/${item.username}`} className="flex items-center cursor-pointer text-green-500 underline">
                      <History className="w-4" />
                      <p>History</p>
                    </Link>
                    <Link to={`/dashboard/user/chat/${item._id}`} className="flex items-center cursor-pointer text-cyan-400 underline">
                      <MessageCircleMore className="w-4" />
                      <p>Chat</p>
                    </Link>
                    <div onClick={() => deleteUser(item._id)} className="flex items-center cursor-pointer text-red-500 underline">
                      <Trash2 className="w-4" />
                      <p>Delete</p>
                    </div>
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

export default UsersPage;
