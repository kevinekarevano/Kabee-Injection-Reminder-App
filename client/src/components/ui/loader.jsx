const Loader = ({ className }) => {
  return (
    <div className={`${className} flex-col gap-4 w-full flex items-center justify-center`}>
      <div className="w-6 h-6 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-zinc-200 rounded-full">
        <div className="w-7 h-7 border-4 border-transparent text-zinc-800 text-2xl animate-spin flex items-center justify-center border-t-[#93B1B5] rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
