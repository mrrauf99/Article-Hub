import { FileText } from "lucide-react";

export default function NavLogo() {
  return (
    <div className="flex items-center gap-2">
      <FileText className="w-7 h-7 text-sky-400" />
      <span className="text-[1.35rem] font-bold bg-gradient-to-r from-gray-200 to-sky-300 bg-clip-text text-transparent">
        Article Hub
      </span>
    </div>
  );
}
