import React, { useState } from 'react';
import { TrialClass } from '../types';
import { translations } from '../data';

interface TrialsTabProps {
  trials: TrialClass[];
  lang: 'vi' | 'en';
  onConvertTrialToActive: (trialId: string, studentName: string, subject: string) => void;
}

export const TrialsTab: React.FC<TrialsTabProps> = ({
  trials,
  lang,
  onConvertTrialToActive,
}) => {
  const t = translations[lang];

  // Store processing task state to simulate loading button
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleConfirmEndTrial = (item: TrialClass) => {
    setProcessingId(item.id);
    
    // Process loading stimulation
    setTimeout(() => {
      setProcessingId(null);
      setSuccessId(item.id);

      setTimeout(() => {
        onConvertTrialToActive(item.id, item.studentName, item.subject);
        setSuccessId(null);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex-grow w-full pb-32 animate-fade-in">
      <main className="max-w-xl mx-auto px-4 py-3 space-y-6">
        
        {/* Intro */}
        <section className="space-y-1">
          <h1 className="text-2xl font-bold text-on-surface">{lang === 'vi' ? 'Lớp học thử' : t.trialTitle}</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">{t.trialSubtitle}</p>
        </section>

        {/* Warning caution card */}
        <div className="bg-surface-container-low border border-outline-variant/60 rounded-xl p-4 flex gap-3 items-start shadow-sm">
          <span className="material-symbols-outlined text-secondary shrink-0 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div className="space-y-1">
            <p className="text-xs text-on-surface font-semibold">{t.trialNoteTitle}</p>
            <p className="text-xs text-on-surface-variant leading-relaxed">{t.trialNoteDesc}</p>
          </div>
        </div>

        {/* Trial List Queue */}
        <div className="space-y-4">
          {trials.length === 0 ? (
            <div className="text-center p-8 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
              <span className="material-symbols-outlined !text-4xl text-outline mb-2">done_all</span>
              <p className="text-xs text-on-surface-variant font-medium">
                {lang === 'vi' ? 'Không có lớp học thử nào cần duyệt' : 'All trial classes are successfully reviewed'}
              </p>
            </div>
          ) : (
            trials.map((item) => {
              const fraction = item.completedSessions / item.totalSessions;
              const percentText = Math.round(fraction * 100) + '% ' + (lang === 'vi' ? 'Hoàn thành' : 'Complete');
              const isEligible = item.completedSessions === item.totalSessions;

              const isProcessing = processingId === item.id;
              const isSuccess = successId === item.id;

              return (
                <div 
                  key={item.id} 
                  className={`bg-surface-container-lowest shadow-sm rounded-xl p-4 border border-outline-variant/30 hover:border-primary/20 transition-all ${
                    isSuccess ? 'scale-95 opacity-50 duration-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-variant shrink-0">
                        <img className="w-full h-full object-cover" src={item.avatar} alt="avatar" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-on-surface leading-tight">{item.studentName}</h3>
                        <div className="flex items-center gap-1 text-on-surface-variant text-xs mt-1">
                          <span className="material-symbols-outlined text-sm font-semibold">book</span>
                          <span className="truncate">{item.subject}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="bg-secondary-container text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Trial
                      </span>
                      <p className="text-xs text-on-surface-variant mt-1.5 font-medium">
                        Session <span className="font-bold text-on-surface">{item.completedSessions}/{item.totalSessions}</span>
                      </p>
                    </div>
                  </div>

                  {/* Progress segment */}
                  <div className="bg-surface-container-low rounded-lg p-2 mb-3 flex items-center gap-3 text-xs">
                    <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-container transition-all duration-300" style={{ width: `${fraction * 100}%` }}></div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-bold shrink-0">{percentText}</span>
                  </div>

                  {/* Dynamic conditional actions button */}
                  {isEligible ? (
                    <button 
                      id={`confirm-end-trial-btn-${item.id}`}
                      disabled={isProcessing || isSuccess}
                      className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm ${
                        isSuccess 
                          ? 'bg-tertiary-container text-white' 
                          : 'bg-primary text-white hover:bg-primary-container active:scale-[0.98]'
                      }`}
                      onClick={() => handleConfirmEndTrial(item)}
                    >
                      {isProcessing ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                          <span>{lang === 'vi' ? 'Đang xử lý...' : 'Processing...'}</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          <span>{lang === 'vi' ? 'Thành công' : 'Success'}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.confirmEndTrial}</span>
                          <span className="material-symbols-outlined text-sm">verified</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-1">
                      <button 
                        className="w-full bg-outline-variant text-[11px] text-on-surface-variant/60 font-bold py-2.5 px-3 rounded-lg cursor-not-allowed flex items-center justify-center gap-1 border border-outline-variant" 
                        disabled
                      >
                        <span>{t.confirmEndTrial}</span>
                        <span className="material-symbols-outlined text-sm">lock</span>
                      </button>
                      <p className="text-center text-[10px] text-on-surface-variant font-medium pt-1">
                        {t.completeAllSessions}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom illustration guidelines */}
        <div className="mt-8 text-center pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-high mb-3 shadow-inner">
            <span className="material-symbols-outlined text-primary text-3xl">assignment_turned_in</span>
          </div>
          <h4 className="font-bold text-sm text-on-surface">{t.lookingForRegular}</h4>
          <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">{t.lookRegularDesc}</p>
        </div>

      </main>
    </div>
  );
};
