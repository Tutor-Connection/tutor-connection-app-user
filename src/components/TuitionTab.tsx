import React, { useState } from 'react';
import { ClassInfo } from '../types';
import { translations } from '../data';

interface TuitionTabProps {
  classes: ClassInfo[];
  lang: 'vi' | 'en';
  onUpdateClassStatus: (id: string, newStatus: 'paid' | 'unpaid' | 'overdue') => void;
  onUpdateBalance: (amount: number) => void;
  onRedirectToTab: (index: number) => void;
}

export const TuitionTab: React.FC<TuitionTabProps> = ({
  classes,
  lang,
  onUpdateClassStatus,
  onUpdateBalance,
  onRedirectToTab,
}) => {
  const t = translations[lang];

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unpaid' | 'paid' | 'overdue'>('all');
  const [tuitionToast, setTuitionToast] = useState<string | null>(null);
  const [selectedClassHist, setSelectedClassHist] = useState<ClassInfo | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  // Filtered class lists
  const filteredClasses = classes.filter((item) => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'paid') return matchesSearch && item.status === 'paid';
    if (activeFilter === 'unpaid') return matchesSearch && item.status === 'unpaid';
    if (activeFilter === 'overdue') return matchesSearch && item.status === 'overdue';
    return matchesSearch;
  });

  // Calculate earnings this month from paid classes (or predefined constant 15.200.000đ plus payments)
  // Let's establish a base of 11.000.000đ plus all paid class fees!
  const paidClassEarnings = classes
    .filter(x => x.status === 'paid')
    .reduce((sum, item) => sum + item.tuitionFee, 11000000); // 11m + paid classes, Nguyễn Minh Anh is initially paid (2.4M), so total is 13.4M, other payments will push it higher as in screen 4!
  
  const handleConfirmReceivedClass = (item: ClassInfo) => {
    onUpdateClassStatus(item.id, 'paid');
    onUpdateBalance(item.tuitionFee);
    setTuitionToast(lang === 'vi' 
      ? `Đã nhận +${formatVND(item.tuitionFee)} từ học sinh ${item.studentName}! Tiền đã cộng vào ví.`
      : `Successfully collected +${item.tuitionFee.toLocaleString()}đ from ${item.studentName}! Wallet balance updated.`
    );
    setTimeout(() => {
      setTuitionToast(null);
    }, 4500);
  };

  const handleSendReminder = (item: ClassInfo) => {
    setTuitionToast(lang === 'vi'
      ? `Đã gửi thông báo nhắc đóng học phí thành công đến phụ huynh học sinh ${item.studentName}.`
      : `Sent tuition fee payment reminder notification to ${item.studentName}'s parents.`
    );
    setTimeout(() => {
      setTuitionToast(null);
    }, 4000);
  };

  const handleExportReport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      alert(lang === 'vi' ? 'Báo cáo thu nhập tháng này (PDF) đã được tải xuống thiết bị của bạn thành công!' : 'Income statement report for this month (PDF) has been downloaded successfully!');
    }, 1500);
  };

  return (
    <div className="flex-grow w-full pb-32 animate-fade-in">
      {/* Earnings Hero card */}
      <section className="bg-surface-container-lowest p-4 border-b border-outline-variant/20 mb-6">
        <div className="max-w-xl mx-auto space-y-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary-container p-5 text-white shadow-md">
            <div className="absolute top-0 right-0 p-5 opacity-10 transform translate-x-4 -translate-y-4">
              <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <div className="relative z-10 space-y-1">
              <p className="text-xs text-on-primary-container/80 uppercase tracking-wider font-semibold font-display">
                {t.earningsThisMonth}
              </p>
              <h2 className="text-3xl font-extrabold text-white">
                {formatVND(paidClassEarnings)}
              </h2>
              
              <div className="flex flex-wrap gap-2 pt-2 items-center">
                <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-xs">trending_up</span> +12.5% {lang === 'vi' ? 'so với tháng trước' : 'vs last month'}
                </span>
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-[10px] flex items-center gap-1 border border-white/10 truncate max-w-sm">
                  <span className="material-symbols-outlined text-xs">calendar_month</span> {lang === 'vi' ? 'Ngày thu định kỳ: 25 hàng tháng' : 'Scheduled collected: 25th monthly'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main dashboard areas */}
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Dynamic notify toast */}
        {tuitionToast && (
          <div id="tuition-toast-alert" className="p-4 bg-tertiary-container text-on-tertiary-container border border-tertiary/20 rounded-xl shadow-md font-semibold text-xs flex gap-2 items-center animate-bounce leading-relaxed">
            <span className="material-symbols-outlined">info</span>
            <p>{tuitionToast}</p>
          </div>
        )}

        {/* Header content and search */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary font-display">{t.classListHeader}</h3>
            <div className="flex gap-2">
              <button 
                id="redirect-to-wallet-dashboard"
                onClick={() => onRedirectToTab(1)} // Redirect to Wallet
                className="p-2 rounded-lg bg-surface-container border border-outline-variant hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer text-xs font-bold text-primary flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>{lang === 'vi' ? 'Ví nhận tiền' : 'Wallet'}</span>
              </button>
            </div>
          </div>

          {/* Search elements */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input 
                id="search-classes-input"
                className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-xl text-sm placeholder:text-outline bg-surface-container-low focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder={t.searchPlace}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Download report button */}
            <button 
              id="export-tuition-report"
              disabled={exporting}
              className="p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm cursor-pointer"
              title={t.exportReport}
              onClick={handleExportReport}
            >
              <span className={`material-symbols-outlined text-primary text-xl ${exporting ? 'animate-spin' : ''}`}>
                {exporting ? 'sync' : 'article'}
              </span>
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button 
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              {t.filterAll}
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'unpaid' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveFilter('unpaid')}
            >
              {t.statusUnpaid}
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'paid' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveFilter('paid')}
            >
              {t.statusPaid}
            </button>
            <button 
              className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                activeFilter === 'overdue' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => setActiveFilter('overdue')}
            >
              {t.statusOverdue}
            </button>
          </div>
        </div>

        {/* Classes Card Lists */}
        <section className="space-y-4">
          {filteredClasses.length === 0 ? (
            <div className="text-center p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
              <span className="material-symbols-outlined !text-4xl text-outline mb-2">person_off</span>
              <p className="text-xs text-on-surface-variant font-medium">
                {lang === 'vi' ? 'Không tìm thấy lớp học phù hợp' : 'No classes found matching selections'}
              </p>
            </div>
          ) : (
            filteredClasses.map((item) => {
              // visual statuses
              let statusLabel = '';
              let statusStyle = '';
              if (item.status === 'paid') {
                statusLabel = t.statusPaid;
                statusStyle = 'bg-tertiary/10 text-tertiary';
              } else if (item.status === 'unpaid') {
                statusLabel = t.statusUnpaid;
                statusStyle = 'bg-error/10 text-error';
              } else {
                statusLabel = t.statusOverdue;
                statusStyle = 'bg-orange-100 text-secondary-container';
              }

              return (
                <div 
                  key={item.id} 
                  className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/30 hover:border-primary/20 transition-all flex flex-col gap-3 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-primary shrink-0 font-bold ${item.avatarBg}`}>
                        <span className="material-symbols-outlined text-[28px]">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-on-surface">{item.studentName}</h4>
                        <p className="text-[11px] text-on-surface-variant">{item.subject} • Mã: {item.code}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${statusStyle}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Summary fees grid */}
                  <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl text-xs">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{lang === 'vi' ? 'Học phí' : 'Tuition Fee'}</p>
                      <p className="font-bold text-primary text-sm mt-0.5">{formatVND(item.tuitionFee)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{lang === 'vi' ? 'Hạn thanh toán' : 'Regular day'}</p>
                      <p className="font-semibold text-on-surface text-xs mt-0.5">{item.paymentDay}</p>
                    </div>
                  </div>

                  {/* Interactive actions for states */}
                  <div className="flex gap-2 pt-1">
                    {item.status !== 'paid' ? (
                      <>
                        <button 
                          className="flex-1 py-2 bg-primary text-white hover:bg-primary-container text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                          onClick={() => handleConfirmReceivedClass(item)}
                        >
                          {t.confirmReceived}
                        </button>
                        <button 
                          className="py-2 px-3 border border-outline-variant hover:border-error hover:bg-red-50 text-on-surface-variant hover:text-error text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          onClick={() => handleSendReminder(item)}
                        >
                          {t.remindTuition}
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="flex-grow py-2 border border-outline-variant hover:bg-surface-container text-on-surface-variant text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                          onClick={() => setSelectedClassHist(item)}
                        >
                          <span className="material-symbols-outlined text-sm">history</span>
                          <span>{lang === 'vi' ? 'Xem lịch sử lớp học' : 'Class history log'}</span>
                        </button>
                        <span className="bg-primary/5 text-primary text-xs font-extrabold py-2 px-4 rounded-lg flex items-center gap-1 border border-primary/10">
                          <span className="material-symbols-outlined text-sm font-semibold">check_circle</span>
                          <span>{t.confirm}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Q4 Goal Progress indicator layout */}
        <section className="bg-gradient-to-tr from-primary to-primary-container text-white p-5 rounded-2xl relative overflow-hidden h-40 flex flex-col justify-end shadow-md">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 80 Q 25 20, 50 60 T 100 40" fill="none" stroke="white" strokeWidth="2"></path>
              <path d="M0 90 Q 25 40, 50 70 T 100 30" fill="none" stroke="white" strokeWidth="1"></path>
            </svg>
          </div>
          <p className="text-lg font-bold relative z-10">{t.targetQ4}</p>
          <p className="text-xs text-primary-fixed-dim relative z-10 mb-3">{t.targetDesc}</p>
          <div className="w-full bg-white/20 h-2 rounded-full relative z-10 overflow-hidden">
            <div className="bg-tertiary-fixed h-full w-[85%] rounded-full shadow-[0_0_8px_rgba(111,251,190,0.5)]"></div>
          </div>
        </section>

        {/* Simple actions card */}
        <section className="grid grid-cols-2 gap-3">
          <button 
            id="tuition-export-action-btn"
            onClick={handleExportReport}
            className="bg-white border border-outline-variant p-4 rounded-xl text-center hover:bg-surface-container transition-all group shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-1 group-hover:scale-110 transition-transform">receipt_long</span>
            <p className="text-xs font-bold text-on-surface">{lang === 'vi' ? 'Xuất báo cáo PDF' : 'Download PDF Statement'}</p>
          </button>
          
          <button 
            id="tuition-withdraw-shortcut-btn"
            onClick={() => onRedirectToTab(1)} // Redirect to Wallet tab
            className="bg-white border border-outline-variant p-4 rounded-xl text-center hover:bg-surface-container transition-all group shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary mb-1 group-hover:scale-110 transition-transform">account_balance</span>
            <p className="text-xs font-bold text-on-surface">{t.withdraw}</p>
          </button>
        </section>
      </div>

      {/* Class History detail dialogue */}
      {selectedClassHist && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 border border-outline-variant shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-primary font-display">{lang === 'vi' ? 'Lịch sử đóng phí' : 'Class tuition history'}</h3>
              <button 
                onClick={() => setSelectedClassHist(null)}
                className="material-symbols-outlined text-outline hover:bg-surface-container p-1 rounded-full"
              >
                close
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              {lang === 'vi' 
                ? `Chu kỳ giao dịch của học sinh ${selectedClassHist.studentName} môn ${selectedClassHist.subject}`
                : `Tuition ledger cycles for student ${selectedClassHist.studentName} (${selectedClassHist.dueDate})`
              }
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 bg-surface-container-low rounded-xl">
                <span>{lang === 'vi' ? 'Tháng 10 (Chu kỳ này)' : 'October (Current cycle)'}</span>
                <span className="text-tertiary font-bold">{formatVND(selectedClassHist.tuitionFee)}</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl opacity-80">
                <span>{lang === 'vi' ? 'Tháng 9' : 'September cycle'}</span>
                <span className="text-tertiary font-bold">{formatVND(selectedClassHist.tuitionFee)}</span>
              </div>
              <div className="flex justify-between p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl opacity-80">
                <span>{lang === 'vi' ? 'Tháng 8' : 'August cycle'}</span>
                <span className="text-tertiary font-bold">{formatVND(selectedClassHist.tuitionFee)}</span>
              </div>
            </div>

            <button 
              onClick={() => setSelectedClassHist(null)}
              className="mt-4 w-full py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all cursor-pointer"
            >
              {lang === 'vi' ? 'Đóng' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
