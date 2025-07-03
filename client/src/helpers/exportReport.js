import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import formatInjectionType from "@/helpers/formatInjectionType";
import { formatDate } from "@/helpers/formatDate";
import getAge from "@/helpers/getAge";
import dayjs from "dayjs";

export const handleExportExcel = (data) => {
  const worksheetData = data.map((item, index) => ({
    No: index + 1,
    Name: item.user.username,
    Age: getAge(item.user.birthDate),
    "Injection Type": formatInjectionType(item.user.injectionType),
    "Injection Date": dayjs(item.createdAt).format("D MMMM YYYY HH:mm"),
    Weight: item.weight,
    Height: item.height,
    "Blood Pressure": item.bloodPressure,
    Children: item.user.numberOfChildren,
    Address: item.user.address,
    "Phone Number": item.user.phoneNumber,
    NIK: item.user.nik,
    "Birth Date": formatDate(item.user.birthDate),
    Religion: item.user.religion,
    Status: "Completed",
    "Avatar URL": item.user.avatar?.url || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Injection Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const fileName = `Injection_Report_${formattedDate}.xlsx`;

  saveAs(blob, fileName);
};

export const handleExportPDF = (data) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(14);
  doc.text("Injection Report Kabee", 14, 15);

  const tableData = data.map((item, index) => [
    index + 1,
    item.user.username,
    getAge(item.user.birthDate),
    formatInjectionType(item.user.injectionType),
    dayjs(item.createdAt).format("D MMMM YYYY HH:mm"),
    item.weight,
    item.height,
    item.bloodPressure,
    item.user.numberOfChildren,
    item.user.address,
    item.user.phoneNumber,
    item.user.nik,
    formatDate(item.user.birthDate),
    item.user.religion,
    "Completed",
    item.user.avatar?.url || "",
  ]);

  autoTable(doc, {
    head: [["No", "Name", "Age", "Injection Type", "Injection Date", "Weight", "Height", "Blood Pressure", "Children", "Address", "Phone Number", "NIK", "Birth Date", "Religion", "Status", "Avatar URL"]],
    body: tableData,
    startY: 20,
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
    },
    columnStyles: {
      9: { cellWidth: 30 }, // Address
      14: { cellWidth: 18 }, // Status
      15: { cellWidth: 40 }, // Avatar URL (dibatasi)
    },
    margin: { left: 8, right: 8, top: 20 },
    theme: "striped",
  });

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10);
  const fileName = `Injection_Report_${formattedDate}.pdf`;

  doc.save(fileName);
};
