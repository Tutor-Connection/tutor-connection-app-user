import React, { useState } from "react";
import { User, ScreenState } from "../types";
import { Eye, EyeOff, User as UserIcon, Lock } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
  onNavigateToRegister: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onLoginSuccess({
        name: emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : "Nguyễn Văn A",
        phone: emailOrPhone.includes("@") ? "0987654321" : emailOrPhone,
        email: emailOrPhone.includes("@") ? emailOrPhone : "nguyen_van_a@gmail.com",
        avatar: undefined,
        role: "tutor", // Default role
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-md bg-surface min-h-screen flex flex-col justify-center px-6 py-12 mx-auto overflow-hidden animate-fade-in pb-16">
      <div className="w-full flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center shadow-lg relative overflow-hidden active:scale-95 transition-transform">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-primary-container opacity-40"></div>
            <span className="material-symbols-outlined text-[54px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-h1-mobile text-h1-mobile text-on-surface tracking-tight font-black mb-1">
            Chào mừng trở lại
          </h1>
          <p className="font-body-reg text-on-surface-variant font-medium text-sm leading-relaxed px-4">
            Vui lòng đăng nhập để tiếp tục hành trình học tập
          </p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/Phone */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant block px-1">
                Email hoặc Số điện thoại
              </label>
              <div className="relative group">
                <span className="absolute left-3 inset-y-0 flex items-center text-outline group-focus-within:text-primary transition-colors pointer-events-none">
                  <UserIcon className="w-[18px] h-[18px]" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="name@example.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-reg font-medium transition-all duration-200"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-on-surface-variant block px-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <span className="absolute left-3 inset-y-0 flex items-center text-outline group-focus-within:text-primary transition-colors pointer-events-none">
                  <Lock className="w-[18px] h-[18px]" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3.5 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-body-reg font-medium transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer bg-transparent border-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Checks & Password Link */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
                />
                <span className="ml-2 font-body-sm text-on-surface-variant font-medium group-hover:text-on-surface transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <button
                type="button"
                className="font-body-sm text-primary font-bold hover:underline decoration-2 underline-offset-4 bg-transparent border-none cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-on-primary font-body-lg font-bold py-3.5 rounded-xl shadow-lg transition-all duration-150 mt-2 flex justify-center items-center ${
                isSubmitting
                  ? "bg-primary/80 cursor-not-allowed opacity-90"
                  : "bg-primary hover:bg-primary-container cursor-pointer transform active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/60"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-outline font-body-sm text-xs font-bold uppercase tracking-wider">
                Hoặc
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setEmailOrPhone("nguyen_van_a@gmail.com");
              setPassword("password123");
            }}
            className="w-full bg-white border border-outline-variant text-on-surface font-body-reg font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-surface-container-low active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.024 1.032-2.312 1.816-4.912 1.816-4.328 0-7.72-3.536-7.72-7.864s3.392-7.864 7.72-7.864c2.28 0 4.136.88 5.616 2.312l2.304-2.304C19.168 2.24 16.32 1 12.48 1 5.56 1 0 6.56 0 13.48S5.56 25.96 12.48 25.96c3.744 0 6.576-1.232 8.768-3.52 2.256-2.256 2.968-5.416 2.968-8.032 0-.776-.064-1.512-.184-2.208H12.48z"
                fill="#EA4335"
              ></path>
            </svg>
            Đăng nhập với Google
          </button>
        </div>

        <p className="mt-8 font-body-reg text-on-surface-variant font-medium text-center text-sm">
          Chưa có tài khoản?{" "}
          <button
            onClick={onNavigateToRegister}
            className="font-bold text-primary hover:underline decoration-2 underline-offset-4 ml-1 bg-transparent border-none cursor-pointer"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>

      <footer className="mt-auto pt-6 text-center opacity-60 shrink-0">
        <p className="text-[11px] text-on-surface-variant font-medium">© 2026 TutorSync. All rights reserved.</p>
      </footer>
    </div>
  );
};
