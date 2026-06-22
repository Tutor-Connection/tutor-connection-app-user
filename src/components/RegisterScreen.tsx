import React, { useState, useEffect, useRef } from "react";
import { User, ScreenState } from "../types";
import { User as UserIcon, Phone, Mail, Lock, Send, ArrowRight } from "lucide-react";

interface RegisterScreenProps {
  onRegisterSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
}) => {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(119); // 1:59
  const [otpError, setOtpError] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Timer countdown simulation
  useEffect(() => {
    if (!otpSent) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleSendOtp = () => {
    if (!fullname || !phone || !password) {
      alert("Vui lòng điền Họ tên, Số điện thoại và Mật khẩu!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    setOtpSent(true);
    setTimeLeft(119);
  };

  const handleOtpChange = (index: number, val: string) => {
    const freshOtp = [...otpValues];
    freshOtp[index] = val.slice(-1);
    setOtpValues(freshOtp);

    // Auto focus next input
    if (val && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const isOtpComplete = otpValues.every((c) => c !== "");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    // Simulate OTP validation
    const fullOtp = otpValues.join("");
    if (fullOtp === "123456" || otpSent) {
      // Create user
      const userPayload: User = {
        name: fullname,
        phone: phone,
        email: email || undefined,
        avatar: undefined,
        role: null, // to be selected next
      };
      
      onRegisterSuccess(userPayload);
    } else {
      setOtpError("Mã OTP không xác thực! Vui lòng nhập mã bất kỳ hoặc '123456' để đăng ký.");
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `Hết hạn sau ${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md bg-surface min-h-screen flex flex-col shadow-2xl mx-auto overflow-hidden animate-fade-in pb-12">
      {/* Header / Logo */}
      <header className="pt-16 pb-6 px-6 flex flex-col items-center space-y-4 shrink-0">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-container opacity-40"></div>
          <span className="material-symbols-outlined text-[48px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
        </div>
        <div className="text-center">
          <h1 className="font-h1-mobile text-h1-mobile text-primary tracking-tight font-black">TutorMatch</h1>
          <p className="font-body-reg text-on-surface-variant mt-1 font-medium">Bắt đầu hành trình học tập vượt trội</p>
        </div>
      </header>

      {/* Scrollable Form Area */}
      <main className="flex-1 px-6">
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Họ và tên */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant block">Họ và tên</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <UserIcon className="w-[18px] h-[18px]" />
              </span>
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-reg font-medium"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant block">
              Số điện thoại <span className="text-error">*</span>
            </label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Phone className="w-[18px] h-[18px]" />
              </span>
              <input
                type="tel"
                required
                placeholder="0123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-reg font-medium"
              />
            </div>
          </div>

          {/* Email (Optional) */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant block">Email (Không bắt buộc)</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Mail className="w-[18px] h-[18px]" />
              </span>
              <input
                type="email"
                placeholder="vi-du@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-reg font-medium"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant block">Mật khẩu</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Lock className="w-[18px] h-[18px]" />
              </span>
              <input
                type="password"
                required
                minLength={8}
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-reg font-medium"
              />
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-on-surface-variant block">Xác nhận mật khẩu</label>
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                <Lock className="w-[18px] h-[18px]" />
              </span>
              <input
                type="password"
                required
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-body-reg font-medium"
              />
            </div>
          </div>

          {/* Gửi mã OTP Button */}
          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="w-full py-3 px-4 border border-outline-variant text-primary hover:bg-surface-container font-semibold rounded-xl hover:bg-surface-container-high transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Send className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              Gửi mã OTP
            </button>
          ) : (
            <div className="pt-2 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center px-1">
                <label className="font-body-sm font-bold text-on-surface-variant">Mã xác thực (OTP)</label>
                <span className="text-secondary font-semibold text-xs text-secondary-container">
                  {timeLeft > 0 ? formatTimer(timeLeft) : "Đã quá hạn!"}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                {otpValues.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                ))}
              </div>
              
              {otpError && (
                <p className="text-xs text-error font-medium">{otpError}</p>
              )}

              {/* Primary Đăng ký Button */}
              <button
                type="submit"
                disabled={!isOtpComplete}
                className={`w-full py-4 text-on-primary font-bold rounded-xl mt-4 shadow-lg transition-all ${
                  isOtpComplete
                    ? "bg-primary hover:bg-primary-container cursor-pointer transform active:scale-95"
                    : "bg-outline/40 cursor-not-allowed opacity-65"
                }`}
              >
                Đăng ký
              </button>
            </div>
          )}
        </form>

        {/* Footer info links */}
        <div className="text-center space-y-6 pt-6">
          <p className="font-body-reg text-on-surface-variant font-medium">
            Đã có tài khoản?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-primary font-bold hover:underline cursor-pointer border-none bg-transparent"
            >
              Đăng nhập
            </button>
          </p>

          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-outline-variant/60"></div>
            <span className="font-caption text-outline uppercase tracking-widest text-[10px] font-bold">Hoặc</span>
            <div className="h-[1px] flex-1 bg-outline-variant/60"></div>
          </div>

          {/* Social */}
          <button
            type="button"
            onClick={() => {
              setFullname("Nguyễn Văn A");
              setPhone("0987654321");
              setEmail("nguyen_van_a@gmail.com");
              setPassword("password123");
              setConfirmPassword("password123");
              setOtpSent(true);
              setOtpValues(["1", "2", "3", "4", "5", "6"]);
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-outline-variant rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer font-semibold"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            <span className="font-body-reg font-bold text-on-surface">Tiếp tục với Google</span>
          </button>
        </div>
      </main>
    </div>
  );
};
