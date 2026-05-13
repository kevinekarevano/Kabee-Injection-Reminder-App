import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, FunnelX, Search, TableProperties } from "lucide-react";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import formatInjectionType from "@/helpers/formatInjectionType";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { handleExportExcel, handleExportPDF } from "@/helpers/exportReport";
import dayjs from "dayjs";
import getAge from "@/helpers/getAge";
import { formatDate } from "@/helpers/formatDate";

const DataReportPage = () => {
  const [userDataReport, setUserDataReport] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const currentYear = new Date().getFullYear();
  const generatedYears = Array.from({ length: 5 }, (_, i) => String(currentYear - i));

  const filteredUsers = userDataReport?.filter((item) => {
    const matchesSearch = item.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    if (methodFilter === "all") return matchesSearch;
    return matchesSearch && item.method === methodFilter;
  });

  const getMethodLabel = (method) => {
    return method === "pill" ? "Pil" : "Suntik";
  };

  const getMethodBadgeColor = (method) => {
    return method === "pill" ? "bg-amber-100 text-amber-800" : "bg-sky-100 text-sky-800";
  };

  const getUserDataReport = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/injection-report`, {
        withCredentials: true,
        params: {
          year: year || undefined,
          month: year && month ? month : undefined,
        },
      });

      if (data.success) {
        setUserDataReport(data.data);
      }
    } catch (error) {
      console.error("Error fetching user data report:", error);
    }
  };

  const renderInjectionSpecificColumns = (item) => (
    <>
      <TableCell>{item.injectionType ? formatInjectionType(item.injectionType) : "-"}</TableCell>
      <TableCell className="text-[#2f7c6d] font-medium">{formatDate(item.user.nextInjectionDate) || "-"}</TableCell>
      <TableCell className="text-[#72827a]">{formatDate(item.user.lastInjectionDate) || "-"}</TableCell>
    </>
  );

  const renderPillSpecificColumns = (item) => (
    <>
      <TableCell>{item.user.dailyPillTime || "-"}</TableCell>
      <TableCell className="text-[#72827a]">{formatDate(item.user.lastPillDate) || "-"}</TableCell>
    </>
  );

  useEffect(() => {
    getUserDataReport();
  }, [month, year]);

  return (
    <div className="w-full text-[#24302b]">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#72827a]">Report Management</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#24352f]">KB Report</h1>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4">
        <div className="flex w-full items-center rounded-full border border-[#dde4db] bg-white px-4 py-3 shadow-[0_12px_25px_rgba(34,53,48,0.04)]">
          <Search className="text-[#72827a]" />
          <Input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} placeholder="Search for user by username..." className="border-none bg-transparent shadow-none text-[#24302b] placeholder:text-[#8b9a93]" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-1 flex-wrap">
            <Button onClick={() => setMethodFilter("all")} className={`rounded-full font-semibold text-sm ${methodFilter === "all" ? "bg-[#2f7c6d] text-white" : "bg-white border border-[#dde4db] text-[#24302b] hover:bg-[#fbf8f1]"}`}>
              All
            </Button>
            <Button
              onClick={() => setMethodFilter("injection")}
              className={`rounded-full font-semibold text-sm ${methodFilter === "injection" ? "bg-sky-600 text-white" : "bg-white border border-[#dde4db] text-[#24302b] hover:bg-[#fbf8f1]"}`}
            >
              Injection
            </Button>
            <Button onClick={() => setMethodFilter("pill")} className={`rounded-full font-semibold text-sm ${methodFilter === "pill" ? "bg-amber-600 text-white" : "bg-white border border-[#dde4db] text-[#24302b] hover:bg-[#fbf8f1]"}`}>
              Pill
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Select onValueChange={(e) => setYear(e)} value={year}>
              <SelectTrigger className="border-[#dde4db] bg-white text-[#24302b]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="border-[#dde4db] bg-white text-[#24302b]">
                {generatedYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={(e) => setMonth(e)} value={month}>
              <SelectTrigger className="border-[#dde4db] bg-white text-[#24302b]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="border-[#dde4db] bg-white text-[#24302b]">
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
              className="cursor-pointer rounded-full border border-[#dde4db] bg-white text-[#24302b] hover:bg-[#fbf8f1]"
              onClick={() => {
                setMonth("");
                setYear("");
                setSearchTerm("");
                setMethodFilter("all");
              }}
            >
              <FunnelX className="w-4 h-4" />
              Reset
            </Button>

            <Button className="cursor-pointer rounded-full bg-[#2f7c6d] text-white hover:bg-[#275f55]" onClick={() => handleExportExcel(filteredUsers)}>
              <TableProperties className="w-4 h-4" />
              Excel
            </Button>

            <Button className="cursor-pointer rounded-full bg-[#c34a39] text-white hover:bg-[#ab3e30]" onClick={() => handleExportPDF(filteredUsers)}>
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 w-full rounded-[2rem] border border-[#dde4db] bg-white p-3 shadow-[0_16px_30px_rgba(34,53,48,0.04)] overflow-x-auto">
        <Table>
          <TableCaption className="text-[#72827a]">{methodFilter === "all" ? "All KB Method Reports" : `${methodFilter === "injection" ? "Injection" : "Pill"} Method Reports`}</TableCaption>
          <TableHeader>
            <TableRow className="border-b border-[#dde4db]">
              <TableHead className="font-semibold text-[#24302b] text-center">#</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Name</TableHead>
              <TableHead className="font-semibold text-[#24302b] text-center">Age</TableHead>
              <TableHead className="font-semibold text-[#24302b] text-center">Method</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Report Date</TableHead>
              <TableHead className="font-semibold text-[#24302b] text-center">Weight (kg)</TableHead>
              <TableHead className="font-semibold text-[#24302b] text-center">Height (cm)</TableHead>
              <TableHead className="font-semibold text-[#24302b]">Blood Pressure</TableHead>
              <TableHead className="font-semibold text-[#24302b] text-center">Children</TableHead>
              {methodFilter === "injection" || methodFilter === "all" ? (
                <>
                  <TableHead className="font-semibold text-[#24302b]">Injection Type</TableHead>
                  <TableHead className="font-semibold text-[#24302b]">Next Injection</TableHead>
                  <TableHead className="font-semibold text-[#24302b]">Last Injection</TableHead>
                </>
              ) : null}
              {methodFilter === "pill" || methodFilter === "all" ? (
                <>
                  <TableHead className="font-semibold text-[#24302b]">Daily Pill Time</TableHead>
                  <TableHead className="font-semibold text-[#24302b]">Last Pill Date</TableHead>
                </>
              ) : null}
              <TableHead className="font-semibold text-[#24302b]">Avatar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={methodFilter === "injection" ? 15 : methodFilter === "pill" ? 13 : 13} className="pt-6 pb-6 text-center text-lg italic text-[#5d6f69]">
                  No users found 🥲
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers?.map((item, index) => (
                <TableRow key={index} className="border-b border-[#dde4db] hover:bg-[#f9f9f9]">
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.user.username}</TableCell>
                  <TableCell className="text-center">{getAge(item.user.birthDate)}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={`${getMethodBadgeColor(item.method)} rounded-full font-semibold`}>{getMethodLabel(item.method)}</Badge>
                  </TableCell>
                  <TableCell className="text-[#2f7c6d]">{dayjs(item.createdAt).format("D MMM YYYY HH:mm")}</TableCell>
                  <TableCell className="text-center">{item.weight || "-"}</TableCell>
                  <TableCell className="text-center">{item.height || "-"}</TableCell>
                  <TableCell>{item.bloodPressure || "-"}</TableCell>
                  <TableCell className="text-center">{item.user.numberOfChildren || "-"}</TableCell>
                  {methodFilter === "injection" ? renderInjectionSpecificColumns(item) : null}
                  {methodFilter === "pill" ? renderPillSpecificColumns(item) : null}
                  {methodFilter === "all" && item.method === "injection" ? renderInjectionSpecificColumns(item) : null}
                  {methodFilter === "all" && item.method === "pill" ? renderPillSpecificColumns(item) : null}
                  <TableCell className="text-center">
                    <Avatar className="mx-auto h-10 w-10">
                      <AvatarImage className="object-cover" src={item.user.avatar.url} />
                      <AvatarFallback className="border-2 border-[#dde4db] bg-[#2f7c6d] font-bold text-white">{item.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
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
