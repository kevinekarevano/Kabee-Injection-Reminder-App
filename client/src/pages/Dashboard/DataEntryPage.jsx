import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAppStore from "@/stores/useAppStore";
import { Search, UserPen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const DataEntryPage = () => {
  const users = useAppStore((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Data Entry</h1>

      <div className="flex w-full md:w-1/3 items-center mb-2 sm:mb-0  mt-5   border-zinc-800 border-2  bg-zinc-700 px-2   rounded-md  ">
        <Search className="text-zinc-500" />
        <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none shadow-none text-zinc-200 placeholder:text-zinc-500"} />
      </div>

      <div className=" bg-zinc-700 rounded-sm  p-3   mt-2 w-full">
        <Table>
          <TableCaption>Table of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
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
                <TableCell colSpan={7} className={"text-zinc-500 text-center italic text-lg pt-3  "}>
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
                    <Link to={`/dashboard/user/${item._id}`} className="flex items-center bg-blue-700 px-3 py-1 rounded-sm font-semibold text-white border-blue-800 border-2 gap-2">
                      <p>Edit</p>
                      <UserPen size={15} />
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

export default DataEntryPage;
