import React, { useState } from "react";
import { MakeupClass } from "../types";
import { ArrowLeft, PlusCircle, CheckCircle, Calendar, AlertTriangle, FilePenLine } from "lucide-react";

interface MakeupsScreenProps {
  makeups: MakeupClass[];
  onNavigateBack: () => void;
  onUpdateMakeup: (id: string, proposedDate: string) => void;
}

export const MakeupsScreen: React.FC<MakeupsScreenProps> = ({
  makeups,
  onNavigateBack,
  onUpdateMakeup,
}) => {
  const [makeupList, setMakeupList] = useState<MakeupClass[]>(makeups);
  const [openProposedId, setOpenProposedId] = useState<string | null>(null);
  const [proposalDate, setProposedDate] = useState("");

  const handleCreateProposal = (id: string) => {
    if (!proposalDate) {
      alert("Vui lòng nhập ngày giờ đề xuất học bù!");
      return;
    }
    onUpdateMakeup(id, proposalDate);
    
    // Update local state to reflect transition beautifully
    setMakeupList((prev) => 
      prev.map((item) => 
        item.id === id 
          ? { ...item, status: "proposed", proposedDate: proposalDate } 
          : item
      )
    );
    
    setOpenProposedId(null);
    setProposedDate("");
    alert("Đã gửi đề xuất lịch học bù cho phụ huynh học sinh duyệt!");
  };

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-24 animate-fade-in mx-auto">
      {/* Top Header */}
      <header className="fixed top-0 max-w-md w-full z-50 bg-white/95 backdrop-blur-md shadow-sm px-4 py-3 flex items-center justify-between h-16 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateBack}
            className="p-1 rounded-full hover:bg-surface-container-high active:scale-95 transition-all text-primary bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-h3 text-h3 font-black text-primary">Lịch dạy bù</h1>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="pt-20 px-4 space-y-6">
        
        {/* Stats Summary Bento Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary text-on-primary p-4 rounded-2xl shadow-md">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Cần bù</p>
            <h2 className="font-h1-mobile text-h1-mobile font-black">08 ca</h2>
          </div>
          
          <div className="bg-white text-on-surface p-4 rounded-2xl border border-outline-variant/45 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Đã xác nhận</p>
            <h2 className="font-h1-mobile text-h1-mobile font-black text-primary">12 ca</h2>
          </div>
        </div>

        {/* Makeup Request list */}
        <div className="space-y-4">
          {makeupList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col gap-3 hover:translate-y-px transition-all">
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-h3 text-base font-extrabold text-on-surface">{item.subject}</h3>
                  <p className="text-xs text-on-surface-variant font-medium">Học sinh: <span className="font-bold text-on-surface">{item.studentName}</span></p>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                  item.status === "approved"
                    ? "bg-tertiary-container/10 text-tertiary"
                    : item.status === "proposed"
                    ? "bg-surface-container-high text-on-surface-variant"
                    : "bg-secondary-container/10 text-secondary"
                }`}>
                  {item.status === "approved" ? "Đã đồng ý" : item.status === "proposed" ? "Đang đề xuất" : "Chờ xác nhận"}
                </span>
              </div>

              <div className="h-px bg-outline-variant/30"></div>

              <div className="grid grid-cols-2 gap-4 py-1">
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">event_busy</span>
                  <p className="text-xs font-semibold text-on-surface-variant">Nghỉ: {item.missedDate}</p>
                </div>
                
                <div className="flex items-center gap-1.5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px] text-outline">info</span>
                  <p className="text-xs font-semibold text-on-surface-variant italic">{item.reason}</p>
                </div>
              </div>

              {/* Status specific layouts */}
              {item.status === "pending" && (
                <div className="space-y-3 pt-1">
                  {openProposedId === item.id ? (
                    <div className="space-y-2 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 animate-scale-in">
                      <label className="block text-[11px] font-extrabold text-on-surface-variant uppercase">Nhập thời gian đề xuất bù:</label>
                      <input 
                        type="text"
                        placeholder="Ví dụ: Thứ 7, 20/03 - 19:30"
                        value={proposalDate}
                        onChange={(e) => setProposedDate(e.target.value)}
                        className="w-full bg-white border border-outline-variant rounded-lg p-2 text-xs font-medium"
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => setOpenProposedId(null)}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-outline-variant/30 text-on-surface-variant font-bold text-xs"
                        >
                          Hủy
                        </button>
                        <button 
                          onClick={() => handleCreateProposal(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs shadow-sm"
                        >
                          Gửi đề xuất
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setOpenProposedId(item.id)}
                      className="w-full py-2.5 bg-primary-container hover:bg-primary text-on-primary font-bold rounded-xl active:scale-95 transition-all flex justify-center items-center gap-1.5 shadow-sm text-xs cursor-pointer border-none"
                    >
                      <PlusCircle className="w-4 h-4 text-white" />
                      Tạo lịch bù
                    </button>
                  )}
                </div>
              )}

              {item.status === "proposed" && (
                <div className="mt-1 flex gap-2">
                  <button 
                    onClick={() => {
                      setOpenProposedId(item.id);
                      setProposedDate(item.proposedDate || "");
                    }}
                    className="flex-1 py-2.5 border border-outline-variant text-[11px] hover:bg-surface-container text-on-surface-variant font-bold rounded-xl active:scale-95 transition-all flex justify-center items-center gap-1 cursor-pointer bg-white"
                  >
                    <FilePenLine className="w-3.5 h-3.5" />
                    Chỉnh sửa
                  </button>
                  <button 
                    disabled 
                    className="flex-1 py-2 rounded-xl bg-surface-container-high text-on-surface-variant/50 text-[11px] font-bold cursor-not-allowed border-none shadow-sm"
                  >
                    Đã gửi yêu cầu ({item.proposedDate})
                  </button>
                </div>
              )}

              {item.status === "approved" && (
                <div className="bg-tertiary-container/10 p-3 rounded-xl flex items-center gap-2.5 border border-tertiary-container/20">
                  <CheckCircle className="w-5 h-5 text-tertiary fill-tertiary/10" />
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-tertiary">Lịch bù đã chốt</p>
                    <p className="text-xs font-black text-on-surface">{item.proposedDate}</p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
