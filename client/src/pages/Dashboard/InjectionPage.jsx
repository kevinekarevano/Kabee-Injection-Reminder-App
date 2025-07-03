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
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Injection</h1>

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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={"bg-teal-700 border-teal-800 border-2 cursor-pointer hover:bg-teal-800 transition duration-500"}>Confrim Injection</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-[#232E30] border-none  ">
                        <DialogHeader>
                          <DialogTitle className={"text-white text-xl"}>Injection Confirmation</DialogTitle>
                          <DialogDescription className={"text-zinc-300"}>Please make sure all data is correct before confirming the injection. Click "Save changes" to submit.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label className={"text-white"} htmlFor="weight">
                              Weight (kg)<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"bg-zinc-700 border-zinc-800 border-2 text-zinc-200"}
                              value={form.weight}
                              onChange={(e) => setForm({ ...form, weight: e.target.value })}
                              id="weight"
                              name="weight"
                              placeholder="Enter weight..."
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className={"text-white"} htmlFor="height">
                              Heigth (cm)<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"bg-zinc-700 border-zinc-800 border-2 text-zinc-200"}
                              value={form.height}
                              onChange={(e) => setForm({ ...form, height: e.target.value })}
                              id="height"
                              name="height"
                              placeholder="Enter height..."
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className={"text-white"} htmlFor="bloodpressure">
                              Blood Pressure<span className="text-red-400">*</span>
                            </Label>
                            <Input
                              className={"bg-zinc-700 border-zinc-800 border-2 text-zinc-200"}
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
                            <Button className={"bg-red-500 cursor-pointer border-red-500 text-white hover:bg-red-500 hover:text-white"} variant="outline">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button onClick={() => injectionConfirmation(item._id, form)} className={"bg-emerald-600 cursor-pointer border-emerald-600 text-white hover:bg-emerald-600 hover:text-white"}>
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
