import BreadcrumbCustom from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/helpers/formatDate";
import formatInjectionType from "@/helpers/formatInjectionType";
import useAppStore from "@/stores/useAppStore";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

const UserHistoryPage = () => {
  const injectionHistory = useAppStore((state) => state.injectionHistory);
  const getInjectionHistory = useAppStore((state) => state.getInjectionHistory);
  const { id, username } = useParams();

  useEffect(() => {
    if (id) {
      getInjectionHistory(id);
    }
  }, [id, getInjectionHistory]);

  return (
    <div className="w-full">
      <BreadcrumbCustom pageName={"History"} />
      <h1 className="text-white font-bold text-xl">History - {injectionHistory?.[0]?.user?.username || username}</h1>
      <div className="bg-zinc-700 rounded-sm mt-3 p-3">
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
            {injectionHistory?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={4} className={"text-[#EFF6F7] italic text-center "}>
                  No injection history found.
                </TableCell>
              </TableRow>
            ) : (
              injectionHistory?.map((item, index) => (
                <TableRow key={index} className={"text-lg"}>
                  <TableCell className={"text-[#EFF6F7] font-bold "}>{index + 1}.</TableCell>
                  <TableCell className={"text-[#EFF6F7] "}>{formatDate(item?.injectionDate)}</TableCell>
                  <TableCell className={"text-[#EFF6F7] font-extralight italic"}>{formatInjectionType(item?.injectionType)}</TableCell>
                  <TableCell>
                    <Badge className={"bg-green-700"}>Completed</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Link className="block w-full" to={"/dashboard/users"}>
          <Button className={"bg-emerald-300  text-emerald-900  hover:bg-emerald-400 hover:text-emerald-950 duration-500 font-bold cursor-pointer"}>Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserHistoryPage;
