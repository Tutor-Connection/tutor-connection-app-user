import React, { useState } from 'react';
import { Transaction, ClassInfo } from '../types';
import { translations } from '../data';

interface WalletTabProps {
  balance: number;
  transactions: Transaction[];
  classes: ClassInfo[];
  lang: 'vi' | 'en';
  onUpdateBalance: (amount: number) => void;
  onAddTransaction: (tx: Transaction) => void;
  onPayCommission: () => void;
  hasOverdueCommission: boolean;
}

export const WalletTab: React.FC<WalletTabProps> = ({
  balance,
  transactions,
  classes,
  lang,
  onUpdateBalance,
  onAddTransaction,
  onPayCommission,
  hasOverdueCommission,
}) => {
  const t = translations[lang];

  // Sub-Navigation within Wallet tab: 'summary' | 'deposit' | 'withdraw'
  const [subView, setSubView] = useState<'summary' | 'deposit' | 'withdraw'>('summary');

  // Deposit Form State
  const [depAmount, setDepAmount] = useState<string>('');
  const [depPayment, setDepPayment] = useState<'vnpay' | 'momo'>('vnpay');
  const [depToast, setDepToast] = useState<string | null>(null);

  // Withdraw Form State
  const [withAmount, setWithAmount] = useState<string>('1000000');
  const [selectedBank, setSelectedBank] = useState<string>('vcb'); // vcb = vietcombank
  const [showAddBank, setShowAddBank] = useState<boolean>(false);
  const [newBank, setNewBank] = useState({ name: '', account: '', owner: 'NGUYEN VAN A' });
  const [withToast, setWithToast] = useState<{ message: string; isError: boolean } | null>(null);
  const [customBanks, setCustomBanks] = useState<Array<{ id: string; name: string; acc: string; owner: string }>>([]);

  const formatVND = (num: number) => {
    return num.toLocaleString('vi-VN') + 'đ';
  };

  const handleSetAmountFromChip = (val: string) => {
    setDepAmount(val);
  };

  const handleConfirmDeposit = () => {
    const rawVal = parseInt(depAmount.replace(/\./g, '').replace(/,/g, ''), 10);
    if (isNaN(rawVal) || rawVal <= 0) {
      setDepToast(lang === 'vi' ? 'Vui lòng nhập số tiền hợp lệ' : 'Please input a valid amount');
      setTimeout(() => setDepToast(null), 2500);
      return;
    }

    // Success process!
    onUpdateBalance(balance + rawVal);
    onAddTransaction({
      id: `tx-dep-${Date.now()}`,
      type: 'deposit',
      title: lang === 'vi' ? 'Nạp tiền' : 'Deposit',
      amount: rawVal,
      date: lang === 'vi' ? 'Vừa xong' : 'Just now',
      status: 'success',
      sourceDest: lang === 'vi' ? `Nạp tiền qua ${depPayment.toUpperCase()}` : `Deposited via ${depPayment.toUpperCase()}`,
    });

    setDepToast(lang === 'vi' ? `Nạp thành công +${formatVND(rawVal)}!` : `Successfully deposited +${rawVal.toLocaleString()}đ!`);
    setTimeout(() => {
      setDepToast(null);
      setSubView('summary');
      setDepAmount('');
    }, 2000);
  };

  const handleConfirmWithdraw = () => {
    const rawVal = parseInt(withAmount, 10);
    if (isNaN(rawVal) || rawVal <= 0) {
      setWithToast({
        message: lang === 'vi' ? 'Vui lòng nhập số tiền hợp lệ' : 'Please input a valid amount',
        isError: true,
      });
      setTimeout(() => setWithToast(null), 2500);
      return;
    }

    if (rawVal > balance) {
      setWithToast({
        message: lang === 'vi' ? 'Số dư không đủ để thực hiện giao dịch' : 'Insufficient balance for this request',
        isError: true,
      });
      return;
    }

    // Success process!
    onUpdateBalance(balance - rawVal);
    
    // Determine target bank text
    let targetBankText = 'Vietcombank ****1234';
    if (selectedBank !== 'vcb' && customBanks.length > 0) {
      const b = customBanks.find(x => x.id === selectedBank);
      if (b) {
        targetBankText = `${b.name} ****${b.acc.slice(-4)}`;
      }
    }

    onAddTransaction({
      id: `tx-with-${Date.now()}`,
      type: 'withdraw',
      title: lang === 'vi' ? 'Rút tiền' : 'Withdrawal',
      amount: -rawVal,
      date: lang === 'vi' ? 'Vừa xong' : 'Just now',
      status: 'processing',
      sourceDest: lang === 'vi' ? `Rút về ${targetBankText}` : `Withdrawal to ${targetBankText}`,
    });

    setWithToast({
      message: lang === 'vi' ? `Yêu cầu rút ${formatVND(rawVal)} đang được xử lý!` : `Withdrawal request for ${rawVal.toLocaleString()}đ is in progress!`,
      isError: false,
    });

    setTimeout(() => {
      setWithToast(null);
      setSubView('summary');
    }, 2000);
  };

  const handlePayCommissionNow = () => {
    if (balance < 360000) {
      alert(lang === 'vi' ? 'Số dư ví hiện tại không đủ để thanh toán hoa hồng 360.000đ. Vui lòng nạp thêm tiền.' : 'Your wallet balance is insufficient to pay the 360,000đ commission. Please deposit first.');
      return;
    }

    onUpdateBalance(balance - 360000);
    onAddTransaction({
      id: `tx-comm-${Date.now()}`,
      type: 'commission',
      title: lang === 'vi' ? 'Phí hoa hồng' : 'Commission fee',
      amount: -360000,
      date: lang === 'vi' ? 'Vừa xong' : 'Just now',
      status: 'success',
      sourceDest: lang === 'vi' ? 'Đã thanh toán phí hệ thống lớp Toán 12' : 'Paid system fee for Math Class 12',
    });

    onPayCommission();
    alert(lang === 'vi' ? 'Thanh toán phí hệ thống 360.000đ thành công!' : 'Paid 360,000đ system commission successfully!');
  };

  const handleAddNewBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBank.name || !newBank.account || !newBank.owner) return;

    const id = `bank-${Date.now()}`;
    const newB = { id, name: newBank.name, acc: newBank.account, owner: newBank.owner };
    setCustomBanks([...customBanks, newB]);
    setSelectedBank(id);
    setShowAddBank(false);
    setNewBank({ name: '', account: '', owner: 'NGUYEN VAN A' });
  };

  const handleAmountInputChange = (val: string) => {
    // Remove non-numeric
    let numOnly = val.replace(/[^0-9]/g, '');
    if (numOnly) {
      const formatted = parseInt(numOnly, 10).toLocaleString('vi-VN');
      setDepAmount(formatted);
    } else {
      setDepAmount('');
    }
  };

  // RENDER DEPOSIT subview (Screen 1)
  if (subView === 'deposit') {
    return (
      <div className="flex-grow flex flex-col w-full pb-32 animate-fade-in">
        {/* Header */}
        <header className="w-full top-0 sticky bg-surface shadow-sm z-50 flex items-center justify-between px-4 py-3 h-16 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button 
              id="back-to-summary-dep"
              onClick={() => setSubView('summary')} 
              className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 cursor-pointer"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-primary">{t.depTitle}</h1>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfFcEy-R9iUS5fkQ_ObiOMAG7ivNXnHbHd2mTk_mJclxPSGnV7E2UVStRuWb0o5LB7YgfiG2i4vTA8THMAt6Gd1cEAqKofPdIE9oJFbDCGXIDWCT-QjMr0TXbu318fOeid5V_jjsgE5LpC63iVLEUbm5glIXtThD_Vp7zwjmP2dN00cTrJqLPRX3rV8axfqj0OgnwtrhAKK83DpF1_MgEVk8bZjcidmN7QHpeFDU4bz3VG5zomYkMompYLNIzjZ1aMpzN5xIp02mNC" 
              alt="tutor" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col p-4 max-w-lg mx-auto w-full gap-6">
          {/* Toast Notification */}
          {depToast && (
            <div id="dep-toast-msg" className="bg-primary text-white p-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
              <span className="material-symbols-outlined">circle_notifications</span>
              <p className="font-medium text-sm">{depToast}</p>
            </div>
          )}

          {/* Decoration Banner */}
          <div className="relative w-full h-40 rounded-xl overflow-hidden mb-2 bg-gradient-to-tr from-primary to-primary-container">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent flex flex-col justify-end p-4">
              <p className="text-on-primary font-bold text-lg">{t.upgradeTitle}</p>
              <p className="text-on-primary/80 text-xs mt-1">{t.upgradeDesc}</p>
            </div>
          </div>

          {/* Deposit Form */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant">{t.depAmount}</label>
              <div className="relative group">
                <input 
                  id="amountInput"
                  className="w-full h-14 pl-4 pr-12 rounded-xl border border-outline-variant bg-surface-container-lowest text-lg font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  placeholder={t.depPlace}
                  type="text"
                  value={depAmount}
                  onChange={(e) => handleAmountInputChange(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">đ</span>
              </div>
            </div>

            {/* Quick Chips */}
            <div className="grid grid-cols-4 gap-2">
              {['100.000', '200.000', '500.000', '1.000.000'].map((chipVal) => {
                const label = chipVal === '1.000.000' ? (lang === 'vi' ? '1tr' : '1m') : chipVal.replace('.000', '') + 'k';
                const isActive = depAmount === chipVal;
                return (
                  <button 
                    key={chipVal}
                    className={`py-2 px-1 border rounded-lg text-xs font-semibold hover:bg-surface-container transition-all active:scale-95 cursor-pointer ${
                      isActive ? 'border-primary bg-primary text-white' : 'border-outline-variant text-on-surface hover:border-primary/50'
                    }`} 
                    onClick={() => handleSetAmountFromChip(chipVal)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Payment gateways */}
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-on-surface-variant">{t.selectPayment}</h2>
            <div className="flex flex-col gap-2">
              {/* VNPay Option */}
              <div 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer bg-surface-container-lowest transition-all hover:border-primary/50 relative ${
                  depPayment === 'vnpay' ? 'border-primary ring-2 ring-primary/20 shadow-sm' : 'border-outline-variant'
                }`}
                onClick={() => setDepPayment('vnpay')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant flex items-center justify-center overflow-hidden">
                    <img className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTZ_vt8vWfN_kH4cOK4o6Mi11FZnqW8r4H4LSIH_NRs465oUFFybtOV_T8l0kWX2h0IITlQmxtrY8Ri1bTOu7rif8Xtr8J9nk0oIIlf-xbm3OfeVIOPWgfnMV_8P6ThPSagHJYPRT47ZBQbZjpbjiGP7W6P8CqFIPR3xB0HPFqnBpGW5Nf6Oe_gzc8-NfCkiy0r5hWbdxiq1pAQ5xHFPnoGd7MEJyphcHZyr0s2SLQib4WBCJx9crT4jNX9smBDMy12CtAbn8mCIOB" alt="vnpay" />
                  </div>
                  <span className="font-semibold text-sm">VNPay</span>
                </div>
                <span className={`material-symbols-outlined ${depPayment === 'vnpay' ? 'text-primary' : 'text-outline-variant'}`}>
                  {depPayment === 'vnpay' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>

              {/* MoMo Option */}
              <div 
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer bg-surface-container-lowest transition-all hover:border-primary/50 relative ${
                  depPayment === 'momo' ? 'border-primary ring-2 ring-primary/20 shadow-sm' : 'border-outline-variant'
                }`}
                onClick={() => setDepPayment('momo')}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant flex items-center justify-center overflow-hidden">
                    <img className="w-8 h-8 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_uyMcHZ1Y32U6cPbroTyftZVCkdAP0I4aQuSbefBk0jlesbWkaqPOusCewRR6z1cyVGsimONZWVbrGA1qHf-WsFn0Py_hvTSK2oVomIupAADHrFyhJKqjTlnvjbLcloQB5HypiBISUmgH4aAiDCAtr2Vs0VF-Rhm6XqLojTrzITf1yplvSB7UvI5eJzYjd0o8vaf8oXqdL0PKVgz9i7VCWFp4fiK05dG9DiC4pIxL7HZlU3iuaFiP3eeVcq21MXlnqtztj4LI767m" alt="momo" />
                  </div>
                  <span className="font-semibold text-sm">MoMo</span>
                </div>
                <span className={`material-symbols-outlined ${depPayment === 'momo' ? 'text-primary' : 'text-outline-variant'}`}>
                  {depPayment === 'momo' ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </div>
            </div>
          </section>

          {/* info note */}
          <div className="flex items-start gap-2 bg-primary-container/10 p-3 rounded-xl border border-primary/20 mt-2">
            <span className="material-symbols-outlined text-primary text-lg">info</span>
            <p className="text-xs text-on-surface-variant leading-relaxed">{t.paymentNote}</p>
          </div>
        </main>

        {/* Bottom Absolute Confirm CTAs */}
        <div className="fixed bottom-0 left-0 w-full bg-surface p-4 border-t border-outline-variant/10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] md:flex md:justify-center z-40">
          <div className="max-w-lg w-full">
            <button 
              id="confirm-dep-btn"
              className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl active:scale-95 duration-200 transition-all shadow-lg hover:bg-primary-container cursor-pointer flex items-center justify-center gap-2"
              onClick={handleConfirmDeposit}
            >
              {t.confirmDep}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER WITHDRAWAL subview (Screen 2)
  if (subView === 'withdraw') {
    const exceedsBalance = parseInt(withAmount, 10) > balance;
    return (
      <div className="flex-grow flex flex-col w-full pb-32 animate-fade-in relative">
        <header className="w-full top-0 sticky bg-surface shadow-sm z-50 flex items-center justify-between px-4 py-3 h-16 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button 
              id="back-to-summary-with"
              onClick={() => setSubView('summary')} 
              className="material-symbols-outlined text-primary p-2 hover:bg-surface-container rounded-full transition-all active:scale-95 cursor-pointer"
            >
              arrow_back
            </button>
            <h1 className="text-xl font-bold text-primary">{t.withdrawTitle}</h1>
          </div>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAffFcEy-R9iUS5fkQ_ObiOMAG7ivNXnHbHd2mTk_mJclxPSGnV7E2UVStRuWb0o5LB7YgfiG2i4vTA8THMAt6Gd1cEAqKofPdIE9oJFbDCGXIDWCT-QjMr0TXbu318fOeid5V_jjsgE5LpC63iVLEUbm5glIXtThD_Vp7zwjmP2dN00cTrJqLPRX3rV8axfqj0OgnwtrhAKK83DpF1_MgEVk8bZjcidmN7QHpeFDU4bz3VG5zomYkMompYLNIzjZ1aMpzN5xIp02mNC" 
              alt="tutor" 
            />
          </div>
        </header>

        <main className="flex-grow flex flex-col p-4 max-w-lg mx-auto w-full gap-5">
          {/* Balance card display */}
          <section className="bg-gradient-to-tr from-primary to-primary-container rounded-xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs opacity-80 mb-1">{t.availBalance}</p>
              <h2 className="text-3xl font-extrabold">{formatVND(balance)}</h2>
              <div className="mt-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                <p className="text-xs opacity-80">{t.usableDesc}</p>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 opacity-10">
              <span className="material-symbols-outlined !text-[120px]">account_balance_wallet</span>
            </div>
          </section>

          {/* Toast Msg */}
          {withToast && (
            <div id="with-toast-msg" className={`p-4 rounded-xl shadow-md font-semibold text-sm flex gap-2 items-center ${
              withToast.isError ? 'bg-red-50 text-error border border-error/20' : 'bg-primary text-white'
            }`}>
              <span className="material-symbols-outlined">{withToast.isError ? 'error' : 'check_circle'}</span>
              <p>{withToast.message}</p>
            </div>
          )}

          {/* Withdrawal Input Form */}
          <section className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-on-surface-variant">{t.withdrawAmount}</label>
              <div className="relative">
                <input 
                  id="widthdraw-amount-input"
                  className={`w-full rounded-xl bg-surface-container-low px-4 py-3 text-2xl font-bold border transition-all focus:ring-2 focus:ring-primary/20 ${
                    exceedsBalance ? 'border-error text-error focus:border-error focus:ring-error/10' : 'border-outline-variant focus:border-primary'
                  }`} 
                  placeholder={t.withdrawPlace}
                  type="number"
                  value={withAmount}
                  onChange={(e) => setWithAmount(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-on-surface-variant">đ</span>
              </div>

              {/* Suggestions */}
              <div className="flex justify-between mt-2">
                <button 
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container hover:bg-primary-fixed hover:-translate-y-0.5 transition-all text-primary cursor-pointer"
                  onClick={() => setWithAmount('1000000')}
                >
                  1.000.000đ
                </button>
                <button 
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container hover:bg-primary-fixed hover:-translate-y-0.5 transition-all text-primary cursor-pointer"
                  onClick={() => setWithAmount('2000000')}
                >
                  2.000.000đ
                </button>
                <button 
                  className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container hover:bg-primary-fixed hover:-translate-y-0.5 transition-all text-primary cursor-pointer"
                  onClick={() => setWithAmount(balance.toString())}
                >
                  {lang === 'vi' ? 'Rút hết' : 'Withdraw all'}
                </button>
              </div>
            </div>

            {/* Account selections */}
            <div className="pt-2">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t.receiveAccount}</label>
              <div className="grid grid-cols-1 gap-2">
                
                {/* Default Vietcombank */}
                <label 
                  className={`relative flex items-center p-3 border rounded-xl cursor-pointer hover:border-primary/50 transition-all ${
                    selectedBank === 'vcb' ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant bg-surface-container-lowest'
                  }`}
                  onClick={() => setSelectedBank('vcb')}
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant flex items-center justify-center mr-3 shadow-sm shrink-0">
                    <span className="material-symbols-outlined text-primary">account_balance</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold truncate">Vietcombank</p>
                    <p className="text-xs text-on-surface-variant">**** 1234 - NGUYEN VAN A</p>
                  </div>
                  <span className={`material-symbols-outlined shrink-0 ${selectedBank === 'vcb' ? 'text-primary' : 'text-outline-variant'}`}>
                    {selectedBank === 'vcb' ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </label>

                {/* Custom Additions */}
                {customBanks.map((item) => (
                  <label 
                    key={item.id}
                    className={`relative flex items-center p-3 border rounded-xl cursor-pointer hover:border-primary/50 transition-all ${
                      selectedBank === item.id ? 'border-2 border-primary bg-primary/5' : 'border border-outline-variant bg-surface-container-lowest'
                    }`}
                    onClick={() => setSelectedBank(item.id)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-white border border-outline-variant flex items-center justify-center mr-3 shadow-sm shrink-0">
                      <span className="material-symbols-outlined text-primary">account_balance</span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <p className="text-xs text-on-surface-variant">**** {item.acc.slice(-4)} - {item.owner}</p>
                    </div>
                    <span className={`material-symbols-outlined shrink-0 ${selectedBank === item.id ? 'text-primary' : 'text-outline-variant'}`}>
                      {selectedBank === item.id ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </label>
                ))}

                {/* Add new account trigger */}
                <button 
                  id="add-new-bank-trigger"
                  onClick={() => setShowAddBank(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-xl hover:bg-surface-container/50 transition-all active:scale-95 cursor-pointer text-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  <span>{t.addNewAccount}</span>
                </button>
              </div>
            </div>
          </section>

          {/* action button inside layout too */}
          <div className="pt-2">
            <button 
              id="confirm-withdraw-action"
              className="w-full h-14 bg-primary text-on-primary font-bold rounded-xl active:scale-95 duration-200 transition-all shadow-md hover:bg-primary-container cursor-pointer flex items-center justify-center gap-2"
              onClick={handleConfirmWithdraw}
            >
              {t.confirmWithdraw}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="text-center text-xs text-on-surface-variant mt-2">{t.withdrawNote}</p>
          </div>
        </main>

        {/* Modal Sheet for Bank Details form */}
        {showAddBank && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 border border-outline-variant shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary">{t.addNewAccount}</h3>
                <button 
                  onClick={() => setShowAddBank(false)}
                  className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container rounded-full p-1"
                >
                  close
                </button>
              </div>

              <form onSubmit={handleAddNewBank} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên ngân hàng (Bank name)</label>
                  <input 
                    className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. BIDV, Techcombank, MB Bank"
                    required
                    value={newBank.name}
                    onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Số tài khoản (Account number)</label>
                  <input 
                    className="w-full rounded-xl border border-outline-variant px-3 py-2 text-sm focus:border-primary outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. 190333555222"
                    required
                    value={newBank.account}
                    onChange={(e) => setNewBank({ ...newBank, account: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên chủ tài khoản (Account Name)</label>
                  <input 
                    className="w-full bg-surface-container-low rounded-xl border border-outline-variant px-3 py-2 text-sm outline-none focus:border-primary text-gray-700"
                    placeholder="e.g. NGUYEN VAN A"
                    required
                    value={newBank.owner}
                    onChange={(e) => setNewBank({ ...newBank, owner: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddBank(false)}
                    className="flex-1 py-2 border border-outline-variant rounded-xl text-sm font-semibold hover:bg-surface-container"
                  >
                    {t.cancel}
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-container shadow-sm"
                  >
                    {t.confirm}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER MAIN WALLET SUMMARY (Screen 3)
  return (
    <div className="flex-grow w-full pb-32 animate-fade-in">
      {/* Top Banner mapping visually */}
      <section className="bg-surface-container-lowest p-5 border-b border-outline-variant/20 mb-6">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <div className="space-y-1">
            <p className="text-on-surface-variant font-medium text-sm">{t.currentBalance}</p>
            <div className="text-4xl font-extrabold text-primary font-display">
              {formatVND(balance)}
            </div>
          </div>
          {/* Action buttons Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              id="deposit-action-btn"
              onClick={() => setSubView('deposit')}
              className="bg-primary text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-primary-container hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              {t.deposit}
            </button>
            <button 
              id="withdraw-action-btn"
              onClick={() => setSubView('withdraw')}
              className="border-2 border-primary text-primary font-bold py-3 px-4 rounded-xl hover:bg-primary/5 hover:-translate-y-0.5 active:scale-95 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              {t.withdraw}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Commission overdue section */}
        {hasOverdueCommission && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-outline">{t.commHeader}</h2>
              <span className="bg-error-container text-on-error-container text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                {t.itemCount}
              </span>
            </div>
            
            {/* Warning Banner */}
            <div className="bg-error-container text-on-error-container p-4 rounded-xl flex items-center gap-3 animate-pulse border border-error/10 shadow-sm">
              <span className="material-symbols-outlined text-error shrink-0">warning</span>
              <p className="text-xs font-semibold leading-relaxed">{t.warningOverdue}</p>
            </div>

            {/* Overdue card detail */}
            <div className="bg-white rounded-xl p-4 border border-outline-variant shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-primary text-base">Lớp Toán 12</h4>
                  <p className="text-on-surface-variant text-xs">ID: MT12-9982</p>
                </div>
                <span className="bg-surface-container text-on-surface-variant text-[11px] font-semibold px-3 py-1 rounded-full">
                  {lang === 'vi' ? 'Chờ thanh toán' : 'Pending Payment'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-y-3 py-3 border-y border-outline-variant/30 text-xs">
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{lang === 'vi' ? 'Học phí' : 'Tuition'}</p>
                  <p className="font-bold text-sm text-on-surface mt-0.5">2.400.000đ</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{t.systemFee}</p>
                  <p className="font-bold text-sm text-on-surface mt-0.5">360.000đ</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{t.dueDateLabel}</p>
                  <p className="font-bold text-sm text-error mt-0.5">30/10/2023</p>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{t.neededToPay}</p>
                  <p className="font-extrabold text-base text-primary mt-0.5">360.000đ</p>
                </div>
              </div>

              <button 
                id="pay-commission-now-btn"
                onClick={handlePayCommissionNow}
                className="w-full bg-secondary-container text-white hover:bg-secondary-container/90 font-bold py-3 rounded-xl transition-all active:scale-[0.98] cursor-pointer text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                {t.payNow}
              </button>
            </div>
          </section>
        )}

        {/* Transaction History view */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-outline">{t.allHistory}</h2>
            <button className="text-primary text-xs font-bold hover:underline cursor-pointer">{t.viewAll}</button>
          </div>

          <div className="space-y-2">
            {transactions.map((tx) => {
              const formattedAmt = tx.amount > 0 ? `+${formatVND(tx.amount)}` : formatVND(tx.amount);
              // colors mapping M3 style
              let badgeColor = 'bg-surface-container text-on-surface-variant';
              let badgeText = tx.status;
              let iconName = 'payments';
              let iconBg = 'bg-surface-container text-on-surface-variant';

              if (tx.type === 'deposit') {
                iconName = 'download';
                iconBg = 'bg-tertiary-container/10 text-tertiary';
              } else if (tx.type === 'withdraw') {
                iconName = 'upload';
                iconBg = tx.status === 'rejected' ? 'bg-red-100 text-error' : 'bg-error/10 text-error';
              } else {
                iconName = 'receipt_long';
                iconBg = 'bg-orange-100 text-secondary';
              }

              if (tx.status === 'success') {
                badgeColor = 'bg-tertiary-container/20 text-on-tertiary-container';
                badgeText = lang === 'vi' ? 'Thành công' : 'Success';
              } else if (tx.status === 'processing') {
                badgeColor = 'bg-orange-100 text-secondary-container';
                badgeText = lang === 'vi' ? 'Đang xử lý' : 'Processing';
              } else if (tx.status === 'rejected') {
                badgeColor = 'bg-red-100 text-error';
                badgeText = lang === 'vi' ? 'Từ chối' : 'Rejected';
              }

              return (
                <div 
                  key={tx.id} 
                  className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl hover:bg-surface-container-low/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                      <span className="material-symbols-outlined text-xl">{iconName}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">{tx.title}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">
                        {tx.date} • <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${badgeColor}`}>{badgeText}</span>
                      </p>
                      {tx.sourceDest && (
                        <p className="text-[10px] text-on-surface-variant/80 mt-1">{tx.sourceDest}</p>
                      )}
                    </div>
                  </div>
                  <p className={`font-bold text-sm truncate shrink-0 ${
                    tx.amount > 0 ? 'text-tertiary' : 'text-error'
                  }`}>
                    {formattedAmt}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
