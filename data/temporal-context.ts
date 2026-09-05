export function parseLocalDate(dateIso: string) {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function calendarDayNumber(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}

export function startOfCalendarWeek(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceMonday = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - daysSinceMonday);
  return start;
}

export function formatLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getCalendarWeek(dateIso: string) {
  const weekStartDate = startOfCalendarWeek(parseLocalDate(dateIso));
  const weekEndDate = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), weekStartDate.getDate() + 6);
  return { weekStart: formatLocalDateKey(weekStartDate), weekEnd: formatLocalDateKey(weekEndDate) };
}

export function addCalendarWeeks(weekStart: string, amount: number) {
  const date = parseLocalDate(weekStart);
  date.setDate(date.getDate() + amount * 7);
  return formatLocalDateKey(date);
}

export function formatStudyWeek(weekStart: string) {
  const { weekEnd } = getCalendarWeek(weekStart);
  const start = parseLocalDate(weekStart);
  const end = parseLocalDate(weekEnd);
  const startDay = String(start.getDate()).padStart(2, "0");
  const endDay = String(end.getDate()).padStart(2, "0");
  const startMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(start);
  const endMonth = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(end);

  if (start.getFullYear() !== end.getFullYear()) {
    return `${startDay} de ${startMonth} de ${start.getFullYear()} a ${endDay} de ${endMonth} de ${end.getFullYear()}`;
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${startDay} de ${startMonth} a ${endDay} de ${endMonth} de ${end.getFullYear()}`;
  }
  return `${startDay} a ${endDay} de ${endMonth} de ${end.getFullYear()}`;
}

export function getTemporalContext(dateIso: string, today: Date | null) {
  if (!today) return null;

  const targetDate = parseLocalDate(dateIso);
  const differenceInDays = calendarDayNumber(targetDate) - calendarDayNumber(today);

  if (differenceInDays === 0) return "Hoje";
  if (differenceInDays === 1) return "Amanhã";

  const targetWeek = calendarDayNumber(startOfCalendarWeek(targetDate));
  const currentWeek = calendarDayNumber(startOfCalendarWeek(today));

  if (targetWeek === currentWeek) return "Essa semana";
  if (targetWeek === currentWeek + 7) return "Próxima semana";

  return null;
}

export function formatDayMonthTag(dateIso: string) {
  const date = parseLocalDate(dateIso);
  const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date).replace(".", "").toLocaleUpperCase("pt-BR");
  return `${day} ${month}`;
}
