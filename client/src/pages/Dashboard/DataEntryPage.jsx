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
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Data Entry</h1>
      </div>

      <div className="mt-6 flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)] md:w-1/3">
        <Search className="text-[#72827a]" />
        <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]"} />
      </div>

      <div className="mt-2 w-full rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"text-[#72827a]"}>Table of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#24302b]">#</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Username</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Method</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Telegram Chat ID</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Registration Code</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Status</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Avatar</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={8} className={"pt-3 text-center text-lg italic text-[#5d6f69]"}>
                  No users found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((item, index) => (
                <TableRow key={index} className={"text-center text-[#24302b]"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>
                    {item.contraceptiveMethod === "pill" ? <Badge className={"rounded-full bg-[#edf4ef] font-bold text-[#2f7c6d]"}>Pil</Badge> : <Badge className={"rounded-full bg-[#edf4ef] font-bold text-[#2f7c6d]"}>Suntik</Badge>}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${item.telegramChatID ? "bg-[#edf4ef] text-[#2f7c6d]" : "bg-[#fff0ef] text-[#c34a39]"} rounded-full font-bold`}>{item.telegramChatID ? item.telegramChatID : "Not Synced"}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.registrationCode ? <Badge className={"rounded-full bg-[#fff0ef] font-bold text-[#c34a39]"}>{item.registrationCode}</Badge> : <Badge className={"rounded-full bg-[#edf4ef] font-bold text-[#2f7c6d]"}>Synced</Badge>}
                  </TableCell>
                  <TableCell>
                    {item.telegramChatID ? <Badge className={"rounded-full bg-[#edf4ef] font-bold text-[#2f7c6d]"}>Synced</Badge> : <Badge className={"rounded-full bg-[#fff0ef] font-bold text-[#c34a39]"}>Not Synced</Badge>}
                  </TableCell>
                  <TableCell>
                    <Avatar className="mx-auto h-10 w-10 cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"border-2 border-[#dde4db] bg-[#2f7c6d] font-poppins text-xl font-bold text-white"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <Link to={`/dashboard/user/${item._id}`} className="flex items-center gap-2 rounded-full bg-[#2f7c6d] px-3 py-1 font-semibold text-white">
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
