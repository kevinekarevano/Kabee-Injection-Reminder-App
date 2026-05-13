import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/helpers/formatDate";
import formatInjectionType from "@/helpers/formatInjectionType";
import getAge from "@/helpers/getAge";
import useAppStore from "@/stores/useAppStore";
import { Trash2, Search, UserPlus, History } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const UsersPage = () => {
  const users = useAppStore((state) => state.users);
  const deleteUser = useAppStore((state) => state.deleteUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const filteredUsers = users?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Users Data</h1>
      </div>

      <div className="mb-5 mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)] sm:max-w-xl">
          <Search className="text-[#72827a]" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]"} />
        </div>

        <Link to={"/dashboard/create-user"}>
          <Button className={"cursor-pointer rounded-full bg-[#2f7c6d] font-semibold text-white transition-all duration-300 hover:bg-[#275f55]"}>
            Create New User <UserPlus />
          </Button>
        </Link>
      </div>
      <div className="mt-2 w-full overflow-hidden rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"text-[#72827a]"}>Table of users.</TableCaption>
          <TableHeader>
            <TableRow className={"border-[#dde4db]"}>
              <TableHead className="font-semibold text-[#24302b]">#</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Username</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Method</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Age</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Injection Type</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Next Injection</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Last Injection</TableHead>
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
                <TableCell colSpan={12} className={"pt-3 text-center text-lg italic text-[#5d6f69]"}>
                  No users found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((item, index) => (
                <TableRow key={index} className={"text-center text-[#24302b]"}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>
                    {item.contraceptiveMethod === "pill" ? <Badge className={"bg-amber-900 text-amber-300 rounded-sm font-bold"}>Pil</Badge> : <Badge className={"bg-sky-900 text-sky-300 rounded-sm font-bold"}>Suntik</Badge>}
                  </TableCell>
                  <TableCell>{getAge(item.birthDate)}</TableCell>
                  <TableCell className={"italic"}>
                    {item.contraceptiveMethod === "pill" ? (
                      <Badge className={"bg-amber-900 text-amber-300 rounded-sm font-bold"}>Tidak berlaku</Badge>
                    ) : (
                      <Link to={"/dashboard/users/data-entry"}>{item.injectionType ? formatInjectionType(item.injectionType) : <span className="text-[#c34a39] underline">Belum diatur (Wajib diisi)</span>}</Link>
                    )}
                  </TableCell>
                  <TableCell className={"text-[#2f7c6d]"}>{formatDate(item.nextInjectionDate) || "-"}</TableCell>
                  <TableCell className={"text-[#72827a]"}>{formatDate(item.contraceptiveMethod === "pill" ? item.lastPillDate || item.lastInjectionDate : item.lastInjectionDate) || "-"}</TableCell>
                  <TableCell>
                    <Badge className={`${item.telegramChatID ? "bg-sky-900 text-sky-300" : "bg-red-900 text-red-300"}  rounded-sm font-bold`}>{item.telegramChatID ? item.telegramChatID : "Not Synced"}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.registrationCode ? <Badge className={"bg-red-900 text-red-300 rounded-sm font-bold"}>{item.registrationCode}</Badge> : <Badge className={"bg-green-900 rounded-sm text-green-300 font-bold"}>Synced</Badge>}
                  </TableCell>
                  <TableCell>{item.telegramChatID ? <Badge className={"bg-green-900 rounded-sm text-green-300 font-bold"}>Synced</Badge> : <Badge className={"bg-red-900 rounded-sm text-red-300 font-bold"}>Not Synced</Badge>}</TableCell>
                  <TableCell>
                    <Avatar className="mx-auto h-10 w-10 cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"border-2 border-[#dde4db] bg-[#2f7c6d] font-poppins text-xl font-bold text-white"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <Link to={`/dashboard/user/history/${item._id}/${item.username}`} className="flex items-center cursor-pointer text-green-500 underline">
                      <History className="w-4" />
                      <p>History</p>
                    </Link>

                    <div onClick={() => handleDeleteClick(item._id)} className="flex items-center cursor-pointer text-red-500 underline">
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#24302b]">Confirm Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-[#24302b]">
            <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelDelete} className="border-[#dde4db] text-[#24302b] hover:bg-[#f5f5f5]">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
