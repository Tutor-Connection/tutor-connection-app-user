import React, { useState } from "react";
import { Application } from "../types";
import { CheckCircle, Medal, MapPin, PersonStanding, FileBadge2, CalendarRange, UserCheck, XCircle } from "lucide-react";

interface ApplicationsScreenProps {
  applications: Application[];
  onAcceptApp: (id: string) => void;
  onRejectApp: (id: string) => void;
}

export const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({
  applications,
  onAcceptApp,
  onRejectApp,
}) => {
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending");
  const [appList, setAppList] = useState<Application[]>(applications);

  const handleAccept = (id: string, name: string) => {
    onAcceptApp(id);
    setAppList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "accepted" as const } : app))
    );
    alert(`Đã duyệt chấp nhận hồ sơ ứng tuyển của bạn cho lớp học em ${name}!`);
  };

  const handleReject = (id: string, name: string) => {
    onRejectApp(id);
    setAppList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" as const, reason: "Phụ huynh hủy hồ sơ từ chối ứng viên" } : app))
    );
    alert(`Đã từ chối ứng tuyển lớp học em ${name}.`);
  };

  const pendingApps = appList.filter((app) => app.status === "pending");
  const acceptedApps = appList.filter((app) => app.status === "accepted");
  const rejectedApps = appList.filter((app) => app.status === "rejected");

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-32 animate-fade-in mx-auto">
      {/* Top App Bar */}
      <header className="w-full sticky top-0 z-50 bg-white shadow-sm flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">school</span>
          <h1 className="text-h2-mobile font-h2-mobile font-black text-primary">TutorSync</h1>
        </div>
        <button className="material-symbols-outlined text-on-surface-variant hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer">
          notifications
        </button>
      </header>

      <main className="px-4 mt-6">
        <h2 className="font-h1-mobile text-h1-mobile mb-4 font-black text-on-surface">Hồ sơ ứng tuyển</h2>

        {/* 3 tabs controller segments */}
        <div className="flex bg-surface-container rounded-xl p-1 mb-6 sticky top-14 z-40 border border-outline-variant/20">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "pending"
                ? "bg-primary text-white shadow-sm"
                : "bg-transparent text-on-surface-variant hover:bg-surface-variant/40"
            }`}
          >
            Đang chờ
          </button>
          
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "accepted"
                ? "bg-primary text-white shadow-sm"
                : "bg-transparent text-on-surface-variant hover:bg-surface-variant/40"
            }`}
          >
            Đã nhận
          </button>

          <button
            onClick={() => setActiveTab("rejected")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "rejected"
                ? "bg-primary text-white shadow-sm"
                : "bg-transparent text-on-surface-variant hover:bg-surface-variant/40"
            }`}
          >
            Đã từ chối
          </button>
        </div>

        {/* Selected View panel content stream */}
        <div className="space-y-4">
          
          {/* Pending list */}
          {activeTab === "pending" && (
            pendingApps.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-outline-variant text-on-surface-variant text-sm font-medium">
                Bạn không có hồ sơ nào đang chờ duyệt.
              </div>
            ) : (
              pendingApps.map((app) => (
                <div key={app.id} className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm relative animate-scale-in">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-h3 text-base text-on-surface font-extrabold">{app.subject}</h3>
                      <p className="text-secondary font-black text-sm mt-0.5">{app.fee}</p>
                    </div>
                    <span className="bg-secondary-fixed text-on-secondary-fixed text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                      CHỜ DUYỆT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 py-3 border-y border-outline-variant/30 text-xs font-semibold text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                      <span>Học viên: <span className="font-bold text-on-surface">{app.studentName}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">grade</span>
                      <span>Lớp: <span className="font-bold text-on-surface">{app.grade}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                      <span className="truncate">{app.location}</span>
                    </div>
                  </div>

                  <div className="mt-3.5 flex flex-col gap-3">
                    <p className="text-[11px] text-outline font-semibold">Ứng tuyển ngày {app.date}</p>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAccept(app.id, app.studentName)}
                        className="flex-1 bg-tertiary text-white px-3 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1 border-none cursor-pointer shadow-sm"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Chấp nhận
                      </button>
                      <button 
                        onClick={() => handleReject(app.id, app.studentName)}
                        className="flex-1 border border-error text-error bg-transparent px-3 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Từ chối
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          )}

          {/* Accepted list */}
          {activeTab === "accepted" && (
            acceptedApps.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-outline-variant text-on-surface-variant text-sm font-medium">
                Nơi hiển thị các hồ sơ ứng tuyển đã thành công.
              </div>
            ) : (
              acceptedApps.map((app) => (
                <div key={app.id} className="bg-white border-l-4 border-l-tertiary border border-outline-variant rounded-xl p-4 shadow-sm animate-scale-in">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-h3 text-base text-on-surface font-extrabold">{app.subject}</h3>
                      <p className="text-secondary font-black text-sm mt-0.5">{app.fee}</p>
                    </div>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3" />
                      ĐỒNG Ý
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 py-3 border-y border-outline-variant/30 text-xs font-semibold text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                      <span>Học viên: <span className="font-bold text-on-surface">{app.studentName}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                      <span>{app.location}</span>
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs text-tertiary italic font-semibold leading-relaxed">
                    TutorSync đã kết nối thành công. Hãy liên kết lớp học ngay với lịch trình của bạn!
                  </p>
                </div>
              ))
            )
          )}

          {/* Rejected list */}
          {activeTab === "rejected" && (
            rejectedApps.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-dashed border-outline-variant text-on-surface-variant text-sm font-medium">
                Nơi lưu trữ các hồ sơ đã từ chối ứng tuyển.
              </div>
            ) : (
              rejectedApps.map((app) => (
                <div key={app.id} className="bg-white border border-outline-variant rounded-xl p-4 shadow-sm grayscale opacity-75 animate-scale-in">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-h3 text-base text-on-surface font-extrabold">{app.subject}</h3>
                      <p className="text-secondary font-black text-sm mt-0.5">{app.fee}</p>
                    </div>
                    <span className="bg-error-container text-on-error-container text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      TỪ CHỐI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 py-3 border-y border-outline-variant/30 text-xs font-semibold text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">person</span>
                      <span>Học viên: <span className="font-bold text-on-surface">{app.studentName}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-outline text-[18px]">location_on</span>
                      <span>{app.location}</span>
                    </div>
                  </div>

                  <p className="mt-3.5 text-xs text-error font-semibold leading-relaxed">
                    Lý do: {app.reason || "Không phù hợp với lịch trình hiện tại của gia sư."}
                  </p>
                </div>
              ))
            )
          )}

        </div>
      </main>
    </div>
  );
};
