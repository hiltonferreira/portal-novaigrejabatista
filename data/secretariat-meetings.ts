import type { StatusTone } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";
import { resolveStudyForEncounter } from "@/data/pastoral-studies";

type OperationalStatus = {
  label: string;
  tone: StatusTone;
};

export type SecretariatMeeting = {
  id: string;
  dateIso: string;
  startTime: string;
  title: string;
  study?: { lessonNumber: string; bibleReference: string };
  studyPending?: boolean;
  serviceAssignments?: readonly {
    serviceFunction: string;
    symbol: string;
    assignments: readonly string[];
  }[];
  statuses: {
    communication?: OperationalStatus;
    attendance: OperationalStatus;
    report: OperationalStatus;
  };
};

const futureMeetingDefaults = {
  attendance: { label: "Após o encontro", tone: "neutral" },
  report: { label: "Após o encontro", tone: "neutral" },
} as const satisfies Pick<SecretariatMeeting["statuses"], "attendance" | "report">;

const scheduledNextMeetingStudy = resolveStudyForEncounter(genesisCellMock.nextMeeting.dateIso);

export const secretariatMeetingsMock = {
  upcoming: [
    {
      id: genesisCellMock.nextMeeting.id,
      dateIso: genesisCellMock.nextMeeting.dateIso,
      startTime: genesisCellMock.nextMeeting.startTime,
      title: scheduledNextMeetingStudy?.title ?? "Estudo a definir",
      study: {
        lessonNumber: scheduledNextMeetingStudy?.lessonNumber ?? genesisCellMock.nextMeeting.study.lessonNumber,
        bibleReference: scheduledNextMeetingStudy?.baseReference ?? genesisCellMock.nextMeeting.study.bibleReference,
      },
      serviceAssignments: [
        { serviceFunction: "Recepção", symbol: "🚪", assignments: ["Lucas Ferreira"] },
        { serviceFunction: "Boas-vindas e Avisos", symbol: "📢", assignments: [genesisCellMock.currentPerson.name] },
        { serviceFunction: "Mídia (vídeo/foto)", symbol: "📸", assignments: ["Beatriz Almeida"] },
        { serviceFunction: "Quebra-gelo", symbol: "🎮", assignments: ["Rafael Souza"] },
        { serviceFunction: "Louvor e adoração", symbol: "🎵", assignments: ["Juliana Rocha"] },
        { serviceFunction: "Palavra", symbol: "📖", assignments: ["Rafael Souza"] },
        { serviceFunction: "Oração", symbol: "🙏", assignments: ["Carolina Mendes"] },
        { serviceFunction: "Kids", symbol: "🎊", assignments: ["Ana Martins", "Pedro Almeida"] },
      ],
      statuses: {
        communication: { label: "A preparar", tone: "action" },
        ...futureMeetingDefaults,
      },
    },
    {
      id: "genesis-2026-09-15",
      dateIso: "2026-09-15",
      startTime: "19h40",
      title: "Estudo a definir",
      studyPending: true,
      statuses: {
        communication: { label: "Preparada", tone: "success" },
        ...futureMeetingDefaults,
      },
    },
    {
      id: "genesis-2026-09-22",
      dateIso: "2026-09-22",
      startTime: "19h40",
      title: "Estudo a definir",
      studyPending: true,
      statuses: {
        communication: { label: "Em preparação", tone: "progress" },
        ...futureMeetingDefaults,
      },
    },
  ],
  previous: [
    {
      id: "genesis-2026-09-01",
      dateIso: "2026-09-01",
      startTime: "19h40",
      title: "Estudo realizado",
      statuses: {
        attendance: { label: "Registrada", tone: "success" },
        report: { label: "Visualizado pelo Líder", tone: "neutral" },
      },
    },
    {
      id: "genesis-2026-08-25",
      dateIso: "2026-08-25",
      startTime: "19h40",
      title: "Estudo realizado",
      statuses: {
        attendance: { label: "Registrada", tone: "success" },
        report: { label: "Enviado ao Líder", tone: "neutral" },
      },
    },
  ],
} as const satisfies {
  upcoming: readonly SecretariatMeeting[];
  previous: readonly SecretariatMeeting[];
};

export type SecretariatMeetingMock = (typeof secretariatMeetingsMock.upcoming)[number] | (typeof secretariatMeetingsMock.previous)[number];

export function createSessionMeetingId(dateIso: string, startTime: string) {
  return `genesis-created_${dateIso}_${startTime.replace(":", "h")}_${crypto.randomUUID().slice(0, 8)}`;
}

function parseSessionMeetingId(meetingId: string): SecretariatMeeting | undefined {
  const match = /^genesis-created_(\d{4}-\d{2}-\d{2})_(\d{2}h\d{2})_([a-z0-9-]+)$/.exec(meetingId);
  if (!match) return undefined;
  const [, dateIso, encodedTime] = match;
  return {
    id: meetingId, dateIso, startTime: encodedTime.replace("h", ":"),
    title: "Estudo a definir", studyPending: true,
    statuses: { communication: { label: "A preparar", tone: "action" }, attendance: futureMeetingDefaults.attendance, report: futureMeetingDefaults.report },
  };
}

export const secretariatMeetingOverviewMock = {
  encounterId: genesisCellMock.nextMeeting.id,
  communication: {
    status: { label: "A preparar", tone: "action" },
    description: "Prepare as informações que serão compartilhadas com a célula sobre este encontro.",
  },
  attendance: {
    status: { label: "Após o encontro", tone: "neutral" },
    description: "Registre quem participou do encontro e identifique visitantes.",
  },
  report: {
    status: { label: "Após o encontro", tone: "neutral" },
    description: "Registre as informações do encontro para acompanhamento do líder.",
  },
} as const satisfies {
  encounterId: string;
  communication: { status: OperationalStatus; description: string };
  attendance: { status: OperationalStatus; description: string };
  report: { status: OperationalStatus; description: string };
};

export const secretariatCommunicationMock = {
  encounterId: genesisCellMock.nextMeeting.id,
  status: { label: "A preparar", tone: "action" },
  gathering: {
    label: "Confraternização",
    symbol: "🍽️",
    description: "Todos os membros do DNA Gênesis",
  },
  schedulePath: "/minha-celula/escalas",
} as const satisfies {
  encounterId: string;
  status: OperationalStatus;
  gathering: { label: string; symbol: string; description: string };
  schedulePath: string;
};

export function getSecretariatMeetingById(meetingId: string): SecretariatMeeting | undefined {
  return [...secretariatMeetingsMock.upcoming, ...secretariatMeetingsMock.previous].find((meeting) => meeting.id === meetingId) ?? parseSessionMeetingId(meetingId);
}
