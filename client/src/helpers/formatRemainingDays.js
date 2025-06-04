const formatRemainingDays = (nextInjectionDate) => {
  if (!nextInjectionDate) return ""; // Jika tanggal tidak ada, kembalikan string kosong

  const today = new Date(); // Tanggal hari ini
  const nextDate = new Date(nextInjectionDate); // Konversi string ISO menjadi objek Date

  // Hitung selisih waktu dalam milidetik
  const differenceInTime = nextDate - today;

  // Konversi milidetik ke hari
  const remainingDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  // Jika tanggal sudah lewat, kembalikan 0
  return remainingDays > 0 ? remainingDays : 0;
};

export default formatRemainingDays;
