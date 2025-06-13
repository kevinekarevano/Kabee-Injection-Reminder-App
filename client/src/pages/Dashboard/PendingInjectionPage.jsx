import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/helpers/formatDate";
import useAppStore from "@/stores/useAppStore";
import { Search } from "lucide-react";
import { useState } from "react";

const PendingInjectionPage = () => {
  const pendingInjectionUsers = useAppStore((state) => state.pendingInjectionUsers);
  const injectionConfirmation = useAppStore((state) => state.injectionConfirmation);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = pendingInjectionUsers?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Pending Injection</h1>

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
              <TableHead>Injection Date</TableHead>
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
                  <TableCell className={"text-pink-300"}>{formatDate(item.nextInjectionDate) || "-"}</TableCell>
                  <TableCell>{item.isConfirmed === false ? <Badge className={"bg-red-900 text-red-300 rounded-sm font-bold"}>PENDING</Badge> : "-"}</TableCell>
                  <TableCell>
                    <Avatar className="w-10 h-10 mx-auto cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-zinc-800  border-2 border-zinc-500"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <div onClick={() => injectionConfirmation(item._id)} className="flex items-center bg-teal-700 px-3 py-1 rounded-sm cursor-pointer font-semibold text-white border-teal-800 border-2 gap-2">
                      <p>Confirm Injection</p>
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

export default PendingInjectionPage;
