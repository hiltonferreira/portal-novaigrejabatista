export type CellContext = {
  name: string;
  weekday: string;
  startTime: string;
  address: string;
  mapsUrl: string;
};

export type ChurchCell = {
  id: string;
  name: string;
  status: "Em implantação" | "Ativa" | "Inativa";
  establishedYear?: number;
  establishedYearIsDemonstration?: boolean;
  weekday: string;
  startTime: string;
  leaderId: string;
  traineeLeaderIds: readonly string[];
};

type CellRole = {
  role: "Líder" | "Líder em Treinamento" | "Secretaria da Célula" | "Anfitriã";
  name: string;
};

type ChurchRelationship = "Membro" | "Frequentador" | "Visitante";

type CellParticipant = {
  name: string;
  churchRelationship: ChurchRelationship;
  churchRelationshipLabel: string;
  cellRoles: string[];
};

const weeklyStudyMock = {
  lessonNumber: "Lição 13",
  title: "Uma vida guiada pelo Espírito",
  bibleReference: "Gálatas 5:16–25",
  referenceIsDemonstration: true,
};

const nextMeetingMock = {
  id: "genesis-2026-09-08",
  dateIso: "2026-09-08",
  dateLabel: "Terça-feira · 08/09 · 19h40",
  startTime: "19h40",
  study: weeklyStudyMock,
};

const upcomingMeetingsMock = [
  nextMeetingMock,
  { id: "genesis-2026-09-15", dateIso: "2026-09-15", startTime: "19h40" },
  { id: "genesis-2026-09-22", dateIso: "2026-09-22", startTime: "19h40" },
];

export const genesisCellMock = {
  name: "Gênesis",
  weekday: "terça-feira",
  startTime: "19h40",
  address: "Rua Marabá, Jardim Jorge Teixeira · Ariquemes, RO",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Marab%C3%A1%2C%20Jardim%20Jorge%20Teixeira%2C%20Ariquemes%2C%20RO",
  nextMeeting: nextMeetingMock,
  upcomingMeetings: upcomingMeetingsMock,
  previousMeetings: [
    { dateLabel: "01/09/2026", lessonNumber: "Lição 12", title: "Título demonstrativo do encontro", isDemonstration: true },
    { dateLabel: "25/08/2026", lessonNumber: "Lição 11", title: "Título demonstrativo do encontro", isDemonstration: true },
    { dateLabel: "18/08/2026", lessonNumber: "Lição 10", title: "Título demonstrativo do encontro", isDemonstration: true },
  ],
  currentPerson: {
    name: "Maria Oliveira",
    availableForSchedule: true,
    enabledServiceFunctions: [
      "Recepção",
      "Boas-vindas e Avisos",
      "Mídia",
      "Oração",
    ],
  },
  serviceAssignments: [
    { meetingId: "genesis-2026-09-08", personName: "Maria Oliveira", serviceFunction: "Boas-vindas e Avisos", isDemonstration: true },
    { meetingId: "genesis-2026-09-15", personName: "Maria Oliveira", serviceFunction: "Palavra", isDemonstration: true },
    { meetingId: "genesis-2026-09-22", personName: "Maria Oliveira", serviceFunction: "Recepção", isDemonstration: true },
  ],
  leadership: [
    { role: "Líder", name: "Rafael Souza" },
    { role: "Líder em Treinamento", name: "Maria Oliveira" },
    { role: "Secretaria da Célula", name: "Maria Oliveira" },
    { role: "Anfitriã", name: "Ana Martins" },
  ] satisfies CellRole[],
  birthdays: [
    { name: "Lucas Ferreira", dateLabel: "10/09" },
    { name: "Beatriz Almeida", dateLabel: "18/09" },
    { name: "Rafael Souza", dateLabel: "27/09" },
  ],
  participants: [
    { name: "Maria Oliveira", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: ["Líder", "Secretaria da Célula"] },
    { name: "Rafael Souza", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: ["Líder em Treinamento"] },
    { name: "Ana Martins", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: ["Anfitriã"] },
    { name: "Lucas Ferreira", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: [] },
    { name: "Beatriz Almeida", churchRelationship: "Frequentador", churchRelationshipLabel: "Frequentadora", cellRoles: [] },
    { name: "Marcos Vinícius Costa", churchRelationship: "Visitante", churchRelationshipLabel: "Visitante", cellRoles: [] },
    { name: "Carolina Mendes", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: [] },
    { name: "Pedro Almeida", churchRelationship: "Frequentador", churchRelationshipLabel: "Frequentador", cellRoles: [] },
    { name: "Juliana Rocha", churchRelationship: "Membro", churchRelationshipLabel: "Membro", cellRoles: [] },
  ] satisfies CellParticipant[],
  guestsInvitedByCurrentPerson: [
    { name: "Marcos Vinícius Costa", invitationLabel: "Convidado em 01/09" },
    { name: "Fernanda Ribeiro", invitationLabel: "Convidada em 25/08" },
  ],
} satisfies CellContext & Record<string, unknown>;

export const mariaServiceAssignmentsMock = genesisCellMock.serviceAssignments
  .filter((assignment) => assignment.personName === genesisCellMock.currentPerson.name)
  .map((assignment) => ({
    ...assignment,
    meeting: genesisCellMock.upcomingMeetings.find((meeting) => meeting.id === assignment.meetingId)!,
  }))
  .toSorted((firstAssignment, secondAssignment) => firstAssignment.meeting.dateIso.localeCompare(secondAssignment.meeting.dateIso));

export type PersonalServiceAssignment = (typeof mariaServiceAssignmentsMock)[number];

export const churchCellsMock: readonly ChurchCell[] = [
  { id: "cell-genesis", name: genesisCellMock.name, status: "Ativa", establishedYear: 2022, weekday: genesisCellMock.weekday, startTime: genesisCellMock.startTime, leaderId: "person-rafael-souza", traineeLeaderIds: ["person-maria-oliveira"] },
  { id: "cell-a-forja", name: "A Forja", status: "Ativa", establishedYear: 2024, establishedYearIsDemonstration: true, weekday: "segunda-feira", startTime: "20h00", leaderId: "person-jonathan", traineeLeaderIds: [] },
  { id: "cell-betel", name: "Betel", status: "Ativa", establishedYear: 2023, establishedYearIsDemonstration: true, weekday: "terça-feira", startTime: "20h00", leaderId: "person-wiriquis", traineeLeaderIds: [] },
  { id: "cell-kairos", name: "Kairós", status: "Em implantação", establishedYear: 2026, establishedYearIsDemonstration: true, weekday: "quinta-feira", startTime: "19h30", leaderId: "person-priscila-andrade", traineeLeaderIds: [] },
];

export function formatShortDate(dateIso: string) {
  const [, month, day] = dateIso.split("-");
  return `${day}/${month}`;
}
