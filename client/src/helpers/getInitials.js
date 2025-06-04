const getInitials = (name) => {
  if (!name) return ""; // Jika nama tidak tersedia, kembalikan string kosong
  const nameParts = name.split(" "); // Pisahkan nama berdasarkan spasi
  const initials = nameParts.map((part) => part[0]?.toUpperCase()); // Ambil huruf pertama dari setiap bagian nama
  return initials.slice(0, 2).join(""); // Gabungkan maksimal 2 huruf
};

export default getInitials;
