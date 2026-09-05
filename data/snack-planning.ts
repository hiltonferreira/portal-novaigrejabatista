export type CalendarMonth = {
  month: number;
  year: number;
};

export type CellMeetingSchedule = {
  weekday: string;
  startTime: string;
};

export type PlanningEncounter = {
  id: string;
  dateIso: string;
  startTime: string;
};

export type SnackPlanningOccurrence = PlanningEncounter & {
  source: "recurrence" | "encounter";
};

export type MonthRelation = "past" | "current" | "future";

const weekdayIndexes: Record<string, number> = {
  domingo: 0,
  "segunda-feira": 1,
  "terca-feira": 2,
  "quarta-feira": 3,
  "quinta-feira": 4,
  "sexta-feira": 5,
  sabado: 6,
};

function normalizeWeekday(weekday: string) {
  return weekday.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function toDateIso(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function parseLocalDate(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getMonthRelation(selectedMonth: CalendarMonth, today: Date): MonthRelation {
  const selectedValue = selectedMonth.year * 12 + selectedMonth.month;
  const currentValue = today.getFullYear() * 12 + today.getMonth();
  if (selectedValue < currentValue) return "past";
  if (selectedValue > currentValue) return "future";
  return "current";
}

export function getRecurringDatesForMonth(month: CalendarMonth, schedule: CellMeetingSchedule): SnackPlanningOccurrence[] {
  const weekdayIndex = weekdayIndexes[normalizeWeekday(schedule.weekday)];
  if (weekdayIndex === undefined) return [];

  const occurrences: SnackPlanningOccurrence[] = [];
  const date = new Date(month.year, month.month, 1);
  while (date.getMonth() === month.month) {
    if (date.getDay() === weekdayIndex) {
      const dateIso = toDateIso(date);
      occurrences.push({
        id: `recurrence-${dateIso}`,
        dateIso,
        startTime: schedule.startTime,
        source: "recurrence",
      });
    }
    date.setDate(date.getDate() + 1);
  }
  return occurrences;
}

export function getSnackPlanningOccurrences(
  month: CalendarMonth,
  schedule: CellMeetingSchedule,
  encounters: readonly PlanningEncounter[],
) {
  const monthKey = `${month.year}-${String(month.month + 1).padStart(2, "0")}`;
  const occurrencesByDate = new Map(
    getRecurringDatesForMonth(month, schedule).map((occurrence) => [occurrence.dateIso, occurrence]),
  );

  encounters
    .filter((encounter) => encounter.dateIso.startsWith(monthKey))
    .forEach((encounter) => occurrencesByDate.set(encounter.dateIso, { ...encounter, source: "encounter" }));

  return [...occurrencesByDate.values()].toSorted((first, second) => first.dateIso.localeCompare(second.dateIso));
}

export function isOccurrenceEligible(occurrence: SnackPlanningOccurrence, today: Date) {
  const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return parseLocalDate(occurrence.dateIso).getTime() >= localToday.getTime();
}
