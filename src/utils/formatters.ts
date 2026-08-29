// ==========================================
// UTILITY FORMATTERS (IDR, DATES, PERCENTAGES)
// ==========================================

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactIDR(amount: number): string {
  if (Math.abs(amount) >= 1_000_000_000) {
    return `Rp${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `Rp${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `Rp${(amount / 1_000).toFixed(0)}k`;
  }
  return `Rp${amount}`;
}

export function formatDateIndonesian(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatTimeHHMM(timeString: string): string {
  if (!timeString) return '';
  return timeString.substring(0, 5);
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getNowTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function formatPercentage(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
}

export function calculateJournalStreak(journals: { date: string }[]): number {
  if (!journals || journals.length === 0) return 0;

  // Extract all unique dates in format YYYY-MM-DD sorted descending
  const uniqueDates = Array.from(new Set(journals.map((j) => j.date))).filter(Boolean).sort().reverse();
  if (uniqueDates.length === 0) return 0;

  const todayStr = getTodayString();
  const todayDate = new Date(todayStr);
  const yesterdayDate = new Date(todayDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yYear = yesterdayDate.getFullYear();
  const yMonth = String(yesterdayDate.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayDate.getDate()).padStart(2, '0');
  const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

  const latestDate = uniqueDates[0];
  // Streak is only active if the latest journal was recorded today or yesterday
  if (latestDate !== todayStr && latestDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let expectedDate = new Date(latestDate);

  for (const dateStr of uniqueDates) {
    const expYear = expectedDate.getFullYear();
    const expMonth = String(expectedDate.getMonth() + 1).padStart(2, '0');
    const expDay = String(expectedDate.getDate()).padStart(2, '0');
    const expectedStr = `${expYear}-${expMonth}-${expDay}`;

    if (dateStr === expectedStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getTrialDaysRemaining(expiryDate: string): number {
  if (!expiryDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);
  const diffTime = exp.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function isUserMembershipExpired(user: { role?: string; membershipExpiryDate?: string; status?: string } | null): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin') return false;
  if (user.status === 'expired_membership') return true;
  if (!user.membershipExpiryDate) return false;

  const todayStr = getTodayString();
  return todayStr > user.membershipExpiryDate;
}


