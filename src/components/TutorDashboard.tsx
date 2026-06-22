import React, { useState, useEffect } from "react";
import { ClassSchedule, User } from "../types";
import { 
  Bell, 
  TrendingUp, 
  BookOpen, 
  Video, 
  MapPin, 
  Sparkles, 
  Clock, 
  Plus, 
  Check, 
  X, 
  Calendar as CalendarIcon, 
  Info, 
  CornerDownRight,
  TrendingDown
} from "lucide-react";

interface TutorDashboardProps {
  user: User;
  schedules: ClassSchedule[];
  onCompleteSchedule: (id: string) => void;
  onOpenCreateSchedule: () => void;
  onNavigateToScreen: (screen: any) => void;
}

export const TutorDashboard: React.FC<TutorDashboardProps> = ({
  user,
  schedules,
  onCompleteSchedule,
  onOpenCreateSchedule,
  onNavigateToScreen,
}) => {
  const [totalIncome, setTotalIncome] = useState(15200000);
  const [suggestion, setSuggestion] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [notifCount, setNotifCount] = useState(2);
  const [scheduleList, setScheduleList] = useState<ClassSchedule[]>([]);

  // Monitor schedules
  useEffect(() => {
    setScheduleList(schedules);
  }, [schedules]);

  // Handle schedule trigger
  const handleVerifyStart = (id: string, name: string) => {
    onCompleteSchedule(id);
    setTotalIncome((prev) => prev + 350000); // add one session fee
    alert(`Đã xác nhận hoàn thành buổi dạy với học viên ${name}! Học phí 350k đã được cộng vào Tổng thu nhập tháng.`);
  };

  // Fetch AI suggestion
  const handleFetchAiSuggestions = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch("/api/tutorsync-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "tutor",
          currentClasses: scheduleList.map((s) => `${s.subject} (${s.studentName})`),
          targetSubject: "Toán ôn thi đại học & Tiếng Anh giao tiếp",
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuggestion(data.text);
      } else {
        setSuggestion("Không thể tải gợi ý AI lúc này. Vui lòng kiểm tra lại sau.");
      }
    } catch (e) {
      setSuggestion("Không thể kết nối đến máy chủ AI. Đang bật chế độ Demo Offline.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Initialize with some advice
  useEffect(() => {
    setSuggestion(
      `**Chuyên gia TutorPro gợi ý cho Nguyễn Văn A:**\n\n* ✨ **Khung giờ hiệu quả:** Lịch dạy lúc **19h-21h của Thứ 3, 5, 7** đang có tỉ điểm chuyên cần cao nhất (lên đến 98%).\n* 📈 **Môn học nhu cầu đột biến:** Tuyển sinh Toán lớp 9 ôn thi vào lớp 10 và Ôn thi chứng chỉ IELTS 6.5+ đang tăng trưởng 40% trong khu vực Quận 7.\n* 💵 **Đề xuất nâng mức học phí:** Dựa vào đánh giá xuất sắc từ phụ huynh em Lê Minh Tuấn, mức phí đề xuất nâng thành **250k - 350k/buổi** cho lớp đăng mới.`
    );
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-32 animate-fade-in mx-auto relative">
      {/* Top AppBar */}
      <header className="fixed top-0 max-w-md w-full z-50 bg-white/95 backdrop-blur-md shadow-sm flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container active:scale-95 transition-transform duration-200">
            <img
              className="w-full h-full object-cover"
              alt="Nguyễn Văn A"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmldSt2SG27L3ysfDcasu7m6NMMvAJUdQpjlOFxtiRG5cUo33z1le0Ai_DBhNupDhB8xvSVqodAJW_TN98oENH6c1j02gJKlPoMSeUOl7B4k59JZDGaGx2eP9M60wq30Ku7OcFe13vG1Ne8BNaEdPfnnZKaSKbFFHAtUnRhs3KVLONkfx-t6-aokXeenLnKImVa7qE7kCvLqx8R969pkqbvnLPQPKqQIa0jHeMGd5q00iKxj7gQdZ9GZb1OJWxQTd1LHF6avTvOxbq"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Xin chào,</span>
            <span className="text-sm font-black text-primary">Nguyễn Văn A</span>
          </div>
        </div>
        <button 
          onClick={() => {
            setNotifCount(0);
            alert("Thông báo mới: Lịch bù lớp Lý 10 với học sinh Lê Hải Yến đã được kích hoạt thành công!");
          }}
          className="relative p-2 rounded-full hover:bg-surface-container-high active:scale-95 transition-all bg-transparent border-none cursor-pointer"
        >
          <Bell className="w-5 h-5 text-on-surface-variant" />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary-container rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </header>

      <main className="pt-20 px-4 space-y-6">
        
        {/* KPI Horizontal Scroll */}
        <section className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="flex gap-4 w-max pb-1">
            {/* Students */}
            <div className="w-36 p-4 rounded-2xl bg-white shadow-sm border border-outline-variant/30 flex flex-col gap-1 hover:border-primary/45 transition-colors">
              <span className="text-2xl">📚</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Học sinh</span>
              <span className="font-h3 text-h3 font-black text-primary">12 em</span>
            </div>
            {/* Classes */}
            <div className="w-36 p-4 rounded-2xl bg-white shadow-sm border border-outline-variant/30 flex flex-col gap-1 hover:border-primary/45 transition-colors">
              <span className="text-2xl">📖</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Lớp học</span>
              <span className="font-h3 text-h3 font-black text-primary">8 lớp</span>
            </div>
            {/* Monthly Income */}
            <div className="w-44 p-4 rounded-2xl bg-primary-container text-white shadow-md flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-15 text-5xl">💵</div>
              <span className="text-[10px] uppercase font-bold opacity-80">Thu nhập (Tháng)</span>
              <span className="font-h3 text-lg font-black">{totalIncome.toLocaleString()}đ</span>
            </div>
            {/* Uncollected Fees */}
            <div className="w-40 p-4 rounded-2xl bg-white shadow-sm border border-outline-variant/30 flex flex-col gap-1 hover:border-primary/45 transition-colors">
              <span className="text-2xl">⏳</span>
              <span className="text-[10px] uppercase font-bold text-on-surface-variant">Học phí chưa thu</span>
              <span className="font-h3 text-h3 font-black text-secondary">2.400.000đ</span>
            </div>
          </div>
        </section>

        {/* Today's Schedule */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-h2-mobile text-h2-mobile font-black text-on-surface">Lịch dạy hôm nay</h2>
            <button 
              onClick={() => onNavigateToScreen("calendar")}
              className="text-primary font-bold text-xs hover:underline bg-transparent border-none cursor-pointer"
            >
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {scheduleList.filter(s => s.status === "upcoming").length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-outline-variant/30 border-dashed text-on-surface-variant text-sm font-medium">
                Bạn đã hoàn thành xong các ca dạy hôm nay! 🎉
              </div>
            ) : (
              scheduleList
                .filter((s) => s.status === "upcoming" || s.status === "ongoing")
                .map((item) => (
                  <div key={item.id} className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-3 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-primary font-bold text-sm">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{item.start} - {item.end}</span>
                        </div>
                        <h3 className="font-h3 text-base font-extrabold text-on-surface">{item.studentName}</h3>
                        <p className="text-xs text-on-surface-variant font-medium">{item.subject}</p>
                      </div>
                      
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.format === "ONLINE" 
                          ? "bg-secondary-container/10 text-secondary-container" 
                          : "bg-tertiary-container/10 text-tertiary"
                      }`}>
                        {item.format}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-on-surface-variant text-xs font-semibold">
                      {item.format === "ONLINE" ? (
                        <Video className="w-4 h-4 text-outline" />
                      ) : (
                        <MapPin className="w-4 h-4 text-outline" />
                      )}
                      <span>{item.location}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerifyStart(item.id, item.studentName)}
                        className="w-full py-2.5 bg-primary-container hover:bg-primary text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer shadow-sm"
                      >
                        Xác nhận hoàn thành
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </section>

        {/* Income Chart Section */}
        <section className="space-y-4">
          <h2 className="font-h2-mobile text-h2-mobile font-black text-on-surface">Phân tích thu nhập</h2>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="flex items-end justify-between h-32 gap-3 px-2">
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary-fixed" 
                  style={{ height: "45%" }}
                  title="Tháng 10: 10.4M"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-bold">T10</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary-fixed" 
                  style={{ height: "55%" }}
                  title="Tháng 11: 12.0M"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-bold">T11</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary-fixed" 
                  style={{ height: "70%" }}
                  title="Tháng 12: 13.5M"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-bold">T12</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary-fixed" 
                  style={{ height: "65%" }}
                  title="Tháng 1: 11.2M"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-bold">T1</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-surface-container-highest rounded-t-lg transition-all duration-300 group-hover:bg-primary-fixed" 
                  style={{ height: "85%" }}
                  title="Tháng 2: 14.8M"
                ></div>
                <span className="text-[10px] text-on-surface-variant font-bold">T2</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-primary-container rounded-t-lg animate-pulse" 
                  style={{ height: "95%" }}
                  title={`Tháng 3: ${totalIncome / 1000000}M`}
                ></div>
                <span className="text-[10px] text-primary font-black">T3</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">Tổng thu tháng này</p>
                <p className="text-base font-extrabold text-on-surface">{totalIncome.toLocaleString()}đ</p>
              </div>
              <span className="text-tertiary font-bold text-xs flex items-center gap-0.5 bg-tertiary-container/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 text-tertiary" />
                +12.4%
              </span>
            </div>
          </div>
        </section>

        {/* AI Suggestions Card */}
        <section className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-primary-container to-[#6366f1] text-white shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-h3 text-body-lg font-bold">AI TutorPro Tư vấn</span>
              </div>

              <button
                onClick={handleFetchAiSuggestions}
                disabled={loadingAi}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-1.5 transition-all text-xs font-bold border-none cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {loadingAi ? "Đang phân tích..." : "Tải gợi ý mới"}
              </button>
            </div>

            <div className="space-y-3 text-xs opacity-95 leading-relaxed bg-white/10 rounded-xl p-3 max-h-56 overflow-y-auto custom-scrollbar font-medium">
              <div className="markdown-body prose prose-invert">
                {suggestion.split("\n").map((line, idx) => {
                  if (line.startsWith("* ")) {
                    return <p key={idx} className="my-1 pl-2 border-l-2 border-white/30">{line.replace("* ", "")}</p>;
                  }
                  return <p key={idx} className="my-1">{line}</p>;
                })}
              </div>
            </div>

            <button 
              onClick={() => {
                alert("AI đề xuất: Tiếp tục mở rộng các môn tự nhiên khối lớp 9 và 12, đây là nhóm lớp đem lại biên lợi nhuận gia sư gia sư cao nhất!");
              }}
              className="w-full py-3 bg-white text-primary-container rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all hover:bg-surface cursor-pointer border-none"
            >
              Xem chi tiết chiến lược
            </button>
          </div>
        </section>
      </main>

      {/* FAB representing schedule creation */}
      <button
        onClick={onOpenCreateSchedule}
        className="fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-90 transition-transform duration-150 z-40 cursor-pointer border-none"
      >
        <Plus className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
