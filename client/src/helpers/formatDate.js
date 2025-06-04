export const formatDate = (isoDate) => {
  if (!isoDate) return ""; // Jika tanggal tidak ada, kembalikan string kosong
  const date = new Date(isoDate); // Konversi string ISO menjadi objek Date
  const options = { year: "numeric", month: "long", day: "numeric" }; // Format: May 1, 2025
  return date.toLocaleDateString("en-US", options); // Formatkan tanggal
};

export const formatDateTime = (isoDate) => {
  if (!isoDate) return ""; // Jika tanggal tidak ada, kembalikan string kosong

  const date = new Date(isoDate); // Konversi string ISO menjadi objek Date

  // Format tanggal
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format waktu
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Format 12 jam (AM/PM)
  });

  return `${formattedDate}, ${formattedTime}`; // Gabungkan tanggal dan waktu
};
