import React, { useState } from "react";
import { UserRole } from "../types";
import { GraduationCap, Search, CheckCircle, ArrowRight, Loader } from "lucide-react";

interface RoleSelectScreenProps {
  onRoleConfirmed: (role: UserRole) => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onRoleConfirmed,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    if (!selectedRole) return;
    setShowModal(true);

    // Simulate progress delay
    setTimeout(() => {
      onRoleConfirmed(selectedRole);
      setShowModal(false);
    }, 2200);
  };

  return (
    <div className="bg-background text-on-surface font-body-reg min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-in pb-16">
      
      {/* Top AppBar (Identity Anchor) */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-4 bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">
            school
          </span>
          <span className="font-h2-mobile text-h2-mobile font-black text-primary">TutorSync</span>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <button className="text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm bg-transparent border-none cursor-pointer">Hỗ trợ</button>
          <span className="text-outline-variant/65">|</span>
          <button className="text-on-surface-variant font-semibold hover:text-primary transition-colors text-sm bg-transparent border-none cursor-pointer">Tiếng Việt</button>
        </div>
      </header>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-container opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-secondary-container opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-full h-1/2 bg-gradient-to-t from-surface-container-low to-transparent"></div>
      </div>

      {/* Main Content Canvas */}
      <main className="w-full max-w-4xl flex flex-col items-center p-4">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-h1-mobile text-h1-mobile md:text-h1-desktop text-on-surface mb-2 font-black tracking-tight">
            Bạn là ai?
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto font-medium">
            Hãy chọn vai trò của bạn để bắt đầu trải nghiệm tốt nhất.
          </p>
        </div>

        {/* Role Selection Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-2">
          {/* Tutor Card */}
          <div
            onClick={() => setSelectedRole("tutor")}
            className={`relative cursor-pointer transition-all duration-300 bg-white p-6 rounded-2xl border-2 flex flex-col items-center text-center hover:shadow-xl ${
              selectedRole === "tutor"
                ? "border-primary bg-surface-container-low -translate-y-1 shadow-md scale-102"
                : "border-outline-variant hover:border-primary/50"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                selectedRole === "tutor"
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <GraduationCap className="w-8 h-8" />
            </div>
            
            <h3 className="font-h3 text-h3 text-on-surface mb-2 font-extrabold">Gia sư</h3>
            <p className="font-body-reg text-on-surface-variant text-sm font-medium px-4leading-relaxed">
              Quản lý học sinh, lịch dạy, học phí một cách chuyên nghiệp.
            </p>

            {/* Feature Tags */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Lịch dạy
              </span>
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Hồ sơ
              </span>
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Học phí
              </span>
            </div>

            {/* Checkmark overlay */}
            {selectedRole === "tutor" && (
              <div className="absolute top-4 right-4 text-primary animate-scale-in">
                <CheckCircle className="w-6 h-6 fill-primary text-white" />
              </div>
            )}
          </div>

          {/* Student Card */}
          <div
            onClick={() => setSelectedRole("student")}
            className={`relative cursor-pointer transition-all duration-300 bg-white p-6 rounded-2xl border-2 flex flex-col items-center text-center peer-checked:role-card-selected hover:shadow-lg peer-checked:shadow-xl peer-checked:scale-105 ${
              selectedRole === "student"
                ? "border-primary bg-surface-container-low -translate-y-1 shadow-md scale-102"
                : "border-outline-variant hover:border-primary/50"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                selectedRole === "student"
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface"
              }`}
            >
              <Search className="w-8 h-8" />
            </div>

            <h3 className="font-h3 text-h3 text-on-surface mb-2 font-extrabold">Học viên</h3>
            <p className="font-body-reg text-on-surface-variant text-sm font-medium px-4 leading-relaxed">
              Tìm gia sư, đăng bài, theo dõi lịch học dễ dàng.
            </p>

            {/* Feature Tags */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Tìm kiếm
              </span>
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Gói học
              </span>
              <span className="bg-surface-container-high text-on-surface font-caption text-[11px] px-3 py-1 rounded-full font-bold">
                Tiến độ
              </span>
            </div>

            {/* Checkmark overlay */}
            {selectedRole === "student" && (
              <div className="absolute top-4 right-4 text-primary animate-scale-in">
                <CheckCircle className="w-6 h-6 fill-primary text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Confirm Action Section */}
        <div className="mt-12 w-full max-w-sm px-4 flex flex-col items-center">
          <button
            onClick={handleConfirm}
            disabled={!selectedRole}
            className={`w-full py-4 px-6 rounded-xl font-bold text-body-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 duration-200 ${
              selectedRole
                ? "bg-primary text-white hover:bg-primary-container cursor-pointer transform"
                : "bg-primary/50 text-white/80 cursor-not-allowed opacity-50"
            }`}
          >
            Xác nhận
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 font-body-sm text-on-surface-variant text-xs font-semibold text-center leading-relaxed">
            Bạn có thể thay đổi vai trò sau trong phần cài đặt.
          </p>
        </div>
      </main>

      {/* Progress Line */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-surface-container-highest overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: selectedRole ? "100%" : "0%" }}
        ></div>
      </div>

      {/* Success Modal Simulation */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-on-background/40 backdrop-blur-sm animate-fade-in"></div>
          
          <div className="bg-white w-full max-w-md p-8 rounded-t-2xl md:rounded-2xl shadow-2xl relative animate-scale-in glass-panel z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center mb-6 shadow-md animate-pulse">
                <span className="material-symbols-outlined text-[36px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
              <h2 class="font-h2-mobile text-h2-mobile text-on-surface mb-2 font-black">
                Chào mừng bạn!
              </h2>
              <p className="font-body-reg text-on-surface-variant mb-6 font-medium text-sm leading-relaxed px-4">
                Hệ thống đang chuẩn bị giao diện phù hợp cho vai trò{" "}
                <span className="font-extrabold text-primary">
                  {selectedRole === "tutor" ? "Gia sư" : "Học viên"}
                </span>{" "}
                của bạn.
              </p>
              
              {/* Progress loader */}
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-progress-flow"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
