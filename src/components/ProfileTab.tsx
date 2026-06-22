import React, { useState } from 'react';
import { TutorProfile, SupportTicket } from '../types';
import { translations } from '../data';

interface ProfileTabProps {
  profile: TutorProfile;
  lang: 'vi' | 'en';
  darkMode: boolean;
  tickets: SupportTicket[];
  onUpdateProfile: (newProf: Partial<TutorProfile>) => void;
  onSetLanguage: (lang: 'vi' | 'en') => void;
  onSetDarkMode: (dark: boolean) => void;
  onAddTicket: (ticket: SupportTicket) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  lang,
  darkMode,
  tickets,
  onUpdateProfile,
  onSetLanguage,
  onSetDarkMode,
  onAddTicket,
}) => {
  const t = translations[lang];

  // Current active subview of Profile:
  // "base" = Primary Settings list (Screen 9)
  // "form" = Setup / Edit Profile form (Screen 8)
  // "support" = Support ticket center (Screen 11)
  // "support-success" = Ticket submitted successfully view
  const [subView, setSubView] = useState<'base' | 'form' | 'support' | 'support-success'>('base');

  // SETUP PROFILE FORM STATES (Screen 8)
  const [formName, setFormName] = useState<string>(profile.fullName);
  const [formGender, setFormGender] = useState<string>('Male');
  const [formDob, setFormDob] = useState<string>(profile.dob);
  const [formGps, setFormGps] = useState<string>(profile.gpsAddress);
  const [formSubjects, setFormSubjects] = useState<string[]>(profile.subjects);
  const [formFee, setFormFee] = useState<number>(profile.hourlyFee);
  const [formExp, setFormExp] = useState<string>(profile.experience);
  const [formEdu, setFormExpEdu] = useState<string>(profile.education);
  const [formUni, setFormUni] = useState<string>(profile.university);
  const [formBio, setFormBio] = useState<string>(profile.bio);
  const [gpsLoading, setGpsLoading] = useState<boolean>(false);

  // SUPPORT TICKET FORM STATES (Screen 11)
  const [ticketType, setTicketType] = useState<string>('');
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketDesc, setTicketDesc] = useState<string>('');
  const [ticketFiles, setTicketFiles] = useState<Array<{ name: string; size: string }>>([
    { name: 'master_degree.pdf', size: '2.4 MB' }
  ]);
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('#TS-84920-TK');
  const [ticketSubmitting, setTicketSubmitting] = useState<boolean>(false);

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  // PROFILE - GPS Simulator
  const handleGPSDetect = () => {
    setGpsLoading(true);
    setFormGps(lang === 'vi' ? 'Đang định vị...' : 'Locating...');
    setTimeout(() => {
      setGpsLoading(false);
      setFormGps('415 Mission St, San Francisco, CA 94105');
    }, 1500);
  };

  const handleToggleSubjectChip = (subj: string) => {
    if (formSubjects.includes(subj)) {
      setFormSubjects(formSubjects.filter(x => x !== subj));
    } else {
      setFormSubjects([...formSubjects, subj]);
    }
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName: formName,
      dob: formDob,
      gpsAddress: formGps,
      subjects: formSubjects,
      hourlyFee: formFee,
      experience: formExp,
      education: formEdu,
      university: formUni,
      bio: formBio,
      kycStatus: 'pending', // Pending approval after saving!
    });
    alert(lang === 'vi' ? 'Hồ sơ đã được lưu và đang chờ phê duyệt xác minh (KYC)!' : 'Profile saved successfully and is pending KYC verification review!');
    setSubView('base');
  };

  // HELP CENTER SUPPORT - Submit handler
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketDesc.length < 20) {
      alert(lang === 'vi' ? 'Vui lòng mô tả chi tiết ít nhất 20 ký tự.' : 'Please enter a detailed description of at least 20 characters.');
      return;
    }

    setTicketSubmitting(true);
    const randomizedId = `#TS-${Math.floor(10000 + Math.random() * 90000)}-TK`;
    setLastSubmittedId(randomizedId);

    setTimeout(() => {
      setTicketSubmitting(false);
      onAddTicket({
        id: randomizedId,
        type: ticketType,
        subject: ticketSubject,
        description: ticketDesc,
        status: 'in_progress',
        date: new Date().toLocaleDateString('vi-VN'),
      });
      setSubView('support-success');
      // clear support inputs
      setTicketType('');
      setTicketSubject('');
      setTicketDesc('');
    }, 1200);
  };

  const handleUploadFileSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      const mapped = fileList.map((f: any) => ({ name: fileNameSlicer(f.name), size: (f.size / 1024 / 1024).toFixed(1) + ' MB' }));
      setTicketFiles([...ticketFiles, ...mapped]);
    }
  };

  const fileNameSlicer = (name: string) => {
    if (name.length > 20) {
      return name.slice(0, 12) + '...' + name.slice(-6);
    }
    return name;
  };

  const handleLogoutSim = () => {
    const confirmOut = window.confirm(lang === 'vi' ? 'Bạn có chắc chắn muốn đăng xuất?' : 'Are you sure you want to sign out?');
    if (confirmOut) {
      alert(lang === 'vi' ? 'Đã đăng xuất thành công!' : 'Signed out successfully!');
      window.location.reload();
    }
  };

  // SUBVIEW: setup / edit profile input form modal (Screen 8)
  if (subView === 'form') {
    return (
      <div className="flex-grow w-full pb-32 animate-fade-in text-xs font-sans">
        <header className="w-full sticky top-0 z-50 bg-surface shadow-sm flex items-center justify-between px-4 py-3 h-16 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button 
              id="back-profile-form"
              onClick={() => setSubView('base')} 
              className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 cursor-pointer"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-primary font-display">{t.completeProfTitle}</h1>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
          <section className="space-y-1">
            <h2 className="text-2xl font-bold text-primary">{t.completeProfTitle}</h2>
            <p className="text-xs text-on-surface-variant">{t.setupSubtitle}</p>
          </section>

          {/* KYC alert banner */}
          <section className="bg-surface-container rounded-xl p-4 flex items-center justify-between border border-outline-variant/30 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-error-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error">verified_user</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{t.kycStatusLabel}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${profile.kycStatus === 'verified' ? 'bg-green-500' : 'bg-error'}`}></span>
                  <span className="text-[10px] uppercase font-bold text-error">
                    {profile.kycStatus === 'unverified' ? t.unverified : (profile.kycStatus === 'pending' ? t.verPending : t.verified)}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white px-3 py-1 rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/30">
              {lang === 'vi' ? 'Đang chờ xử lý' : 'Pending Approval'}
            </div>
          </section>

          <form onSubmit={handleSaveProfileForm} className="space-y-6">
            
            {/* Section 1: Basic Info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-5">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary text-xl">person</span>
                <h3 className="text-sm font-bold text-on-surface font-display">{t.basicInfo}</h3>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-high bg-surface-container">
                      <img className="w-full h-full object-cover animate-fade-in" src={profile.avatar} alt="Alexander portrait" />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform" type="button">
                      <span className="material-symbols-outlined text-md">photo_camera</span>
                    </button>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-bold">Profile Photo</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.fullName}</label>
                    <input 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none transition-colors" 
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.gender}</label>
                    <select 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none"
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value)}
                    >
                      <option value="Male">{t.male}</option>
                      <option value="Female">{t.female}</option>
                      <option value="Other">{t.otherGender}</option>
                      <option value="NotSay">{t.notSayGender}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.dobLabel}</label>
                    <input 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none" 
                      type="date"
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.addressLabel}</label>
                    <div className="relative">
                      <input 
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 pr-10 text-sm focus:bg-white outline-none truncate" 
                        type="text"
                        placeholder={t.addrPlace}
                        value={formGps}
                        onChange={(e) => setFormGps(e.target.value)}
                      />
                      <button 
                        type="button"
                        onClick={handleGPSDetect}
                        disabled={gpsLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:opacity-80 active:scale-90"
                      >
                        <span className={`material-symbols-outlined text-lg ${gpsLoading ? 'animate-spin' : ''}`}>my_location</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Teaching Info */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-5">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary text-xl">menu_book</span>
                <h3 className="text-sm font-bold text-on-surface font-display">{t.teachingExpertise}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-on-surface-variant">{t.subjectsLabel}</label>
                  <div className="flex flex-wrap gap-2">
                    {['Math', 'Physics', 'Chemistry', 'English', 'Biology'].map((subj) => {
                      const isSelected = formSubjects.includes(subj);
                      return (
                        <button 
                          key={subj}
                          type="button"
                          onClick={() => handleToggleSubjectChip(subj)}
                          className={`px-4 py-2 rounded-full font-bold text-xs select-none cursor-pointer border transition-all ${
                            isSelected 
                              ? 'bg-primary border-primary text-white font-semibold' 
                              : 'bg-surface-container-lowest border-primary text-primary hover:bg-primary/5'
                          }`}
                        >
                          {subj} {isSelected && <span className="ml-1 text-[11px] font-bold">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.feeExpect}</label>
                    <input 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none" 
                      type="number"
                      required
                      value={formFee}
                      onChange={(e) => setFormFee(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.teachExpLabel}</label>
                    <select 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none"
                      value={formExp}
                      onChange={(e) => setFormExp(e.target.value)}
                    >
                      <option value="< 1 year">{t.under1Year}</option>
                      <option value="1-3 years">{t.from1To3Years}</option>
                      <option value="3-5 years">{t.from3To5Years}</option>
                      <option value="> 5 years">{t.over5Years}</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.eduLevel}</label>
                    <input 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none"
                      type="text"
                      required
                      value={formEdu}
                      onChange={(e) => setFormExpEdu(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">{t.universityMajor}</label>
                    <input 
                      className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none" 
                      type="text"
                      required
                      value={formUni}
                      onChange={(e) => setFormUni(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">{t.profBio}</label>
                  <textarea 
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-low focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-sm focus:bg-white outline-none resize-none" 
                    rows={4}
                    placeholder={t.bioPlaceholder}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Identity & Certs Upload simulations */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-outline-variant/30 space-y-5">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <span className="material-symbols-outlined text-primary text-xl">badge</span>
                <h3 className="text-sm font-bold text-on-surface font-display">{t.kycIdentitySection}</h3>
              </div>

              <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary flex gap-3">
                <span className="material-symbols-outlined text-secondary text-lg">info</span>
                <p className="text-xs text-on-secondary-container leading-relaxed">{t.kycInfoAlert}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ID upload front/back */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant">{t.nationalId}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-[1.58/1] rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                      <span className="material-symbols-outlined text-outline group-hover:text-primary mb-1">add_a_photo</span>
                      <span className="text-[10px] text-outline group-hover:text-primary font-bold">{t.frontView}</span>
                    </div>
                    <div className="aspect-[1.58/1] rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group">
                      <span className="material-symbols-outlined text-outline group-hover:text-primary mb-1">add_a_photo</span>
                      <span className="text-[10px] text-outline group-hover:text-primary font-bold">{t.backView}</span>
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-on-surface-variant">{t.certDegrees}</label>
                  <div className="w-full h-[76px] rounded-lg border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group relative">
                    <span className="material-symbols-outlined text-outline group-hover:text-primary mb-1">upload_file</span>
                    <span className="text-[10px] text-outline group-hover:text-primary font-bold">{t.uploadMulti}</span>
                  </div>
                  <div className="flex gap-2.5 pt-1 overflow-x-auto pb-1 text-xs">
                    <div className="bg-primary/5 text-primary border border-primary/20 px-2 py-1 rounded flex items-center gap-1.5 shrink-0">
                      <span className="material-symbols-outlined text-xs">description</span>
                      <span className="text-[10px] font-medium truncate max-w-[80px]">master_degree.pdf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* save form */}
            <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant/10 px-4 py-3 z-40 flex justify-center items-center shadow-lg">
              <div className="max-w-xl w-full flex gap-3">
                <button 
                  type="submit"
                  className="flex-grow bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-xl shadow-md active:scale-95 duration-100 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {t.saveProfile}
                  <span className="material-symbols-outlined text-md">arrow_forward</span>
                </button>
              </div>
            </div>

          </form>
        </main>
      </div>
    );
  }

  // SUBVIEW: Help Center support ticket submission (Screen 11)
  if (subView === 'support') {
    const isReadyText = ticketDesc.trim().length >= 20;

    return (
      <div className="flex-grow w-full pb-32 animate-fade-in text-xs font-sans">
        <header className="w-full sticky top-0 z-50 bg-surface shadow-sm flex items-center justify-between px-4 py-3 h-16 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button 
              id="back-profile-support"
              onClick={() => setSubView('base')} 
              className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 cursor-pointer"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-primary font-display">{t.helpCenter}</h1>
          </div>
        </header>

        <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
          <section className="space-y-1">
            <h1 className="text-2xl font-bold text-on-surface">{lang === 'vi' ? 'Trung tâm hỗ trợ' : 'Support Center'}</h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">{t.descPlace}</p>
          </section>

          <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-5 shadow-sm">
            <form onSubmit={handleSupportSubmit} className="space-y-5">
              
              {/* Type dropdown */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface">{t.issueType}</label>
                <div className="relative">
                  <select 
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer font-medium"
                    required
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <option disabled value="">{t.selectCategory}</option>
                    <option value="student_complaint">{t.studentComplaint}</option>
                    <option value="app_bug">{t.appBug}</option>
                    <option value="payment">{t.paymentComm}</option>
                    <option value="other">{t.otherIssue}</option>
                  </select>
                </div>
              </div>

              {/* Subject text */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface">{t.subject}</label>
                <input 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all focus:bg-white"
                  required
                  placeholder={t.subjectPlace}
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>

              {/* Character validations */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="block text-sm font-semibold text-on-surface">{t.detailedDesc}</label>
                  <span className={`text-[10px] font-bold ${
                    ticketDescLengthOk(descriptionText => descriptionText.length >= 20) ? 'text-tertiary' : 'text-outline/80'
                  }`}>
                    {lang === 'vi' ? 'Tối thiểu 20 ký tự' : 'Min. 20 characters'}
                  </span>
                </div>
                <textarea 
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder={t.descPlace}
                  required
                  rows={5}
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                />
              </div>

              {/* File Upload drag-drop area */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface">{t.attachLabel}</label>
                <div className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-low hover:bg-surface-container hover:border-primary transition-all cursor-pointer relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    multiple 
                    onChange={handleUploadFileSim}
                  />
                  <span className="material-symbols-outlined text-3xl text-outline group-hover:text-primary transition-colors mb-2">cloud_upload</span>
                  <p className="font-bold text-xs text-on-surface-variant text-center">{lang === 'vi' ? 'Nhấn để tải lên hoặc kéo thả tệp tại đây' : 'Click to upload or drag and drop files here'}</p>
                  <p className="text-[10px] text-outline mt-1 font-medium">PNG, JPG, PDF up to 10MB each</p>
                </div>

                {/* Simulated uploads queue */}
                {ticketFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {ticketFiles.map((file, idx) => (
                      <div key={idx} className="relative bg-surface-container border border-outline-variant/65 rounded-lg px-3 py-1.5 flex items-center gap-2 max-w-sm xl text-xs">
                        <span className="material-symbols-outlined text-primary text-sm">description</span>
                        <div className="min-w-0">
                          <p className="font-bold text-[10px] truncate max-w-[120px]">{file.name}</p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setTicketFiles(ticketFiles.filter((_, i) => i !== idx))}
                          className="material-symbols-outlined text-xs text-error p-0.5 hover:bg-red-50 rounded-full cursor-pointer shrink-0"
                        >
                          close
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tip info alerts */}
              <div className="bg-primary-fixed text-on-primary-fixed-variant p-4 rounded-xl flex gap-3 items-start border border-primary/10">
                <span className="material-symbols-outlined text-primary shrink-0 text-xl">info</span>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-on-surface">{t.proactiveTipTitle}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{t.proactiveTipDesc}</p>
                </div>
              </div>

              {/* submit button */}
              <button 
                type="submit"
                disabled={ticketSubmitting}
                className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-container`}
              >
                {ticketSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    <span>{lang === 'vi' ? 'Đang gửi...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <span>{t.sendRequest}</span>
                    <span className="material-symbols-outlined text-md">send</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </main>
      </div>
    );
  }

  // SUBVIEW: support ticket submitted success screen (Screen 11 Success State)
  if (subView === 'support-success') {
    return (
      <div className="flex-grow w-full pb-32 animate-fade-in text-xs font-sans">
        <header className="w-full sticky top-0 z-50 bg-surface shadow-sm flex items-center justify-between px-4 py-3 h-16 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSubView('base')} 
              className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 cursor-pointer"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-primary font-display">{t.ticketSubmitted}</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 py-12 text-center space-y-6">
          <div className="w-20 h-20 bg-tertiary-container/10 border-2 border-tertiary text-tertiary rounded-full flex items-center justify-center mx-auto shadow-sm animate-scale-in">
            <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-on-surface">{t.ticketSubmitted}</h2>
            <p className="text-xs text-on-surface-variant leading-relaxed px-4">{t.ticketSubmittedDesc}</p>
          </div>

          {/* Ticket detail overview metrics */}
          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-on-surface-variant font-medium">{t.ticketIdLabel}</span>
              <span className="font-mono font-bold text-primary text-sm">{lastSubmittedId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-medium">{t.ticketStatusLabel}</span>
              <div className="flex items-center gap-1.5 text-secondary font-bold">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>{t.ticketInProgress}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => setSubView('support')}
              className="py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl border border-outline-variant/35 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              {t.backToForm}
            </button>
            <button 
              onClick={() => setSubView('base')}
              className="py-3 bg-primary text-white hover:bg-primary-container rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              {lang === 'vi' ? 'Quay lại Cài đặt' : 'Back to Settings'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  // PRIMARY BASE SETTINGS & PROFILE VIEW (Screen 9)
  return (
    <div className="flex-grow w-full pb-32 animate-fade-in font-sans">
      <main className="max-w-xl mx-auto px-4 py-4 space-y-6">
        
        {/* Profile Card mapping Screen 9 header detail */}
        <section className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/30 text-center md:text-left flex flex-col md:flex-row items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shadow-lg">
              <img className="w-full h-full object-cover animate-fade-in" src={profile.avatar} alt={profile.fullName} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-tertiary text-white p-1 rounded-full border-2 border-white shadow-sm flex items-center justify-center" title="Verified Tutor">
              <span className="material-symbols-outlined text-xs font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>

          <div className="space-y-1 flex-grow">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <h2 className="text-xl font-bold text-on-surface font-display">{profile.fullName}</h2>
              <span className="inline-flex self-center bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {t.verifiedTutorBadge}
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-1 text-secondary font-bold text-xs">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-sm font-semibold">{profile.rating}</span>
              <span className="text-on-surface-variant font-medium text-[10px]">({profile.reviewsCount} {lang === 'vi' ? 'đánh giá' : 'reviews'})</span>
            </div>
            
            <p className="text-on-surface-variant text-[11px] font-medium leading-relaxed">
              {lang === 'vi' ? t.expertPhysMath : t.expertPhysMath}
            </p>
          </div>
        </section>

        {/* Menu setting columns */}
        <div className="space-y-5">
          
          {/* Group 1: tutor details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">{t.accSettings}</h3>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm text-sm">
              <button 
                id="edit-profile-trigger-acc-btn"
                onClick={() => setSubView('form')}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/20 cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <span className="font-semibold text-on-surface">{t.personalInfoOpt}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>

              <button 
                id="edit-profile-trigger-teach-btn"
                onClick={() => setSubView('form')}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/20 cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined">history_edu</span>
                  </div>
                  <span className="font-semibold text-on-surface">{t.teachProfileOpt}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>

              <button 
                onClick={() => alert(lang === 'vi' ? 'Tính năng quản lý tài khoản ngân hàng liên kết đang được bảo trì.' : 'Payment gateway ledger is currently under maintenance.')}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <span className="font-semibold text-on-surface">{t.payMethodsOpt}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Group 2: layouts pref */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">{t.prefHeader}</h3>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm text-sm">
              <button 
                onClick={() => {
                  const pass = prompt(lang === 'vi' ? 'Nhập mật khẩu mới của bạn:' : 'Enter your new password:');
                  if (pass) alert(lang === 'vi' ? 'Thay đổi mật khẩu thành công!' : 'Password changed successfully!');
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/20 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                  <span className="font-semibold text-on-surface text-left">{t.changePassword}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>

              {/* Language Selection */}
              <div className="w-full flex items-center justify-between p-3 border-b border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                    <span className="material-symbols-outlined">language</span>
                  </div>
                  <span className="font-semibold text-on-surface text-left">{t.language}</span>
                </div>
                <select 
                  id="language-selector"
                  className="bg-surface-container border-none rounded-lg py-1 px-2.5 text-xs text-primary font-bold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                  value={lang}
                  onChange={(e) => onSetLanguage(e.target.value as 'vi' | 'en')}
                >
                  <option value="vn">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Dark mode switch */}
              <div className="w-full flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                    <span className="material-symbols-outlined">{darkMode ? 'dark_mode' : 'light_mode'}</span>
                  </div>
                  <span className="font-semibold text-on-surface text-left">{t.darkAppearance}</span>
                </div>
                {/* Simulated Tailwind Toggle Button switch */}
                <button 
                  id="dark-mode-toggle"
                  onClick={() => onSetDarkMode(!darkMode)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    darkMode ? 'bg-primary' : 'bg-outline-variant'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Group 3: support center & creation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-outline px-1">{t.supportHeader}</h3>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm text-sm">
              <button 
                id="support-ticket-trigger-btn"
                onClick={() => setSubView('support')}
                className="w-full flex items-center justify-between p-4 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/20 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">contact_support</span>
                  </div>
                  <span className="font-semibold text-on-surface text-left">{t.helpCenter}</span>
                </div>
                <div className="bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">New</div>
              </button>

              <button 
                onClick={() => alert('Terms of Service Agreement has been audited on 2026.')}
                className="w-full flex items-center justify-between p-3.5 hover:bg-surface-container/50 transition-colors border-b border-outline-variant/20 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface shrink-0">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <span className="font-semibold text-on-surface text-left">{t.termsLabel}</span>
                </div>
                <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">chevron_right</span>
              </button>

              <button 
                id="logout-btn"
                onClick={handleLogoutSim}
                className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center text-error shrink-0">
                    <span className="material-symbols-outlined">logout</span>
                  </div>
                  <span className="font-bold text-error text-left">{t.logout}</span>
                </div>
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );

  function ticketDescLengthOk(validateFn: (descText: string) => boolean) {
    return validateFn(ticketDesc);
  }
};
