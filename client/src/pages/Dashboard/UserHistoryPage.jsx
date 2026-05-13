import BreadcrumbCustom from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/helpers/formatDate";
import formatInjectionType from "@/helpers/formatInjectionType";
import useAppStore from "@/stores/useAppStore";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Link, useParams } from "react-router";

const UserHistoryPage = () => {
  const injectionHistory = useAppStore((state) => state.injectionHistory);
  const getInjectionHistory = useAppStore((state) => state.getInjectionHistory);
  const { id, username } = useParams();
  const isPillUser = injectionHistory?.[0]?.user?.contraceptiveMethod === "pill";

  useEffect(() => {
    if (id) {
      getInjectionHistory(id);
    }
  }, [id, getInjectionHistory]);

  return (
    <div className="w-full text-[#24302b]">
      <BreadcrumbCustom pageName={"History"} />
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">User Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">
          {isPillUser ? "KB History" : "Injection History"} - {injectionHistory?.[0]?.user?.username || username}
        </h1>
      </div>
      <div className="mt-6 rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)]">
        <Table>
          <TableCaption className={"italic text-[#72827a]"}>{isPillUser ? "A list of your recent KB activity." : "A list of your recent injection."}</TableCaption>
          <TableHeader>
            <TableRow className={"text-xl text-left"}>
              <TableHead className={"w-10 font-semibold text-[#24302b]"}>#</TableHead>
              <TableHead className={"font-semibold text-[#24302b]"}>Date</TableHead>
              <TableHead className={"font-semibold text-[#24302b]"}>{isPillUser ? "Method" : "Type"}</TableHead>
              <TableHead className={"font-semibold text-[#24302b]"}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {injectionHistory?.length === 0 ? (
              <TableRow className={"text-lg"}>
                <TableCell colSpan={4} className={"text-center italic text-[#5d6f69]"}>
                  {isPillUser ? "No KB history found." : "No injection history found."}
                </TableCell>
              </TableRow>
            ) : (
              injectionHistory?.map((item, index) => (
                <TableRow key={index} className={"text-lg"}>
                  <TableCell className={"font-bold text-[#24302b]"}>{index + 1}.</TableCell>
                  <TableCell className={"text-[#5d6f69]"}>{dayjs(item.createdAt).format("D MMMM YYYY HH:mm")}</TableCell>
                  <TableCell className={"font-extralight italic text-[#5d6f69]"}>{isPillUser ? <Badge className={"rounded-full bg-[#edf4ef] font-bold text-[#2f7c6d]"}>Pil</Badge> : formatInjectionType(item?.injectionType)}</TableCell>
                  <TableCell>
                    <Badge className={isPillUser ? "rounded-full bg-[#edf4ef] text-[#2f7c6d]" : "rounded-full bg-[#edf4ef] text-[#2f7c6d]"}>Completed</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Link className="block w-full" to={"/dashboard/users"}>
          <Button className={"cursor-pointer rounded-full bg-[#2f7c6d] font-bold text-white duration-500 hover:bg-[#275f55]"}>Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserHistoryPage;
