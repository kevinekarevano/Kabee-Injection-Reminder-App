import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/helpers/formatDate";
import useAppStore from "@/stores/useAppStore";
import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PendingInjectionPage = () => {
  const pendingInjectionUsers = useAppStore((state) => state.pendingInjectionUsers);
  const injectionConfirmation = useAppStore((state) => state.injectionConfirmation);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    weight: "",
    height: "",
    bloodPressure: "",
  });

  const filteredUsers = pendingInjectionUsers?.filter((item) => {
    return item.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">Confirm Injection</h1>
      </div>

      <div className="mt-6 flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)] md:w-1/3">
        <Search className="text-[#72827a]" />
        <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]"} />
      </div>

      <div className="mt-2 w-full rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"text-[#72827a]"}>Daftar user yang perlu konfirmasi suntik.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-[#24302b]">#</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Username</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Tanggal Suntik</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Status</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Avatar</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={7} className={"pt-3 text-center text-lg italic text-[#5d6f69]"}>
                  No users found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((item, index) => (
                <TableRow key={index} className={"text-center text-[#24302b]"}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{item.username}</TableCell>

                  <TableCell className={"text-[#2f7c6d]"}>{formatDate(item.nextInjectionDate) || "-"}</TableCell>

                  <TableCell>{item.isConfirmed === false ? <Badge className={"rounded-full bg-[#fff0ef] font-bold text-[#c34a39]"}>PENDING</Badge> : "-"}</TableCell>

                  <TableCell>
                    <Avatar className="mx-auto h-10 w-10 cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.avatar.url} />
                      <AvatarFallback className={"border-2 border-[#dde4db] bg-[#2f7c6d] font-poppins text-xl font-bold text-white"}>AD</AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell className={"flex gap-2 items-center justify-center"}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={"bg-teal-700 border-teal-800 border-2 cursor-pointer hover:bg-teal-800 transition duration-500"}>Konfirmasi Suntik</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] border border-[#dde4db] bg-white">
                        <DialogHeader>
                          <DialogTitle className={"text-xl text-[#24302b]"}>Confirm Injection</DialogTitle>
                          <DialogDescription className={"text-[#5d6f69]"}>Please make sure all data is correct before saving the injection confirmation.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label className={"text-[#24302b]"} htmlFor="weight">
                              Weight (kg)<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"}
                              value={form.weight}
                              onChange={(e) => setForm({ ...form, weight: e.target.value })}
                              id="weight"
                              name="weight"
                              placeholder="Enter weight..."
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className={"text-[#24302b]"} htmlFor="height">
                              Heigth (cm)<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"}
                              value={form.height}
                              onChange={(e) => setForm({ ...form, height: e.target.value })}
                              id="height"
                              name="height"
                              placeholder="Enter height..."
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className={"text-[#24302b]"} htmlFor="bloodpressure">
                              Blood Pressure<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"border-[#dde4db] bg-white text-[#24302b] placeholder:text-[#8b9a93]"}
                              value={form.bloodPressure}
                              onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })}
                              id="bloodpressure"
                              name="bloodPressure"
                              placeholder="Enter blood pressure..."
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button className={"cursor-pointer rounded-full border border-[#dde4db] bg-[#fbf8f1] text-[#c34a39] hover:bg-white"} variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button onClick={() => injectionConfirmation(item._id, form)} className={"cursor-pointer rounded-full bg-[#2f7c6d] text-white hover:bg-[#275f55]"}>
                            Confirm
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
