import React from "react";
import { ScreenState } from "../types";
import { Layers } from "lucide-react";

interface DemoOverlayProps {
  currentScreen: ScreenState;
  onScreenChange: (screen: ScreenState) => void;
  userRole: "tutor" | "student" | null;
  onRoleToggle: () => void;
}

export const DemoOverlay: React.FC<DemoOverlayProps> = ({
  currentScreen,
  onScreenChange,
  userRole,
  onRoleToggle,
}) => {
  const screens: { value: ScreenState; label: string }[] = [
    { value: "register", label: "1. Đăng ký tài khoản (Register)" },
    { value: "login", label: "2. Đăng nhập (Login)" },
    { value: "role", label: "3. Chọn vai trò (Role Select)" },
    { value: "dashboard", label: "4. Dashboard (Tutor Home)" },
    { value: "makeup", label: "5. Lịch dạy bù (Makeup Lessons)" },
    { value: "calendar", label: "6. Lịch biểu (Calendar Timeline)" },
    { value: "explore", label: "7. Tìm lớp học (Explore Board)" },
    { value: "applications", label: "8. Hồ sơ ứng tuyển (Applications)" },
    { value: "class-detail", label: "9. Chi tiết lớp (Class Details)" },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-[999] glass-card p-3 rounded-xl border border-primary/20 shadow-xl max-w-xs text-xs font-sans text-on-surface">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-outline-variant/30">
        <Layers className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-bold text-[11px] text-primary uppercase tracking-wider">
          Demo Control Deck
        </span>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] text-on-surface-variant font-semibold mb-1">
            Chuyển nhanh màn hình:
          </label>
          <select
            value={currentScreen}
            onChange={(e) => onScreenChange(e.target.value as ScreenState)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-2 py-1 focus:ring-1 focus:ring-primary outline-none"
          >
            {screens.map((scr) => (
              <option key={scr.value} value={scr.value}>
                {scr.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-on-surface-variant font-semibold">
            Vai trò hiện tại:
          </span>
          <button
            onClick={onRoleToggle}
            className="px-2 py-0.5 rounded-full bg-primary-container text-white text-[9px] font-bold uppercase tracking-wider"
          >
            {userRole === "tutor" ? "Gia sư" : userRole === "student" ? "Học viên" : "Chưa chọn"}
          </button>
        </div>
      </div>
    </div>
  );
};
