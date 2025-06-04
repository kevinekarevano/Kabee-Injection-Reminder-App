const parseISOToDate = (isoDate) => {
  if (!isoDate) return null; // Jika tanggal tidak ada, kembalikan null
  return new Date(isoDate); // Konversi string ISO ke objek Date
};

export default parseISOToDate;
