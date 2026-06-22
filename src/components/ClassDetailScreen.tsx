import React, { useState } from "react";
import { MessageLog } from "../types";
import { 
  ArrowLeft, 
  Share2, 
  Bell, 
  GraduationCap, 
  Phone, 
  Video, 
  BadgeCheck, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  MessageSquare, 
  Send,
  CheckCircle
} from "lucide-react";

interface ClassDetailScreenProps {
  onNavigateBack: () => void;
}

export const ClassDetailScreen: React.FC<ClassDetailScreenProps> = ({
  onNavigateBack,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"info" | "schedule" | "payment" | "notes">("info");
  
  // Interactive Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [messages, setMessages] = useState<MessageLog[]>([
    { id: "1", sender: "student", text: "Dạ em chào anh Văn A ạ, buổi tối mai em bận đột xuất, mình dời lịch học sang Thứ 7 được không anh?", time: "18:24" },
    { id: "2", sender: "tutor", text: "Xin chào Tú, lịch đó hoàn toàn khả thi nhé em. Chúng ta sẽ bù vào 19h30 tối Thứ 7 tuần này nhé.", time: "18:30" },
    { id: "3", sender: "student", text: "Dạ hay quá em cảm ơn anh nhiều ạ! Mai em sẽ chuẩn bị trước case study viết email nhé.", time: "18:32" },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg: MessageLog = {
      id: Date.now().toString(),
      sender: "tutor",
      text: msgInput,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMsgInput("");

    // Simulated quick auto reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "student",
          text: "Dạ vâng anh, em đã nhận được tin nhắn và sẽ có mặt đúng giờ họp Zoom ạ! 👍",
          time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md bg-background min-h-screen pb-32 animate-fade-in mx-auto relative">
      {/* AppBar */}
      <header className="w-full sticky top-0 z-50 flex justify-between items-center px-4 py-3 bg-white shadow-sm border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateBack}
            className="p-1 rounded-full hover:bg-surface-container-high transition-all text-primary bg-transparent border-none cursor-pointer flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-h2-mobile text-base font-black text-primary">Chi tiết lớp học</h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => alert("Đã sao chép liên kết lớp học này lên bảng nhớ tạm!")}
            className="p-1 rounded-full text-on-surface-variant bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-surface-container-low"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => alert("Chuông thông báo của lớp học Tú đang được bật!")}
            className="p-1 rounded-full text-on-surface-variant bg-transparent border-none cursor-pointer flex items-center justify-center hover:bg-surface-container-low"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Student Header card */}
      <section className="p-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          
          <div className="relative">
            <img 
              className="w-20 h-20 rounded-full object-cover border-2 border-primary-fixed"
              alt="Avatar"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGb776DxaLNDPTvAGS6vQDNRKpc35TOKLyi4dCM7cJawiODO6CqMUNZ-wcNFUCPb9wpwbMh5mYnFsLd7WFySr_B6IYcVj2O5nEp1ytFfnvBnZuBpZN_abFvHHs_1iBeYQ5iDxdR8-b9kH1Ilg34BPBOtgjqH4sMwTuKEsMfkA_PDvhXIXK14Q5oDKgMK1Sz5hlvxZkpsvNTaKM6j7RWUDekmOEUzDxUq8fAV_1HpHxaTuvCmM0wwGB5S9XffUX2QyeIoAowahdHnmF"
            />
            <div className="absolute bottom-0 right-0 bg-[#22c55e] text-white p-1 rounded-full border-2 border-white flex items-center justify-center shadow-md">
              <BadgeCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-h1-mobile text-lg text-on-surface font-black">Trần Văn Tú</h2>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-1.5">
              <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                Người đi làm
              </span>
              <span className="bg-secondary-container/10 text-secondary-container px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                TIẾNG ANH GIAO TIẾP
              </span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button 
              onClick={() => alert("Đang kết nối cuộc gọi thoại trực tiếp đến Trần Văn Tú...")}
              className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-outline-variant/30 flex items-center justify-center text-primary active:scale-90 transition-all border-none cursor-pointer"
            >
              <Phone className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={() => alert("Đang thiết lập phòng họp trực thoại Video Room Zoom...")}
              className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-outline-variant/30 flex items-center justify-center text-primary active:scale-90 transition-all border-none cursor-pointer"
            >
              <Video className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      </section>

      {/* Sub Tabs Controller */}
      <nav className="sticky top-12 bg-white z-40 px-4 flex gap-6 overflow-x-auto no-scrollbar border-b border-outline-variant/30 shadow-sm">
        <button 
          onClick={() => setActiveSubTab("info")}
          className={`py-3.5 whitespace-nowrap text-xs font-bold transition-all border-none cursor-pointer bg-transparent ${
            activeSubTab === "info" ? "text-primary border-b-2 border-primary font-black" : "text-on-surface-variant"
          }`}
        >
          Thông tin lớp
        </button>
        <button 
          onClick={() => setActiveSubTab("schedule")}
          className={`py-3.5 whitespace-nowrap text-xs font-bold transition-all border-none cursor-pointer bg-transparent ${
            activeSubTab === "schedule" ? "text-primary border-b-2 border-primary font-black" : "text-on-surface-variant"
          }`}
        >
          Lịch học
        </button>
        <button 
          onClick={() => setActiveSubTab("payment")}
          className={`py-3.5 whitespace-nowrap text-xs font-bold transition-all border-none cursor-pointer bg-transparent ${
            activeSubTab === "payment" ? "text-primary border-b-2 border-primary font-black" : "text-on-surface-variant"
          }`}
        >
          Học phí
        </button>
        <button 
          onClick={() => setActiveSubTab("notes")}
          className={`py-3.5 whitespace-nowrap text-xs font-bold transition-all border-none cursor-pointer bg-transparent ${
            activeSubTab === "notes" ? "text-primary border-b-2 border-primary font-black" : "text-on-surface-variant"
          }`}
        >
          Ghi chú
        </button>
      </nav>

      {/* Item details */}
      <div className="p-4 space-y-4">
        
        {/* Info tab */}
        {activeSubTab === "info" && (
          <div className="space-y-4 animate-scale-in">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5">payments</span>
                <div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Học phí</p>
                  <p className="font-h3 text-base text-on-surface font-extrabold">350k / buổi</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">schedule</span>
                <div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Lịch cố định</p>
                  <p className="font-h3 text-base text-on-surface font-extrabold">Thứ 3, Thứ 5 - 19:30</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#22c55e] mt-0.5">videocam</span>
                <div>
                  <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">Địa điểm</p>
                  <p className="font-h3 text-base text-on-surface font-extrabold">Online (Zoom)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-outline-variant/30">
              <h3 className="font-h3 text-sm font-black text-on-surface mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary font-black text-sm">priority_high</span>
                Yêu cầu đặc biệt
              </h3>
              <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                Học viên mong muốn tập trung cải thiện kỹ năng <span className="font-bold text-primary">Speaking</span> để phục vụ công việc và <span className="font-bold text-primary">Writing</span> để soạn thảo email chuyên nghiệp. Cần chuẩn bị nhiều case study thực tế cuộc sống.
              </p>
            </div>
          </div>
        )}

        {/* Schedule tab */}
        {activeSubTab === "schedule" && (
          <div className="space-y-4 animate-scale-in">
            <div className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="p-3 bg-surface-container-high flex justify-between items-center">
                <h4 className="font-h3 text-xs font-black">Tháng 10, 2023</h4>
                <div className="flex gap-2">
                  <ChevronLeft className="w-4 h-4 cursor-pointer text-on-surface-variant" />
                  <ChevronRight className="w-4 h-4 cursor-pointer text-on-surface-variant" />
                </div>
              </div>
              <div className="grid grid-cols-7 text-center p-2 border-b border-outline-variant text-[10px] text-outline font-bold">
                <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
              </div>
              <div className="grid grid-cols-7 text-center p-2 text-xs font-semibold">
                <div className="py-1.5 text-outline opacity-40">28</div><div className="py-1.5 text-outline opacity-40">29</div><div className="py-1.5 text-outline opacity-40">30</div>
                <div className="py-1.5 text-on-surface">1</div><div className="py-1.5 text-on-surface">2</div><div className="py-1.5 text-on-surface">3</div><div className="py-1.5 text-on-surface">4</div>
                <div className="py-1.5 text-on-surface">5</div><div className="py-1.5 text-on-surface">6</div>
                <div className="py-1.5 bg-primary text-white rounded-lg font-bold">7</div><div className="py-1.5 text-on-surface">8</div>
                <div className="py-1.5 text-on-surface">9</div><div className="py-1.5 text-on-surface">10</div><div className="py-1.5 text-on-surface">11</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-h3 text-xs font-black text-on-surface">Lớp sắp diễn ra</h4>
              <div className="bg-white p-3 rounded-xl border-l-4 border-l-primary border border-outline-variant/30 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-extrabold text-on-surface">Buổi 12: Business English</p>
                  <p className="text-[10px] font-semibold text-on-surface-variant">Thứ 3, 24/10 • 19:30 - 21:00</p>
                </div>
                <button 
                  onClick={() => alert("Lớp học đã được lên lịch thành công!")}
                  className="p-1 text-on-surface-variant border-none bg-transparent cursor-pointer"
                >
                  •••
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment tab */}
        {activeSubTab === "payment" && (
          <div className="space-y-4 animate-scale-in">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => alert("Đã gửi thông báo xác nhận thanh toán thành công!")}
                className="bg-[#22c55e] hover:brightness-110 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 transition-all text-xs border-none cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                Xác nhận đã nhận
              </button>
              
              <button 
                onClick={() => alert("Đã gửi tin nhắn nhắc nhở thanh toán học phí tự động tới phụ huynh!")}
                className="bg-[#f97316] hover:brightness-110 text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-md active:scale-95 transition-all text-xs border-none cursor-pointer"
              >
                <span className="material-symbols-outlined text-white">notification_important</span>
                Nhắc đóng học phí
              </button>
            </div>

            <div className="bg-white rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
              <div className="p-3 border-b border-outline-variant/30 flex justify-between items-center">
                <h4 className="font-h3 text-xs font-black">Lịch sử giao dịch</h4>
                <span className="text-primary font-bold text-xs uppercase">Tháng 10</span>
              </div>
              <div className="divide-y divide-outline-variant/30">
                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-extrabold text-on-surface">Thanh toán tháng 9</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">12 buổi • 4.200.000đ</p>
                  </div>
                  <span className="bg-tertiary/10 text-tertiary px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                    ĐÃ THU
                  </span>
                </div>

                <div className="p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-extrabold text-on-surface">Thanh toán tháng 10</p>
                    <p className="text-[10px] text-on-surface-variant font-medium">10 buổi • 3.500.000đ</p>
                  </div>
                  <span className="bg-secondary-container/10 text-secondary-container px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                    CHỜ ĐÓNG
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes tab */}
        {activeSubTab === "notes" && (
          <div className="space-y-4 animate-scale-in">
            <div className="bg-white p-4 rounded-xl border border-outline-variant/30 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-h3 text-sm font-black text-on-surface">Ghi chú riêng tư của Gia sư</h3>
                <Lock className="w-3.5 h-3.5 text-outline" />
              </div>
              
              <textarea 
                className="w-full h-44 bg-surface-container-low border-none rounded-lg p-3 text-xs font-semibold text-on-surface outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none"
                placeholder="Ghi chú về tiến độ học tập, điểm yếu nói lặp âm, hoặc các bài viết cần rèn luyện cấu trúc phản biện cho học viên Trần Văn Tú..."
              ></textarea>
              
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => alert("Đã lưu trữ ghi chú gia sư thành công!")}
                  className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-full font-bold text-xs shadow-md active:scale-95 transition-all border-none cursor-pointer"
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Floating Chat Button Triggers */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-outline-variant/30 z-50 flex justify-center max-w-md">
        <button 
          onClick={() => setIsChatOpen(true)}
          className="w-full max-w-md bg-primary hover:bg-primary-container text-white font-h3 text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all border-none cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          Chat với học viên
        </button>
      </div>

      {/* Interactive Chat Overlay Drawers (Drawer slides up) */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsChatOpen(false)}
            className="absolute inset-0 bg-on-background/40 backdrop-blur-sm animate-fade-in"
          ></div>
          
          {/* Drawer container */}
          <div className="relative w-full max-w-md bg-white rounded-t-2xl shadow-2xl overflow-hidden animate-slide-up flex flex-col h-[80vh] z-10">
            {/* Header */}
            <div className="px-4 py-3.5 border-b border-outline-variant/30 flex justify-between items-center bg-surface sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img 
                    className="w-full h-full object-cover"
                    alt="Tú"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGb776DxaLNDPTvAGS6vQDNRKpc35TOKLyi4dCM7cJawiODO6CqMUNZ-wcNFUCPb9wpwbMh5mYnFsLd7WFySr_B6IYcVj2O5nEp1ytFfnvBnZuBpZN_abFvHHs_1iBeYQ5iDxdR8-b9kH1Ilg34BPBOtgjqH4sMwTuKEsMfkA_PDvhXIXK14Q5oDKgMK1Sz5hlvxZkpsvNTaKM6j7RWUDekmOEUzDxUq8fAV_1HpHxaTuvCmM0wwGB5S9XffUX2QyeIoAowahdHnmF"
                  />
                </div>
                <div>
                  <h4 className="font-h3 text-xs font-black">Trần Văn Tú</h4>
                  <p className="text-[10px] text-tertiary font-bold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full inline-block"></span>
                    Online
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container-high transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
              >
                <X className="w-5 h-5 text-on-surface-variant font-bold" />
              </button>
            </div>

            {/* Chat Body (Scrollable stream) */}
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4 bg-background">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.sender === "tutor" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                    msg.sender === "tutor" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-on-surface border border-outline-variant/30 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-outline font-bold mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Keyboard entry input bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-outline-variant/30 bg-white flex gap-2 items-center sticky bottom-0 z-10 shadow-lg">
              <input 
                type="text"
                placeholder="Nhập tin nhắn đến Tú..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all"
              />
              <button 
                type="submit"
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shrink-0 border-none cursor-pointer active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4 fill-white text-white" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
