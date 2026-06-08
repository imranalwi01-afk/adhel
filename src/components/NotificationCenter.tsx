import React, { useState, useEffect } from 'react';
import { Bell, Heart, Sparkles, X, AlertCircle } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'schedule' | 'assignment' | 'exam' | 'system';
  timestamp: Date;
  read: boolean;
}

// Custom coquette chime generator using Web Audio API (Synthesizer)
export function playChimeSound(type: 'bell' | 'levelUp' | 'success') {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    if (type === 'bell') {
      // Warm glass chime
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'levelUp') {
      // Dreamy coquette success sequence
      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      frequencies.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.4);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    } else if (type === 'success') {
      // Sparkly chime
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1320, now); // E6
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.5);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch (error) {
    console.log('Audio Context suppressed or not supported:', error);
  }
}

interface NotificationCenterProps {
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  setNotifications,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    playChimeSound('success');
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  // Trigger floating toasty if a new unread alert arrives
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length > 0) {
      const latest = unread[0];
      // Show if it is less than 5 seconds old
      if (new Date().getTime() - new Date(latest.timestamp).getTime() < 3000) {
        setActiveToast(latest);
        // Play soft coquette chime
        playChimeSound('bell');
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      {/* Toast Alert overlay */}
      {activeToast && (
        <div className="fixed top-4 right-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-[#FFD0D8] bg-[#FFF5F6]/95 p-4 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-bounce">
          <div className="rounded-full bg-[#FFD0D8] p-2 text-[#FF6384]">
            <Sparkles size={16} />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-xs font-semibold text-[#6E4249]">
              {activeToast.title}
            </h4>
            <p className="mt-0.5 text-xs text-[#8A6167]">
              {activeToast.message}
            </p>
          </div>
          <button
            onClick={() => setActiveToast(null)}
            className="text-[#B9838A] hover:text-[#FF6384]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#FFD0D8] bg-[#FFFBFB]/80 text-[#8A6167] shadow-sm transition-all hover:bg-[#FFF5F6] hover:text-[#FF6384]"
        title="Pusat Notifikasi"
      >
        <Bell size={18} className={getUnreadCount() > 0 ? "animate-swing" : ""} />
        {getUnreadCount() > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6384] text-[10px] font-bold text-white shadow-sm animate-pulse">
            {getUnreadCount()}
          </span>
        )}
      </button>

      {/* Popover list panel */}
      {isOpen && (
        <>
          {/* Backdrop layer */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-[#FFD0D8] bg-[#FFFBFB] p-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#FFF0F2] pb-3 mb-2">
              <div className="flex items-center gap-1.5">
                <Heart size={14} className="text-[#FF6384] fill-current" />
                <h3 className="font-display font-bold text-sm text-[#523A3E]">
                  Reminder & Alerts
                </h3>
              </div>
              <div className="flex gap-2">
                {getUnreadCount() > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-[#FF6384] hover:underline"
                  >
                    Read All
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-[10px] text-[#A67E83] hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <AlertCircle size={24} className="mx-auto text-[#FFD0D8] mb-2" />
                  <p className="text-xs text-[#C2A3A7]">Semua beres! Belum ada notifikasi.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2 rounded-xl p-2.5 transition-all text-left ${
                      n.read ? 'bg-transparent' : 'bg-[#FFF0F2] border-l-2 border-[#FF8DA1]'
                    }`}
                  >
                    <div className="mt-0.5 text-[#FF8DA1]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#523A3E] truncate">{n.title}</p>
                      <p className="text-[11px] text-[#86666A] leading-tight mt-0.5 break-words">{n.message}</p>
                      <p className="text-[9px] text-[#C2ABAF] mt-1">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="text-[#D6B2B7] hover:text-[#FF6384] ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
