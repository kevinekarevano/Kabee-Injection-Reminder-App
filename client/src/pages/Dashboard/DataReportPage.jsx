import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, FunnelX, Search, TableProperties } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import formatInjectionType from "@/helpers/formatInjectionType";
import { formatDate } from "@/helpers/formatDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleExportExcel, handleExportPDF } from "@/helpers/exportReport";

const DataReportPage = () => {
  const [userDataReport, setUserDataReport] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const currentYear = new Date().getFullYear();
  const generatedYears = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  const filteredUsers = userDataReport?.filter((item) => {
    return item.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getUserDataReport = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/injection-report`, {
        withCredentials: true,
        params: {
          year: year || undefined,
          month: year && month ? month : undefined, // hanya kirim month jika year juga dipilih
        },
      });

      if (data.success) {
        setUserDataReport(data.data);
      }
    } catch (error) {
      console.error("Error fetching user data report:", error);
    }
  };

  useEffect(() => {
    getUserDataReport();
  }, [month, year]);

  return (
    <div className="w-full ">
      <h1 className="text-white font-bold text-xl">Injection Report</h1>

      <div className="sm:flex mt-3 justify-between mb-5 gap-2  items-center">
        <div className="flex min-w-1/3 items-center mb-2 sm:mb-0    border-zinc-800 border-2  bg-zinc-700 px-2   rounded-md  ">
          <Search className="text-zinc-500" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className={"border-none shadow-none text-zinc-200 placeholder:text-zinc-500"} />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select onValueChange={(e) => setYear(e)} value={year}>
            <SelectTrigger className=" bg-zinc-800 border-zinc-900 text-zinc-300">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-zinc-200 border-none">
              {generatedYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(e) => setMonth(e)} value={month}>
            <SelectTrigger className=" bg-zinc-800 border-zinc-900  text-zinc-300">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-zinc-200 border-none">
              <SelectItem value="1">January</SelectItem>
              <SelectItem value="2">February</SelectItem>
              <SelectItem value="3">March</SelectItem>
              <SelectItem value="4">April</SelectItem>
              <SelectItem value="5">May</SelectItem>
              <SelectItem value="6">June</SelectItem>
              <SelectItem value="7">July</SelectItem>
              <SelectItem value="8">August</SelectItem>
              <SelectItem value="9">September</SelectItem>
              <SelectItem value="10">October</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">December</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className={"cursor-pointer"}
            onClick={() => {
              setMonth("");
              setYear("");
              setSearchTerm("");
            }}
          >
            <FunnelX />
            Reset Filter
          </Button>
          <Button className={"cursor-pointer bg-green-700 hover:bg-green-600"} onClick={() => handleExportExcel(filteredUsers)}>
            <TableProperties />
            Export to Excel
          </Button>
          <Button className={"cursor-pointer bg-rose-700 hover:bg-rose-600"} onClick={() => handleExportPDF(filteredUsers)}>
            <FileText />
            Export to PDF
          </Button>
        </div>
      </div>
      <div className=" bg-zinc-700 rounded-sm  p-3   mt-2 w-full">
        <Table>
          <TableCaption>Table of users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Injection Type</TableHead>
              <TableHead>Injection Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Avatar</TableHead>
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
                  <TableCell>{item.user.username}</TableCell>
                  <TableCell className={"italic"}>{formatInjectionType(item.user.injectionType) || "-"}</TableCell>
                  <TableCell className={"text-pink-300"}>{formatDate(item.injectionDate) || "-"}</TableCell>
                  <TableCell>
                    <Badge className={"bg-green-900 rounded-sm text-green-300 font-bold"}>Completed</Badge>
                  </TableCell>
                  <TableCell>
                    <Avatar className="w-10 h-10 mx-auto cursor-pointer">
                      <AvatarImage className={" object-cover"} src={item.user.avatar.url} />
                      <AvatarFallback className={"font-poppins font-bold text-xl text-white bg-zinc-800  border-2 border-zinc-500"}>AD</AvatarFallback>
                    </Avatar>
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

export default DataReportPage;
