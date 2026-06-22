import React, { useState } from "react";
import { ClassSchedule } from "../types";
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Eye, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XOctagon, 
  MapPin, 
  Video 
} from "lucide-react";

interface CalendarScreenProps {
  schedules: ClassSchedule[];
  onNavigateBack: () => void;
  onOpenCreateSchedule: () => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({
  schedules,
  onNavigateBack,
  onOpenCreateSchedule,
}) => {
  const [activeTab, setActiveTab] = useState<"month" | "week" | "day">("week");
  const [selectedDay, setSelectedDay] = useState(15); // Tuesday 15

  const days = [
    { label: "T2", num: 14 },
    { label: "T3", num: 15, active: true },
    { label: "T4", num: 16 },
    { label: "T5", num: 17 },
    { label: "T6", num: 18 },
    { label: "T7", num: 19 },
    { label: "CN", num: 20 },
  ];

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-32 animate-fade-in mx-auto">
      {/* Top App Bar */}
      <header className="fixed top-0 max-w-md w-full z-50 bg-white/95 backdrop-blur-md shadow-sm px-4 py-3 flex justify-between items-center h-16 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateBack}
            className="p-1 rounded-full hover:bg-surface-container-high transition-colors text-primary bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-h3 text-h3 font-black text-primary">Lịch dạy</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert("Chức năng tìm kiếm và lọc lịch đang được phát triển!")}
            className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>
          
          <button 
            onClick={onOpenCreateSchedule}
            className="p-1 rounded-full hover:bg-surface-container-high text-primary bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <Plus className="w-5 h-5 font-black" />
          </button>

          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img 
              className="w-full h-full object-cover" 
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmldSt2SG27L3ysfDcasu7m6NMMvAJUdQpjlOFxtiRG5cUo33z1le0Ai_DBhNupDhB8xvSVqodAJW_TN98oENH6c1j02gJKlPoMSeUOl7B4k59JZDGaGx2eP9M60wq30Ku7OcFe13vG1Ne8BNaEdPfnnZKaSKbFFHAtUnRhs3KVLONkfx-t6-aokXeenLnKImVa7qE7kCvLqx8R969pkqbvnLPQPKqQIa0jHeMGd5q00iKxj7gQdZ9GZb1OJWxQTd1LHF6avTvOxbq"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="pt-20 px-4 space-y-4">
        
        {/* Toggle Segment Controllers */}
        <div className="flex p-0.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <button 
            onClick={() => setActiveTab("month")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "month" ? "bg-white text-primary shadow-sm" : "bg-transparent text-on-surface-variant"
            }`}
          >
            Tháng
          </button>
          <button 
            onClick={() => setActiveTab("week")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "week" ? "bg-primary text-white shadow-sm" : "bg-transparent text-on-surface-variant"
            }`}
          >
            Tuần
          </button>
          <button 
            onClick={() => setActiveTab("day")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all border-none cursor-pointer ${
              activeTab === "day" ? "bg-white text-primary shadow-sm" : "bg-transparent text-on-surface-variant"
            }`}
          >
            Ngày
          </button>
        </div>

        {/* Weekly Slider Bar */}
        <div className="overflow-x-auto no-scrollbar flex gap-2.5 py-1">
          {days.map((day) => (
            <button
              key={day.num}
              onClick={() => setSelectedDay(day.num)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-12 py-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedDay === day.num
                  ? "bg-primary text-white shadow-md border-primary ring-2 ring-primary-fixed"
                  : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">{day.label}</span>
              <span className="text-sm font-black mt-0.5">{day.num}</span>
            </button>
          ))}
        </div>

        {/* Schedule grid with bubble overlays */}
        <div className="relative bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="h-[28rem] relative p-4 flex">
            {/* Timeline hour guides */}
            <div className="w-12 h-full flex flex-col justify-between text-[11px] font-bold text-outline py-2 shrink-0">
              <span>07:00</span>
              <span>10:00</span>
              <span>13:00</span>
              <span>16:00</span>
              <span>19:00</span>
              <span>22:00</span>
            </div>

            {/* Timetable lines & slots */}
            <div className="flex-1 h-full flex flex-col justify-between py-2 pl-2 relative">
              <div className="h-px bg-outline-variant/40 w-full"></div>
              <div className="h-px bg-outline-variant/40 w-full"></div>
              <div className="h-px bg-outline-variant/40 w-full"></div>
              <div className="h-px bg-outline-variant/40 w-full"></div>
              <div className="h-px bg-outline-variant/40 w-full"></div>
              <div className="h-px bg-outline-variant/40 w-full"></div>

              {/* Float Bubbles Overlay */}
              <div className="absolute inset-0 pl-2 pointer-events-none pr-2">
                {/* 08:00 - 10:00 (Blue, Upcoming) */}
                <div 
                  className="absolute left-1 right-1 bg-primary-container text-white rounded-xl p-3 border-l-4 border-[#93c5fd] shadow-md pointer-events-auto flex flex-col justify-between animate-scale-in"
                  style={{ top: "8%", height: "64px" }}
                  onClick={() => alert("Lớp học sắp diễn ra: Toán 12 - Lê Minh Tuấn")}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-black leading-tight truncate">Lê Minh Tuấn • Toán 12</p>
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  </div>
                  <p className="text-[10px] font-bold opacity-90">08:00 - 10:00</p>
                </div>

                {/* 14:00 - 16:00 (Peach, Finished) */}
                <div 
                  className="absolute left-1 right-1 bg-secondary-fixed text-on-secondary-fixed-variant rounded-xl p-3 border-l-4 border-secondary shadow-sm pointer-events-auto flex flex-col justify-between opacity-85"
                  style={{ top: "45%", height: "64px" }}
                  onClick={() => alert("Lớp học đã học xong: IELTS - Hoàng Anh Thư")}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[11px] font-black leading-tight text-on-secondary-fixed-variant truncate">Hoàng Anh Thư • IELTS</p>
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-secondary" />
                  </div>
                  <p className="text-[10px] text-on-secondary-fixed-variant/90 font-bold">14:00 - 16:00</p>
                </div>

                {/* 18:00 - 19:30 (Red, Cancelled) */}
                <div 
                  className="absolute left-1 right-1 bg-error-container text-on-error-container rounded-xl p-3 border-l-4 border-error shadow-sm pointer-events-auto flex justify-between items-center"
                  style={{ top: "76%", height: "54px" }}
                  onClick={() => alert("Lớp học này phụ huynh báo bận nghỉ có phép: Lý 10 - Nguyễn An")}
                >
                  <div>
                    <p className="text-[11px] font-black leading-tight text-on-error-container truncate">Nguyễn An • Lý 10</p>
                    <p className="text-[10px] text-on-error-container/80 font-bold">18:00 - 19:30</p>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-white/60 px-2 py-0.5 rounded-full text-error border border-error/25">
                    Hủy
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Daily agenda list below */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-h3 font-black text-on-surface">Chi tiết hôm nay</h2>
            <span className="text-caption font-black text-primary uppercase text-xs">15 Tháng 10</span>
          </div>

          {/* Agenda Item 1 */}
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center pr-3 border-r border-outline-variant/30 shrink-0">
                <span className="text-xs font-black text-primary">08:00</span>
                <span className="text-[10px] text-outline font-semibold">120p</span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-on-surface">Lê Minh Tuấn</p>
                <p className="text-xs text-on-surface-variant font-medium">Toán lớp 12</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-primary font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Quận 7, TP.HCM</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => alert("Thông tin bài học: Ôn tập hàm số lũy thừa, mũ và logarit.")}
              className="bg-primary hover:bg-primary-container text-white px-3 py-1.5 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm border-none cursor-pointer"
            >
              Chi tiết
            </button>
          </div>

          {/* Agenda Item 2 */}
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between opacity-70">
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center pr-3 border-r border-outline-variant/30 shrink-0">
                <span className="text-xs font-bold text-outline">14:00</span>
                <span className="text-[10px] text-outline font-semibold">120p</span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-on-surface">Hoàng Anh Thư</p>
                <p className="text-xs text-on-surface-variant font-medium">Luyện thi IELTS</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-secondary font-bold">
                  <Video className="w-3.5 h-3.5" />
                  <span>Online (Zoom)</span>
                </div>
              </div>
            </div>
            
            <button 
              disabled 
              className="border border-outline-variant/60 text-on-surface-variant/60 bg-transparent px-3 py-1.5 rounded-xl text-xs font-bold"
            >
              Đã dạy
            </button>
          </div>

          {/* Agenda Item 3 */}
          <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between">
            <div className="flex gap-3">
              <div className="flex flex-col items-center justify-center pr-3 border-r border-outline-variant/30 shrink-0">
                <span className="text-xs font-black text-error">18:00</span>
                <span className="text-[10px] text-outline font-semibold">90p</span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-on-surface">Nguyễn An</p>
                <p className="text-xs text-on-surface-variant font-medium">Vật lý lớp 10</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-primary font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Quận 1, TP.HCM</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] text-error font-black uppercase text-xs">Đã Huỷ</span>
              <button 
                onClick={() => alert("Lý do nghỉ: Học sinh tham gia hoạt động cắm trại kỉ niệm trường học.")}
                className="text-primary font-extrabold text-[11px] underline bg-transparent border-none cursor-pointer"
              >
                Xem lý do
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};
