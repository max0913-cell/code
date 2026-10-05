import { siteConfig, type DayOfWeek, type OpeningHoursDay } from "@/config/site";

export type NowInfo = { day: DayOfWeek; minutes: number };

const amsterdamFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Huidige dag en tijd in Nederland als korte sleutel, bijv. "Tuesday|13:45" */
export function amsterdamNowKey(date = new Date()): string {
  const parts = amsterdamFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("weekday")}|${get("hour")}:${get("minute")}`;
}

export function parseNowKey(key: string): NowInfo {
  const [day, time] = key.split("|");
  return { day: day as DayOfWeek, minutes: toMinutes(time) };
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatHours(day: OpeningHoursDay): string {
  return day.open && day.close ? `${day.open} – ${day.close}` : "Gesloten";
}

/** Korte status zoals "Nu open tot 21:00" of "Dinsdag weer open om 12:00" */
export function openStatus({ day, minutes }: NowInfo): { isOpen: boolean; text: string } {
  const week = siteConfig.openingHours;
  const todayIndex = week.findIndex((entry) => entry.day === day);
  const today = week[todayIndex];

  if (today?.open && today.close) {
    const opens = toMinutes(today.open);
    const closes = toMinutes(today.close);
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, text: `Nu open tot ${today.close}` };
    }
    if (minutes < opens) {
      return { isOpen: false, text: `Vandaag open vanaf ${today.open}` };
    }
  }

  for (let offset = 1; offset <= 7; offset++) {
    const next = week[(todayIndex + offset) % week.length];
    if (next.open) {
      const when = offset === 1 ? "morgen" : next.label.toLowerCase();
      return { isOpen: false, text: `Nu gesloten · ${when} open om ${next.open}` };
    }
  }

  return { isOpen: false, text: "Nu gesloten" };
}
