import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import formatInjectionType from "@/helpers/formatInjectionType";
import { formatDate } from "@/helpers/formatDate";

export const handleExportExcel = (data) => {
  const worksheetData = data.map((item, index) => ({
    No: index + 1,
    Username: item.user.username,
    "Injection Type": formatInjectionType(item.user.injectionType),
    "Injection Date": formatDate(item.injectionDate),
    Status: "Completed",
    "Avatar URL": item.user.avatar?.url || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Injection Report");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10); // → "2025-06-13"
  const fileName = `Injection_Report_${formattedDate}.xlsx`;

  saveAs(blob, fileName);
};

export const handleExportPDF = (data) => {
  // Buat dokumen PDF dengan orientasi landscape dan ukuran A4
  const doc = new jsPDF({
    orientation: "landscape", // <-- ubah orientasi di sini
    unit: "mm",
    format: "a4",
  });

  doc.setFontSize(14);
  doc.text("Injection Report Kabee", 14, 15);

  const tableData = data.map((item, index) => [index + 1, item.user.username, formatInjectionType(item.user.injectionType), formatDate(item.injectionDate), "Completed", item.user.avatar?.url || ""]);

  autoTable(doc, {
    head: [["No", "Username", "Injection Type", "Injection Date", "Status", "Avatar URL"]],
    body: tableData,
    startY: 20,
    styles: {
      fontSize: 10, // bisa dikurangi kalau masih wrap
      cellWidth: "wrap", // wrap jika terlalu panjang
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
    },
    theme: "striped",
    margin: { top: 20 },
  });

  const now = new Date();
  const formattedDate = now.toISOString().slice(0, 10); // → "2025-06-13"
  const fileName = `Injection_Report_${formattedDate}.pdf`;

  doc.save(fileName);
};
