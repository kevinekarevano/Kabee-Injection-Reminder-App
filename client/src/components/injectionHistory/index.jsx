import useAppStore from "@/stores/useAppStore";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import formatInjectionType from "@/helpers/formatInjectionType";
import { formatDate } from "@/helpers/formatDate";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

const InjectionHistory = () => {
  const injectionHistory = useAppStore((state) => state.injectionHistory);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = injectionHistory?.filter((item) => {
    return formatDate(item.injectionDate).toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className=" items-center md:flex   w-full mb-5 md:mb-0 justify-between px-5 md:px-2 ">
        <h1 className="text-[#EFF6F7] font-semibold w-full text-3xl pb-3 pt-7 md:px-5 md:py-7">Injection History</h1>
        <div className="flex  items-center  w-full border-[#303e3f] border-2  bg-[#455a5d] px-2   rounded-md  ">
          <Search color="#70878a" />
          <Input placeholder="Search for history by date..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={"border-none shadow-none text-zinc-200 placeholder:text-[#70878a]"} />
        </div>
      </div>
      <div className="px-5 max-h-64 overflow-auto ">
        <Table>
          <TableCaption className={"text-zinc-200 italic "}>A list of your recent injection.</TableCaption>
          <TableHeader>
            <TableRow className={"text-xl text-left"}>
              <TableHead className={"text-[#EFF6F7] font-semibold w-10"}>#</TableHead>
              <TableHead className={"text-[#EFF6F7] font-semibold"}>Date</TableHead>
              <TableHead className={"text-[#EFF6F7] font-semibold"}>Type</TableHead>
              <TableHead className={"text-[#EFF6F7] font-semibold"}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={4} className={"text-[#EFF6F7] italic text-center "}>
                  No injection history found.
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory?.map((item, index) => (
                <TableRow key={index} className={"text-lg"}>
                  <TableCell className={"text-[#EFF6F7] font-bold "}>{index + 1}</TableCell>
                  <TableCell className={"text-[#EFF6F7] "}>{formatDate(item?.injectionDate)}</TableCell>
                  <TableCell className={"text-[#EFF6F7] font-extralight italic"}>{formatInjectionType(item?.injectionType)}</TableCell>
                  <TableCell className={"text-[#0B2E33] underline"}>
                    <Badge className={'bg-green-800'}>Completed</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InjectionHistory;
