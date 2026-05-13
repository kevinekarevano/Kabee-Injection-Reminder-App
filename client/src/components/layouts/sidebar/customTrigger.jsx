import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightClose } from "lucide-react";

export default function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      className="m-3 inline-flex cursor-pointer items-center justify-center rounded-full border border-[#dde4db] bg-white p-2 text-[#2f7c6d] shadow-[0_10px_25px_rgba(34,53,48,0.06)] transition hover:-translate-y-0.5 hover:bg-[#edf4ef]"
      onClick={toggleSidebar}
    >
      <PanelRightClose size={24} className="p-0.5" />
    </button>
  );
}
