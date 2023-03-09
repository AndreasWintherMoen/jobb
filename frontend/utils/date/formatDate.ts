export default function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const now = new Date();
  const deltaDays = date.getDate() - now.getDate();
  if (deltaDays === 0) {
    return 'i dag';
  }
  if (deltaDays === 1) {
    return 'i morgen';
  }
  const dayString = date.toLocaleDateString('nb-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return dayString;
}

export function formatRemainingTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const now = new Date();
  const deltaTime = Math.round((date.getTime() - now.getTime()) / 1000);
  if (deltaTime < 60) {
    return `${deltaTime} sekunder`;
  }
  if (deltaTime < 3600) {
    return `${Math.round(deltaTime / 60)} minutter`;
  }
  if (deltaTime < 86400) {
    return `${Math.round(deltaTime / 3600)} timer`;
  }
  if (deltaTime < 172_800) {
    return 'I morgen';
  }
  if (deltaTime < 604_800) {
    const day = date.toLocaleDateString('nb-NO', { weekday: 'long' });
    return `På ${day}`;
  }
  return `${Math.round(deltaTime / 86_400)} dager`;
}

export function getEventTime(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const dayString = date.toLocaleTimeString('nb-NO', {
    hour: 'numeric',
    minute: 'numeric',
  });
  return dayString;
}
