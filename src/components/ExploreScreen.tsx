import React, { useState } from "react";
import { JobListing } from "../types";
import { Search, MapPin, Calendar, Info, Users, School, Sparkles, Globe } from "lucide-react";

interface ExploreScreenProps {
  listings: JobListing[];
  onApplyJob: (id: string) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  listings,
  onApplyJob,
}) => {
  const [jobList, setJobList] = useState<JobListing[]>(listings);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveTabFilters] = useState<string[]>(["subject"]);

  const handleApply = (id: string, title: string) => {
    // Show validation popup
    const confirmApp = window.confirm(`Bạn muốn ứng tuyển vào lớp "${title}"?\n\n(Lưu ý: Bạn phải đảm bảo hồ sơ đã được xác thực KYC đầy đủ)`);
    if (confirmApp) {
      onApplyJob(id);
      setJobList((prev) => 
        prev.map((job) => 
          job.id === id 
            ? { ...job, tutorsCount: job.tutorsCount + 1, isApplied: true } 
            : job
        )
      );
      alert("Ứng tuyển thành công! Hồ sơ của bạn đã được gửi cho phụ huynh học viên xem xét.");
    }
  };

  const toggleFilter = (key: string) => {
    setActiveTabFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Filter listings based on search
  const filteredList = jobList.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.requirements.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-32 animate-fade-in mx-auto">
      {/* Top AppBar */}
      <header className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm flex justify-between items-center px-4 py-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl font-bold">school</span>
          <h1 className="text-h2-mobile font-h2-mobile font-black text-primary">TutorSync</h1>
        </div>
        <button 
          onClick={() => alert("Thông báo: Có 3 lớp mới môn tiếng Anh và Vật lý phù hợp với hồ sơ của bạn!")}
          className="relative p-2 rounded-full hover:bg-surface-container-high transition-all text-on-surface-variant bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-on-surface-variant font-bold">notifications</span>
        </button>
      </header>

      {/* KYC Warning Banner */}
      <div className="bg-error-container text-on-error-container px-4 py-3 flex items-start gap-2.5 animate-pulse-subtle border-b border-error/15">
        <span className="material-symbols-outlined text-error shrink-0 text-xl font-bold">warning</span>
        <div className="flex flex-col">
          <p className="text-xs font-semibold leading-relaxed">
            Vui lòng hoàn thành xác thực danh tính KYC để bắt đầu ứng tuyển lớp học.
          </p>
          <button 
            onClick={() => alert("Nhập CCCD & Chân dung: Tính năng chụp KYC đã được cấu hình!")}
            className="text-xs font-black underline bg-transparent border-none text-left cursor-pointer p-0 mt-0.5 text-error hover:brightness-110"
          >
            Xác thực ngay
          </button>
        </div>
      </div>

      {/* Sticky Search & filters */}
      <div className="bg-background/95 backdrop-blur-md px-4 py-4 space-y-4 border-b border-outline-variant/20 sticky top-12 z-40">
        {/* Search Input bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input
            type="text"
            placeholder="Tìm kiếm môn học, trình độ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-reg text-sm font-semibold"
          />
        </div>

        {/* Horizontal filter capsules */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => toggleFilter("subject")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${
              activeFilters.includes("subject")
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">subject</span>
            Môn học
          </button>
          
          <button
            onClick={() => toggleFilter("area")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${
              activeFilters.includes("area")
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            Khu vực
          </button>

          <button
            onClick={() => toggleFilter("price")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${
              activeFilters.includes("price")
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            Mức giá
          </button>

          <button
            onClick={() => toggleFilter("format")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all border-none ${
              activeFilters.includes("format")
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-outline-variant text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">devices</span>
            Hình thức
          </button>
        </div>
      </div>

      {/* Class Cards Stream */}
      <div className="px-4 mt-4 space-y-4">
        {filteredList.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4 space-y-4">
              {/* Card Title */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-h3 text-base font-extrabold text-on-surface">{job.title}</h3>
                  <p className="text-sm text-primary font-black mt-0.5">{job.fee}</p>
                </div>
                
                <span className={`font-caption text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider ${
                  job.id === "job-1" 
                    ? "bg-tertiary-container/10 text-tertiary" 
                    : job.id === "job-2"
                    ? "bg-surface-container-high text-on-surface-variant"
                    : "bg-secondary-container/10 text-secondary"
                }`}>
                  {job.id === "job-1" ? "Mới đăng" : job.id === "job-2" ? "Tại nhà" : "Online"}
                </span>
              </div>

              {/* Grid items */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">person</span>
                  <span className="text-xs font-semibold text-on-surface-variant">{job.contactName}</span>
                </div>
                
                <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-xs-plus">
                  {job.format === "ONLINE" ? (
                    <Globe className="w-4 h-4 text-outline" />
                  ) : (
                    <MapPin className="w-18 h-[18px] text-outline" />
                  )}
                  <span>
                    {job.location}{" "}
                    {job.distance && <span className="text-primary">• {job.distance}</span>}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-xs-plus">
                  <span className="material-symbols-outlined text-[18px] text-outline">calendar_today</span>
                  <span>{job.schedule}</span>
                </div>

                <div className="bg-surface-container-low p-3 rounded-lg flex items-start gap-2 border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">info</span>
                  <span className="text-xs text-on-surface-variant font-medium leading-relaxed italic">
                    {job.requirements}
                  </span>
                </div>
              </div>

              {/* Footer action apply count */}
              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary-fixed border border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-secondary-fixed border border-white"></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-bold">{job.tutorsCount} gia sư đã ứng tuyển</span>
                </div>

                <button
                  onClick={() => handleApply(job.id, job.title)}
                  disabled={job.isApplied}
                  className={`px-4 py-2 rounded-lg font-bold text-xs select-none transition-all shadow-md ${
                    job.isApplied
                      ? "bg-outline/50 text-white cursor-not-allowed shadow-none opacity-45"
                      : "bg-[#F97316] hover:bg-[#ea580c] text-white cursor-pointer active:scale-95"
                  }`}
                >
                  {job.isApplied ? "Đã ứng tuyển" : "Apply Now"}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
