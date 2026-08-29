// Utility for PWA Browser Push & System Notifications

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('Browser ini tidak mendukung notifikasi web.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendLocalNotification = (title: string, options?: NotificationOptions) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: '/vite.svg',
          badge: '/vite.svg',
          ...(options as any),
        });
      });
    } else {
      new Notification(title, {
        icon: '/vite.svg',
        ...options,
      });
    }
  } catch (err) {
    console.error('Error dispatching notification:', err);
  }
};

export const triggerDailyStreakReminder = (userName: string, streakDays: number) => {
  sendLocalNotification(`🔥 Pertahankan Streak Jurnalmu, ${userName}!`, {
    body: `Kamu sudah mempertahankan ${streakDays} hari streak berturut-turut! Luangkan 2 menit malam ini untuk refleksi diri.`,
    tag: 'daily-streak-reminder',
  });
};
