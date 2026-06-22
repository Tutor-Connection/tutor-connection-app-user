import React, { useState, useEffect, useRef } from 'react';
import { ChatThread, Message } from '../types';
import { translations } from '../data';

interface ChatTabProps {
  chats: ChatThread[];
  lang: 'vi' | 'en';
  onAddChatMessage: (chatId: string, msg: Message) => void;
  onClearUnread: (chatId: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  chats,
  lang,
  onAddChatMessage,
  onClearUnread,
}) => {
  const t = translations[lang];

  // Active chat thread (null means we are in the thread index / inbox folder)
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'active' | 'trial'>('all');
  const [searchMsg, setSearchMsg] = useState<string>('');

  // Live message input
  const [inputText, setInputText] = useState<string>('');
  
  // Custom attachment sliding sheet state
  const [showAttachments, setShowAttachments] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Clear unread when visiting active chat
  useEffect(() => {
    if (activeChatId) {
      onClearUnread(activeChatId);
    }
  }, [activeChatId]);

  // Scroll to bottom of chat when new messages land
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, chats, typing]);

  const activeChat = chats.find(c => c.id === activeChatId);

  // Filter threads
  const filteredChats = chats.filter(c => {
    // search text
    const matchesSearch = c.name.toLowerCase().includes(searchMsg.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchMsg.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return c.unreadCount > 0;
    if (activeFilter === 'active') return c.status === 'active';
    if (activeFilter === 'trial') return c.status === 'trial';
    return true;
  });

  // Handle live sending messages
  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChatId) return;

    const newMsg: Message = {
      id: `m-user-${Date.now()}`,
      sender: 'tutor',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    onAddChatMessage(activeChatId, newMsg);
    const sentText = inputText;
    setInputText('');

    // Trigger auto student response
    triggerStudentAutoReply(activeChatId, sentText);
  };

  const triggerStudentAutoReply = (chatId: string, tutorMsg: string) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      
      let replyText = '';
      if (lang === 'vi') {
        if (tutorMsg.toLowerCase().includes('định lý') || tutorMsg.toLowerCase().includes('cosin') || tutorMsg.toLowerCase().includes('cos')) {
          replyText = 'Dạ em hiểu rồi thầy ạ! Em sẽ áp dụng định lý cosin cho cạnh huyền để tính ra góc ạ. Em cám ơn thầy!';
        } else if (tutorMsg.toLowerCase().includes('bài tập') || tutorMsg.toLowerCase().includes('hình')) {
          replyText = 'Dạ vâng, em vừa chụp lại đề bài gửi thầy xem đó ạ, lát em làm thử lại rồi nộp thầy chấm nha.';
        } else {
          replyText = 'Dạ vâng ạ, em cám ơn thầy đã hướng dẫn chi tiết cho em. Em sẽ lưu bài lại để ôn tập!';
        }
      } else {
        if (tutorMsg.toLowerCase().includes('calculus') || tutorMsg.toLowerCase().includes('math')) {
          replyText = "Ah I see, that makes perfect sense! I will re-calculate the integral using substitution. Thanks!!";
        } else {
          replyText = "Understood! Thank you so much for the quick reply. I will practice this problem now.";
        }
      }

      onAddChatMessage(chatId, {
        id: `m-auto-${Date.now()}`,
        sender: 'student',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      });
    }, 2000);
  };

  const handleSendFileSim = (fileName: string, typeDesc: string) => {
    if (!activeChatId) return;
    
    onAddChatMessage(activeChatId, {
      id: `m-file-${Date.now()}`,
      sender: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      file: {
        name: fileName,
        size: '1.4 MB',
        type: typeDesc,
      }
    });

    setShowAttachments(false);

    // Auto reply
    setTimeout(() => {
      onAddChatMessage(activeChatId, {
        id: `m-file-reply-${Date.now()}`,
        sender: 'student',
        text: lang === 'vi' ? 'Dạ em nhận được tài liệu rồi ạ, cám ơn thầy!' : 'Received the file, thank you teacher!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      });
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // RENDER DETAILED CHAT ROOM (Screen 6)
  if (activeChat && activeChatId) {
    return (
      <div className="flex-grow flex flex-col h-screen overflow-hidden bg-background text-on-surface animate-fade-in pt-16 pb-20 relative">
        
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant/20 flex justify-between items-center px-4 py-2 h-16 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              id="back-to-inbox"
              onClick={() => setActiveChatId(null)} 
              className="active:scale-95 transition-transform duration-200 cursor-pointer p-1 hover:bg-surface-container rounded-full"
            >
              <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container shrink-0">
                <img className="w-full h-full object-cover animate-fade-in" src={activeChat.avatar} alt={activeChat.name} />
              </div>
              {activeChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="font-bold text-sm text-on-surface truncate max-w-[150px]">{activeChat.name}</span>
              <span className="text-[10px] text-primary flex items-center font-semibold">
                {typing || activeChat.id === 'chat-minh-anh' ? (
                  <span className="flex items-center gap-1 text-[10px]">
                    {t.typingState}
                    <span className="flex items-center mt-0.5">
                      <span className="typing-dot w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                      <span className="typing-dot w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                      <span className="typing-dot w-1 h-1 bg-primary rounded-full mx-0.5"></span>
                    </span>
                  </span>
                ) : (
                  <span>{activeChat.online ? (lang === 'vi' ? 'Đang hoạt động' : 'Online') : (lang === 'vi' ? 'Ngoại tuyến' : 'Offline')}</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="material-symbols-outlined p-2 hover:bg-surface-container-high rounded-full transition-colors">search</button>
            <button className="material-symbols-outlined p-2 hover:bg-surface-container-high rounded-full transition-colors">more_vert</button>
          </div>
        </header>

        {/* Scrollable messages box */}
        <main className="flex-1 overflow-y-auto px-4 pt-4 pb-20 custom-scrollbar flex flex-col gap-4">
          
          {/* System Security Warning Label */}
          <div className="bg-secondary-fixed text-on-secondary-fixed px-4 py-3 rounded-xl flex items-start gap-2 border border-secondary/10 shadow-sm">
            <span className="material-symbols-outlined text-secondary shrink-0 text-lg">warning</span>
            <p className="text-xs leading-relaxed">{t.secWarning}</p>
          </div>

          <div className="flex justify-center my-1">
            <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-lg font-bold text-[10px]">
              {lang === 'vi' ? 'Hôm nay, 24 Tháng 5' : 'Today, June 18'}
            </span>
          </div>

          {/* Messages loop */}
          {activeChat.messages.map((msg) => {
            const isTutor = msg.sender === 'tutor';
            const textBubbleStyle = isTutor ? 'bg-primary text-white ml-auto' : 'bg-surface-container-high text-on-surface';
            const textBubbleRadius = isTutor ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';

            return (
              <div 
                key={msg.id} 
                className={`max-w-[85%] flex flex-col gap-1 ${
                  isTutor ? 'self-end' : 'self-start'
                }`}
              >
                {/* Regular text */}
                {msg.text && (
                  <div className={`${textBubbleStyle} ${textBubbleRadius} p-3 shadow-sm text-sm leading-relaxed`}>
                    <p>{msg.text}</p>
                  </div>
                )}

                {/* File Attachment rendering */}
                {msg.file && (
                  <div className="bg-surface-container-high text-on-surface rounded-2xl rounded-tl-sm p-3 shadow-sm border border-outline-variant flex items-center gap-3">
                    <div className="w-10 h-10 bg-error-container text-error rounded-lg flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{msg.file.name}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{msg.file.size} • {msg.file.type}</p>
                    </div>
                  </div>
                )}

                {/* Image attachment rendering */}
                {msg.image && (
                  <div className="rounded-2xl rounded-tl-sm overflow-hidden border border-outline-variant shadow-sm max-w-sm">
                    <img className="w-full max-h-56 object-cover" src={msg.image} alt="homework image" />
                  </div>
                )}

                {/* Timestamp and delivery ticks */}
                <div className={`flex items-center gap-1 text-[9px] text-on-surface-variant ${isTutor ? 'justify-end' : 'justify-start'}`}>
                  <span>{msg.timestamp}</span>
                  {isTutor && (
                    <span className="material-symbols-outlined text-xs text-primary font-bold">done_all</span>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </main>

        {/* Input area at the bottom */}
        <footer className="fixed bottom-0 w-full bg-surface px-4 py-2 border-t border-outline-variant/20 flex items-center gap-2 z-40 pb-safe">
          <button 
            id="toggle-attachment-btn"
            onClick={() => setShowAttachments(true)}
            className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full active:scale-90 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] text-primary">add_circle</span>
          </button>
          
          <div className="flex-grow flex items-center bg-surface-container-low rounded-2xl px-3 py-1 relative">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-xl select-none">sentiment_satisfied</span>
            <input 
              id="chat-text-input"
              className="w-full bg-transparent border-none text-sm focus:ring-0 outline-none py-2" 
              placeholder={t.inputPlace}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          <button 
            id="chat-send-btn"
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-md active:scale-95 transition-all text-white cursor-pointer ${
              inputText.trim() ? 'bg-primary hover:bg-primary-container' : 'bg-outline-variant opacity-60 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </footer>

        {/* Attachment sliding bottom sheet list */}
        {showAttachments && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center" onClick={() => setShowAttachments(false)}>
            <div 
              className="bg-white rounded-t-[24px] p-5 w-full max-w-md space-y-4 shadow-xl border-t border-outline-variant animate-slide-up transform translate-y-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-outline-variant rounded-full mx-auto mb-2"></div>
              <h4 className="text-base font-bold text-on-surface">{t.attachmentTitle}</h4>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleSendFileSim('Hinh_hoc_on_tap.jpg', 'Image attachment')}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">image</span>
                  </div>
                  <span className="text-xs font-semibold">{t.mediaGallery}</span>
                </button>
                <button 
                  onClick={() => handleSendFileSim('Camera_capture_4.jpg', 'Snapshot')}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <span className="text-xs font-semibold">{t.camera}</span>
                </button>
                <button 
                  onClick={() => handleSendFileSim('Bai_tap_giai_tich_vector.pdf', 'PDF Study guide')}
                  className="flex flex-col items-center gap-2 p-3 hover:bg-surface-container rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-tertiary-container text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <span className="text-xs font-semibold">{t.document}</span>
                </button>
              </div>

              <button 
                onClick={() => setShowAttachments(false)}
                className="w-full py-2.5 bg-surface-container text-on-surface border border-outline-variant/30 rounded-xl text-xs font-bold hover:bg-surface-container-high transition-colors cursor-pointer mt-1"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER INBOX / THREAD LIST (Screen 5)
  return (
    <div className="flex-grow w-full pb-32 animate-fade-in">
      <main className="max-w-xl mx-auto flex flex-col">
        
        {/* Search & filters folder view */}
        <section className="px-4 pt-4 pb-2 bg-surface">
          <div className="relative flex items-center mb-4">
            <span className="material-symbols-outlined absolute left-4 text-outline select-none">search</span>
            <input 
              id="inbox-search-input"
              className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-2xl text-sm placeholder:text-outline focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
              placeholder={lang === 'vi' ? 'Tìm kiếm học sinh...' : t.searchPlace}
              type="text"
              value={searchMsg}
              onChange={(e) => setSearchMsg(e.target.value)}
            />
          </div>

          {/* Quick tab folder filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 text-xs">
            <button 
              className={`px-4 py-2 whitespace-nowrap rounded-full font-bold transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              {lang === 'vi' ? 'Tất cả' : t.filterAll}
            </button>
            <button 
              className={`px-4 py-2 whitespace-nowrap rounded-full font-bold transition-all cursor-pointer ${
                activeFilter === 'unread' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
              onClick={() => setActiveFilter('unread')}
            >
              {lang === 'vi' ? 'Chưa đọc' : t.filterUnread}
            </button>
            <button 
              className={`px-4 py-2 whitespace-nowrap rounded-full font-bold transition-all cursor-pointer ${
                activeFilter === 'active' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
              onClick={() => setActiveFilter('active')}
            >
              {lang === 'vi' ? 'Lớp Đang dạy' : t.filterActive}
            </button>
            <button 
              className={`px-4 py-2 whitespace-nowrap rounded-full font-bold transition-all cursor-pointer ${
                activeFilter === 'trial' ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
              onClick={() => setActiveFilter('trial')}
            >
              {lang === 'vi' ? 'Lớp Học Thử' : t.filterTrial}
            </button>
          </div>
        </section>

        {/* Chats queue list */}
        <section className="px-4 space-y-2 mt-2">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
              <span className="material-symbols-outlined !text-4xl text-outline mb-2">chat_bubble_outline</span>
              <p className="text-xs text-on-surface-variant font-medium">
                {lang === 'vi' ? 'Không có tin nhắn nào được tìm thấy' : 'No matching conversations found'}
              </p>
            </div>
          ) : (
            filteredChats.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActiveChatId(item.id)}
                className="group flex items-center p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-outline-variant hover:bg-surface-container-low/40 transition-all cursor-pointer relative"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-highest">
                    <img className="w-full h-full object-cover" src={item.avatar} alt={item.name} />
                  </div>
                  {item.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="ml-4 flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-1 min-w-0">
                      <h3 className="text-sm font-bold text-on-surface truncate pr-1">{item.name}</h3>
                      {item.verified && (
                        <span className="material-symbols-outlined text-[15px] text-primary shrink-0" title="Active Class">verified</span>
                      )}
                      {item.trialBadge && (
                        <span className="material-symbols-outlined text-[15px] text-secondary shrink-0" title="Trial Class">hourglass_top</span>
                      )}
                    </div>
                    <span className="text-[10px] text-on-surface-variant shrink-0 font-medium">{item.timestamp}</span>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p className={`text-xs truncate pr-4 ${item.unreadCount > 0 ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                      {item.messages.at(-1)?.text || item.lastMessage}
                    </p>
                    {item.unreadCount > 0 && (
                      <span className="bg-primary text-white text-[9px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm shadow-primary/20 shrink-0">
                        {item.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

      </main>

      {/* Floating Action Button for Chat Tab */}
      <button 
        id="new-chat-trigger-btn"
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-container active:scale-90 transition-all z-40 cursor-pointer"
        onClick={() => {
          // Trigger first chat as default
          if (chats.length > 0) setActiveChatId(chats[0].id);
        }}
      >
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_comment</span>
      </button>
    </div>
  );
};
