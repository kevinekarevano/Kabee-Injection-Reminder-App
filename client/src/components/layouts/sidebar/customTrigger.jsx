import { useSidebar } from "@/components/ui/sidebar";
import { PanelRightClose } from "lucide-react";

export default function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <button className="cursor-pointer m-2 bg-teal-900 rounded-sm border-2 border-zinc-700  " onClick={toggleSidebar}>
      <PanelRightClose size={30} className="text-zinc-200 p-1" />
    </button>
  );
}
