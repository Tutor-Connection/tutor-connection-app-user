import React, { useState, useEffect } from "react";
import { 
  ScreenState, 
  User, 
  ClassSchedule, 
  MakeupClass, 
  JobListing, 
  Application,
  Transaction,
  ClassInfo,
  ChatThread,
  TrialClass,
  TutorProfile,
  NotificationItem,
  SupportTicket,
  Message
} from "./types";
import { 
  initialSchedules, 
  initialMakeups, 
  initialJobListings, 
  initialApplications,
  defaultTransactions, 
  defaultClasses, 
  defaultChats, 
  defaultTrials, 
  defaultProfile, 
  defaultNotifications, 
  translations 
} from "./data";
import { DemoOverlay } from "./components/DemoOverlay";
import { RegisterScreen } from "./components/RegisterScreen";
import { LoginScreen } from "./components/LoginScreen";
import { RoleSelectScreen } from "./components/RoleSelectScreen";
import { TutorDashboard } from "./components/TutorDashboard";
import { MakeupsScreen } from "./components/MakeupsScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { ExploreScreen } from "./components/ExploreScreen";
import { ApplicationsScreen } from "./components/ApplicationsScreen";
import { ClassDetailScreen } from "./components/ClassDetailScreen";

// Import components from Tutor Portal
import { WalletTab } from './components/WalletTab';
import { TuitionTab } from './components/TuitionTab';
import { ChatTab } from './components/ChatTab';
import { TrialsTab } from './components/TrialsTab';
import { ProfileTab } from './components/ProfileTab';

import { 
  Home, 
  Calendar as CalendarIcon, 
  Search, 
  RotateCcw, 
  FileText, 
  Briefcase, 
  X 
} from "lucide-react";

export default function App() {
  // Portal Mode: Switch between TutorSync Core App and Tutor Portal Space
  const [portalMode, setPortalMode] = useState<"tutorsync" | "tutor-portal">("tutorsync");

  // ==========================================
  // TutorSync Global States
  // ==========================================
  const [currentScreen, setCurrentScreen] = useState<ScreenState>("register");
  const [user, setUser] = useState<User>({
    name: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyen_van_a@gmail.com",
    avatar: undefined,
    role: "tutor",
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(initialSchedules);
  const [makeups, setMakeups] = useState<MakeupClass[]>(initialMakeups);
  const [listings, setListings] = useState<JobListing[]>(initialJobListings);
  const [applications, setApplications] = useState<Application[]>(initialApplications);

  // New Schedule Form Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newStudent, setNewStudent] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newStart, setNewStart] = useState("18:00");
  const [newEnd, setNewEnd] = useState("20:00");
  const [newFormat, setNewFormat] = useState<"ONLINE" | "OFFLINE" | "AT_HOME">("ONLINE");
  const [newLocation, setNewLocation] = useState("Google Meet / Zoom");
  const [newFee, setNewFee] = useState("350k/buổi");

  // ==========================================
  // Tutor Portal Global States
  // ==========================================
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(5500000);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [classes, setClasses] = useState<ClassInfo[]>(defaultClasses);
  const [chats, setChats] = useState<ChatThread[]>(defaultChats);
  const [trials, setTrials] = useState<TrialClass[]>(defaultTrials);
  const [profile, setProfile] = useState<TutorProfile>(defaultProfile);
  const [notifications, setNotifications] = useState<NotificationItem[]>(defaultNotifications);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [hasOverdueCommission, setHasOverdueCommission] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Calculate dynamic notification bubble count
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;
  // Calculate overall unread chat messages
  const totalUnreadChats = chats.reduce((sum, ch) => sum + ch.unreadCount, 0);
  const t = translations[lang];

  // Apply dark mode theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync user profile name with portal profile name
  useEffect(() => {
    if (user.name && profile.fullName !== user.name) {
      setProfile(prev => ({ ...prev, fullName: user.name }));
    }
  }, [user.name]);

  // ==========================================
  // TutorSync Callbacks
  // ==========================================
  const handleRegisterSuccess = (newUser: User) => {
    setUser(newUser);
    setCurrentScreen("role");
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentScreen("dashboard");
  };

  const handleRoleConfirmed = (role: "tutor" | "student") => {
    setUser((prev) => ({ ...prev, role }));
    setCurrentScreen("dashboard");
  };

  const handleCompleteSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((sch) => (sch.id === id ? { ...sch, status: "finished" as const } : sch))
    );
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent || !newSubject) {
      alert("Vui lòng điền đầy đủ Tên Học sinh và Môn học!");
      return;
    }

    const created: ClassSchedule = {
      id: `sch-${Date.now()}`,
      studentName: newStudent,
      subject: newSubject,
      start: newStart,
      end: newEnd,
      format: newFormat,
      location: newFormat === "ONLINE" ? "Google Meet / Zoom" : newLocation,
      status: "upcoming",
      date: new Date().toISOString().split("T")[0],
      hoursCount: 120,
      fee: newFee,
    };

    setSchedules((prev) => [created, ...prev]);
    setIsCreateOpen(false);

    // Reset fields
    setNewStudent("");
    setNewSubject("");
    setNewStart("18:00");
    setNewEnd("20:00");
    setNewFormat("ONLINE");
    setNewLocation("Google Meet / Zoom");
    setNewFee("350k/buổi");

    alert("Tạo lịch dạy học mới thành công!");
  };

  const handleUpdateMakeup = (id: string, proposedDate: string) => {
    setMakeups((prev) =>
      prev.map((mk) => (mk.id === id ? { ...mk, status: "proposed" as const, proposedDate } : mk))
    );
  };

  const handleApplyJob = (id: string) => {
    setListings((prev) =>
      prev.map((job) => (job.id === id ? { ...job, isApplied: true } : job))
    );
  };

  const handleAcceptApp = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "accepted" as const } : app))
    );
  };

  const handleRejectApp = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "rejected" as const } : app))
    );
  };

  const toggleRole = () => {
    setUser((prev) => ({
      ...prev,
      role: prev.role === "tutor" ? "student" : "tutor",
    }));
  };

  // Show bottom navigational tabs only on core dashboard layouts
  const showNav = [
    "dashboard",
    "makeup",
    "calendar",
    "explore",
    "applications",
    "class-detail"
  ].includes(currentScreen);

  // ==========================================
  // Tutor Portal Callbacks
  // ==========================================
  const handleUpdateBalance = (amount: number) => {
    setBalance(amount);
  };

  const handleAddTransaction = (tx: Transaction) => {
    setTransactions([tx, ...transactions]);
  };

  const handlePayCommission = () => {
    setHasOverdueCommission(false);
  };

  const handleUpdateClassStatus = (id: string, newStatus: 'paid' | 'unpaid' | 'overdue') => {
    setClasses(classes.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleAddChatMessage = (chatId: string, msg: Message) => {
    setChats(chats.map(ch => {
      if (ch.id === chatId) {
        return {
          ...ch,
          lastMessage: msg.text || (lang === 'vi' ? 'Đã gửi tài liệu' : 'Sent an attachment'),
          timestamp: msg.timestamp,
          messages: [...ch.messages, msg],
        };
      }
      return ch;
    }));
  };

  const handleClearUnread = (chatId: string) => {
    setChats(chats.map(ch => ch.id === chatId ? { ...ch, unreadCount: 0 } : ch));
  };

  const handleSetLanguage = (newLang: 'vi' | 'en') => {
    setLang(newLang);
  };

  const handleSetDarkMode = (dark: boolean) => {
    setDarkMode(dark);
  };

  const handleAddTicket = (ticket: SupportTicket) => {
    setTickets([ticket, ...tickets]);
  };

  const handleConvertTrialToActive = (trialId: string, studentName: string, subject: string) => {
    setTrials(trials.filter(t => t.id !== trialId));

    const classId = `class-${Date.now()}`;
    const codeId = `MT${Math.floor(10 + Math.random() * 90)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newClass: ClassInfo = {
      id: classId,
      studentName,
      subject,
      code: codeId,
      status: 'unpaid',
      tuitionFee: 1800000,
      commissionFee: 270000,
      paymentDay: lang === 'vi' ? 'Ngày 18 hàng tháng' : '18th Monthly',
      avatarBg: 'bg-primary-fixed',
      dueDate: lang === 'vi' ? 'Hạn đóng: 18/07' : 'Due: July 18',
    };

    setClasses([newClass, ...classes]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: lang === 'vi' ? 'Hợp đồng kích hoạt!' : 'Contract Activated!',
      description: lang === 'vi' 
        ? `Lớp ${subject} của học sinh ${studentName} đã chính thức chuyển thành lớp chính thức.`
        : `Class ${subject} for student ${studentName} is now officially registered as active.`,
      time: lang === 'vi' ? 'Vừa xong' : 'Just now',
      unread: true,
      category: 'system',
    };

    setNotifications([newNotif, ...notifications]);

    setChats(chats.map(ch => {
      if (ch.name.includes(studentName)) {
        return {
          ...ch,
          verified: true,
          trialBadge: false,
        };
      }
      return ch;
    }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleToggleNotificationDrawer = () => {
    setShowNotifications(!showNotifications);
  };

  const handleDismissNotificationItem = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  // Determine if authentication or selector pages are open
  const isAuthOrRoleSelect = ["register", "login", "role"].includes(currentScreen);

  return (
    <div className={`min-h-screen text-on-surface transition-colors duration-200 ${darkMode ? "dark bg-neutral-950" : "bg-[#f0f4f9]"}`}>
      
      {/* ====================================================
          PORTAL SWITCHER BANNER
          Visible once logged in to swap between portals
          ==================================================== */}
      {!isAuthOrRoleSelect && (
        <div className="fixed top-18 right-6 z-[100] animate-fade-in pointer-events-auto">
          <button
            onClick={() => setPortalMode(portalMode === "tutorsync" ? "tutor-portal" : "tutorsync")}
            className="flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-gradient-to-r from-primary to-[#2563eb] text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-black text-xs border border-white/20 select-none"
            title="Chuyển đổi giao diện"
          >
            <span className="material-symbols-outlined text-[16px] font-black animate-spin-slow">sync</span>
            <span>
              {portalMode === "tutorsync" ? "Cổng quản lý: Học phí & Ví 💵" : "Vào Lớp học: TutorSync 📚"}
            </span>
          </button>
        </div>
      )}

      {/* ====================================================
          PORTAL 1: TutorSync (Student / Tutor Main Portal Layout)
          ==================================================== */}
      {portalMode === "tutorsync" && (
        <div className="min-h-screen flex items-center justify-center p-0 md:p-6 transition-colors overflow-x-hidden">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 min-h-screen md:min-h-[850px] md:max-h-[900px] md:rounded-3xl md:shadow-2xl overflow-hidden relative flex flex-col border border-outline-variant/30">
            
            {/* Screen Router */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
              {currentScreen === "register" && (
                <RegisterScreen
                  onRegisterSuccess={handleRegisterSuccess}
                  onNavigateToLogin={() => setCurrentScreen("login")}
                />
              )}

              {currentScreen === "login" && (
                <LoginScreen
                  onLoginSuccess={handleLoginSuccess}
                  onNavigateToRegister={() => setCurrentScreen("register")}
                />
              )}

              {currentScreen === "role" && (
                <RoleSelectScreen onRoleConfirmed={handleRoleConfirmed} />
              )}

              {currentScreen === "dashboard" && (
                <TutorDashboard
                  user={user}
                  schedules={schedules}
                  onCompleteSchedule={handleCompleteSchedule}
                  onOpenCreateSchedule={() => setIsCreateOpen(true)}
                  onNavigateToScreen={(scr) => setCurrentScreen(scr)}
                />
              )}

              {currentScreen === "makeup" && (
                <MakeupsScreen
                  makeups={makeups}
                  onNavigateBack={() => setCurrentScreen("dashboard")}
                  onUpdateMakeup={handleUpdateMakeup}
                />
              )}

              {currentScreen === "calendar" && (
                <CalendarScreen
                  schedules={schedules}
                  onNavigateBack={() => setCurrentScreen("dashboard")}
                  onOpenCreateSchedule={() => setIsCreateOpen(true)}
                />
              )}

              {currentScreen === "explore" && (
                <ExploreScreen listings={listings} onApplyJob={handleApplyJob} />
              )}

              {currentScreen === "applications" && (
                <ApplicationsScreen
                  applications={applications}
                  onAcceptApp={handleAcceptApp}
                  onRejectApp={handleRejectApp}
                />
              )}

              {currentScreen === "class-detail" && (
                <ClassDetailScreen onNavigateBack={() => setCurrentScreen("dashboard")} />
              )}
            </div>

            {/* Create Schedule Modal Sheet Overlay */}
            {isCreateOpen && (
              <div className="fixed inset-0 z-[110] flex items-end justify-center">
                <div 
                  onClick={() => setIsCreateOpen(false)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
                ></div>

                <form 
                  onSubmit={handleCreateSchedule}
                  className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-t-2xl shadow-2xl p-6 overflow-hidden animate-slide-up space-y-4 border border-outline-variant/30 z-10"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-outline-variant/30">
                    <h3 className="font-h3 text-base text-on-surface font-black flex items-center gap-1.5 dark:text-white">
                      <span className="material-symbols-outlined text-primary font-black">calendar_add_on</span>
                      Tạo ca dạy học mới
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="p-1 rounded-full hover:bg-surface-container-high transition-colors text-outline border-none bg-transparent cursor-pointer flex items-center justify-center dark:text-neutral-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto no-scrollbar pr-1">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Tên học sinh / Học viên:</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Lê Minh Tuấn"
                        value={newStudent}
                        onChange={(e) => setNewStudent(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Môn học & Trình độ:</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Toán giải tích lớp 12"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Giờ bắt đầu:</label>
                        <input 
                          type="text" 
                          required
                          placeholder="18:30"
                          value={newStart}
                          onChange={(e) => setNewStart(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Giờ kết thúc:</label>
                        <input 
                          type="text" 
                          required
                          placeholder="20:30"
                          value={newEnd}
                          onChange={(e) => setNewEnd(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Hình thức giảng dạy:</label>
                      <div className="flex gap-2">
                        {["ONLINE", "OFFLINE"].map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setNewFormat(f as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                              newFormat === f 
                                ? "bg-primary text-white border-primary" 
                                : "bg-white border-outline-variant text-on-surface-variant dark:bg-neutral-850 dark:border-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {newFormat === "OFFLINE" && (
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Địa chỉ phòng học:</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ví dụ: Nguyễn Văn Cừ, Quận 5"
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1 dark:text-neutral-400">Mức học phí kì vọng:</label>
                      <input 
                        type="text" 
                        required
                        placeholder="350k/buổi"
                        value={newFee}
                        onChange={(e) => setNewFee(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:ring-1 focus:ring-primary dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      className="flex-1 py-3 bg-surface-container text-on-surface-variant font-bold rounded-xl text-xs cursor-pointer border-none dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-xs shadow-md active:scale-95 transition-all border-none cursor-pointer"
                    >
                      Xác nhận lưu
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Persistent Bottom Navigational Menu */}
            {showNav && (
              <nav className="absolute bottom-0 left-0 w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-outline-variant/30 flex justify-between items-center px-2 py-3 z-50">
                <button
                  onClick={() => setCurrentScreen("dashboard")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "dashboard" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <Home className={`w-5 h-5 ${currentScreen === "dashboard" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide">Trang chủ</span>
                </button>

                <button
                  onClick={() => setCurrentScreen("makeup")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "makeup" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <RotateCcw className={`w-5 h-5 ${currentScreen === "makeup" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide">Dạy bù</span>
                </button>

                <button
                  onClick={() => setCurrentScreen("calendar")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "calendar" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <CalendarIcon className={`w-5 h-5 ${currentScreen === "calendar" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide">Lịch biểu</span>
                </button>

                <button
                  onClick={() => setCurrentScreen("explore")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "explore" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <Search className={`w-5 h-5 ${currentScreen === "explore" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide">Khám phá</span>
                </button>

                <button
                  onClick={() => setCurrentScreen("applications")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "applications" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <FileText className={`w-5 h-5 ${currentScreen === "applications" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide font-extrabold">Hồ sơ</span>
                </button>

                <button
                  onClick={() => setCurrentScreen("class-detail")}
                  className={`flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer transition-colors ${
                    currentScreen === "class-detail" ? "text-primary" : "text-on-surface-variant dark:text-neutral-400"
                  }`}
                >
                  <Briefcase className={`w-5 h-5 ${currentScreen === "class-detail" ? "stroke-[2.5px]" : "stroke-2"}`} />
                  <span className="text-[9px] font-black tracking-wide font-extrabold">Chi tiết</span>
                </button>
              </nav>
            )}
          </div>

          {/* Fixed Demo Control Deck bar */}
          <DemoOverlay
            currentScreen={currentScreen}
            onScreenChange={(scr) => setCurrentScreen(scr)}
            userRole={user.role}
            onRoleToggle={toggleRole}
          />
        </div>
      )}

      {/* ====================================================
          PORTAL 2: Tutor Portal (Tutor Management Area)
          ==================================================== */}
      {portalMode === "tutor-portal" && (
        <div className={`min-h-screen bg-background text-on-surface font-sans transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100`}>
          
          {/* Notifications Drawer overlay (Screen 7 Drawer) */}
          {showNotifications && (
            <div 
              className="fixed inset-0 bg-black/60 z-50 flex items-start justify-end" 
              onClick={() => setShowNotifications(false)}
            >
              <div 
                className="bg-white dark:bg-neutral-900 w-full max-w-sm h-full flex flex-col shadow-2xl border-l border-outline-variant/30 animate-slide-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary font-bold">notifications</span>
                    <h3 className="font-bold text-base text-on-surface dark:text-white">{t.notifTitle}</h3>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1 cursor-pointer dark:text-neutral-300"
                  >
                    close
                  </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-on-surface-variant">
                      <span className="material-symbols-outlined !text-4xl text-outline mb-2">notifications_off</span>
                      <p className="text-xs font-semibold">{lang === 'vi' ? 'Không có thông báo mới' : 'No new notifications'}</p>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      const isRead = !item.unread;
                      let iconName = 'notifications';
                      if (item.category === 'payment') iconName = 'payments';
                      else if (item.category === 'schedule') iconName = 'calendar_month';

                      return (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-xl border transition-all relative group ${
                            isRead 
                              ? 'bg-surface-container-low border-outline-variant/25 opacity-70 dark:bg-neutral-800/40 dark:border-neutral-700/50' 
                              : 'bg-primary-container/10 border-primary/20 shadow-sm dark:bg-primary-container/5 dark:border-primary/30'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`w-9 h-9 rounded-full px-2 flex items-center justify-center shrink-0 ${
                              isRead 
                                ? 'bg-surface-container-high text-on-surface-variant dark:bg-neutral-800 dark:text-neutral-300' 
                                : 'bg-primary text-white'
                            }`}>
                              <span className="material-symbols-outlined text-md">{iconName}</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-6">
                              <p className={`text-xs font-extrabold truncate ${isRead ? 'text-on-surface-variant dark:text-neutral-300' : 'text-on-surface text-primary dark:text-blue-400'}`}>
                                {item.title}
                              </p>
                              <p className="text-[11px] text-on-surface-variant dark:text-neutral-400 leading-relaxed mt-1">{item.description}</p>
                              <span className="text-[9px] text-outline mt-1 block font-semibold">{item.time}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDismissNotificationItem(item.id)}
                            className="absolute right-2 top-2 p-1 rounded-full hover:bg-error-container hover:text-error text-[16px] text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer material-symbols-outlined"
                            title="Discard"
                          >
                            close
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Mark all read */}
                <div className="p-4 border-t border-outline-variant/20 bg-surface-container-lowest dark:bg-neutral-950">
                  <button 
                    onClick={handleMarkAllNotificationsRead}
                    disabled={unreadNotificationsCount === 0}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all border shadow-sm cursor-pointer text-center ${
                      unreadNotificationsCount === 0 
                        ? 'border-outline-variant text-on-surface-variant opacity-50 cursor-not-allowed dark:border-neutral-850 dark:text-neutral-500' 
                        : 'bg-primary text-white border-primary hover:bg-primary-container'
                    }`}
                  >
                    {t.markAllRead}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <header className="fixed top-0 left-0 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md z-45 flex items-center justify-between px-4 py-2 border-b border-outline-variant/10 shadow-sm h-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-md font-bold text-lg select-none">
                T
              </div>
              <div>
                <h1 className="text-sm font-black font-display text-primary truncate leading-none uppercase tracking-wider dark:text-blue-400">
                  {lang === 'vi' ? 'Gia Sư Portal' : 'Tutor Portal'}
                </h1>
                <p className="text-[10px] text-on-surface-variant dark:text-neutral-400 font-medium mt-0.5">
                  {lang === 'vi' ? 'Quản lý học tập & ví điện tử' : 'Tuition & Wallet space'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className="w-10 h-10 rounded-full bg-surface-container dark:bg-neutral-800 hover:bg-surface-container-high dark:hover:bg-neutral-750 transition-colors text-xs font-black text-primary dark:text-blue-400 select-none cursor-pointer flex items-center justify-center border border-outline-variant/30"
                title="Switch Language"
              >
                {lang === 'vi' ? 'EN' : 'VI'}
              </button>

              {hasOverdueCommission && (
                <div 
                  onClick={() => setActiveTab(1)}
                  className="relative w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-error border border-error/20 cursor-pointer hover:bg-error-container/40 animate-pulse"
                  title={lang === 'vi' ? 'Phí quá hạn cần đóng!' : 'Overdue system fee needs payment!'}
                >
                  <span className="material-symbols-outlined text-[20px] font-bold">warning</span>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-white"></span>
                </div>
              )}

              <button 
                id="notification-bell-trigger"
                onClick={handleToggleNotificationDrawer}
                className="relative w-10 h-10 rounded-full bg-surface-container dark:bg-neutral-800 hover:bg-surface-container-high dark:hover:bg-neutral-750 text-on-surface dark:text-white transition-colors flex items-center justify-center cursor-pointer border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-error text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-surface animate-bounce shadow-sm">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              <div 
                onClick={() => setActiveTab(4)}
                className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant cursor-pointer hover:border-primary transition-colors shrink-0 hidden sm:block"
              >
                <img className="w-full h-full object-cover" src={profile.avatar} alt="tutor portrait" />
              </div>
            </div>
          </header>

          {/* Main Tab Screen Area */}
          <div className="pt-16 pb-20 max-w-7xl mx-auto flex flex-col min-h-screen px-4">
            {activeTab === 0 && (
              <TuitionTab 
                classes={classes} 
                lang={lang} 
                onUpdateClassStatus={handleUpdateClassStatus} 
                onUpdateBalance={handleUpdateBalance} 
                onRedirectToTab={(idx) => setActiveTab(idx)}
              />
            )}
            
            {activeTab === 1 && (
              <WalletTab 
                balance={balance} 
                transactions={transactions} 
                classes={classes} 
                lang={lang} 
                onUpdateBalance={handleUpdateBalance} 
                onAddTransaction={handleAddTransaction} 
                onPayCommission={handlePayCommission}
                hasOverdueCommission={hasOverdueCommission}
              />
            )}

            {activeTab === 2 && (
              <ChatTab 
                chats={chats} 
                lang={lang} 
                onAddChatMessage={handleAddChatMessage} 
                onClearUnread={handleClearUnread} 
              />
            )}

            {activeTab === 3 && (
              <TrialsTab 
                trials={trials} 
                lang={lang} 
                onConvertTrialToActive={handleConvertTrialToActive} 
              />
            )}

            {activeTab === 4 && (
              <ProfileTab 
                profile={profile} 
                lang={lang} 
                darkMode={darkMode} 
                tickets={tickets} 
                onUpdateProfile={(prof) => setProfile({ ...profile, ...prof })}
                onSetLanguage={handleSetLanguage} 
                onSetDarkMode={handleSetDarkMode} 
                onAddTicket={handleAddTicket} 
              />
            )}
          </div>

          {/* Bottom Floating Navigation Sheet */}
          <nav id="bottom-navigation-tabs" className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-outline-variant/20 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] z-40 flex justify-around py-3 px-2 h-20 rounded-t-[20px] md:rounded-t-[24px]">
            <button 
              onClick={() => setActiveTab(0)}
              className={`relative flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-200 ${
                activeTab === 0 ? 'text-primary scale-105 font-bold dark:text-blue-400' : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1 rounded-full ${activeTab === 0 ? 'bg-primary-container px-4 text-white' : ''}`}>
                <span className="material-symbols-outlined text-lg">school</span>
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">{t.billingTab}</span>
            </button>

            <button 
              onClick={() => setActiveTab(1)}
              className={`relative flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-200 ${
                activeTab === 1 ? 'text-primary scale-105 font-bold dark:text-blue-400' : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1 rounded-full ${activeTab === 1 ? 'bg-primary-container px-4 text-white' : ''}`}>
                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">{t.walletTab}</span>
            </button>

            <button 
              onClick={() => setActiveTab(2)}
              className={`relative flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-200 ${
                activeTab === 2 ? 'text-primary scale-105 font-bold dark:text-blue-400' : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1 rounded-full ${activeTab === 2 ? 'bg-primary-container px-4 text-white' : ''}`}>
                <span className="material-symbols-outlined text-lg">chat</span>
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">{t.chatTab}</span>
              {totalUnreadChats > 0 && (
                <span className="absolute top-1.5 right-6 bg-error text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalUnreadChats}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab(3)}
              className={`relative flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-200 ${
                activeTab === 3 ? 'text-primary scale-105 font-bold dark:text-blue-400' : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1 rounded-full ${activeTab === 3 ? 'bg-primary-container px-4 text-white' : ''}`}>
                <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">{t.trialTab}</span>
              {trials.length > 0 && (
                <span className="absolute top-1.5 right-6 bg-secondary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                  {trials.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab(4)}
              className={`relative flex flex-col items-center justify-center flex-1 cursor-pointer transition-all duration-200 ${
                activeTab === 4 ? 'text-primary scale-105 font-bold dark:text-blue-400' : 'text-on-surface-variant dark:text-neutral-400 hover:text-primary/70'
              }`}
            >
              <div className={`p-1 rounded-full ${activeTab === 4 ? 'bg-primary-container px-4 text-white' : ''}`}>
                <span className="material-symbols-outlined text-lg">settings</span>
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">{t.profileTab}</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
