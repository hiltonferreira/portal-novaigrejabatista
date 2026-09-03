import type { StatusTone } from "@/components/portal-patterns";
import { genesisCellMock } from "@/data/cell";

type OperationalStatus = {
  label: string;
  tone: StatusTone;
};

type SecretariatMeeting = {
  id: string;
  dateIso: string;
  startTime: string;
  title: string;
  study?: {
    lessonNumber: string;
    bibleReference: string;
  };
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

export const secretariatMeetingsMock = {
  upcoming: [
    {
      id: genesisCellMock.nextMeeting.id,
      dateIso: genesisCellMock.nextMeeting.dateIso,
      startTime: genesisCellMock.nextMeeting.startTime,
      title: genesisCellMock.nextMeeting.study.title,
      study: {
        lessonNumber: genesisCellMock.nextMeeting.study.lessonNumber,
        bibleReference: genesisCellMock.nextMeeting.study.bibleReference,
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

export function getSecretariatMeetingById(meetingId: string): SecretariatMeetingMock | undefined {
  return [...secretariatMeetingsMock.upcoming, ...secretariatMeetingsMock.previous].find((meeting) => meeting.id === meetingId);
}
