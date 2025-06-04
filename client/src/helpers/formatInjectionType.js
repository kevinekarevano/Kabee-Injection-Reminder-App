const formatInjectionType = (type) => {
  if (!type) return ""; // Jika type tidak ada, kembalikan string kosong
  return type
    .split("_") // Pisahkan string berdasarkan underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Kapitalisasi huruf pertama setiap kata
    .join(" "); // Gabungkan kembali dengan spasi
};

export default formatInjectionType;
