import type { StatusTone } from "@/components/portal-patterns";
import { genesisAttendanceMock } from "@/data/secretariat-attendance";
import { getSnackOrganizationByEncounterId } from "@/data/snack-organization";

export type ReportStatus = "draft" | "sentToLeader" | "viewedByLeader";

export const reportStatusPresentation: Record<ReportStatus, {
  label: string;
  tone: StatusTone;
  description: string;
}> = {
  draft: {
    label: "Rascunho",
    tone: "action",
    description: "Este relatório ainda não foi enviado ao Líder.",
  },
  sentToLeader: {
    label: "Enviado ao Líder",
    tone: "neutral",
    description: "O relatório foi enviado e está disponível para o Líder.",
  },
  viewedByLeader: {
    label: "Visualizado pelo Líder",
    tone: "neutral",
    description: "O Líder já visualizou este relatório.",
  },
};

export const secretariatReportMock = {
  encounterId: genesisAttendanceMock.encounterId,
  attendanceSource: genesisAttendanceMock,
  snackOrganizationSource: getSnackOrganizationByEncounterId(genesisAttendanceMock.encounterId),
  status: "draft",
  narrative: {
    meetingSummary: "",
    prayerAndFollowUp: "",
    observations: "",
  },
} as const satisfies {
  encounterId: string;
  attendanceSource: typeof genesisAttendanceMock;
  snackOrganizationSource: ReturnType<typeof getSnackOrganizationByEncounterId>;
  status: ReportStatus;
  narrative: Record<"meetingSummary" | "prayerAndFollowUp" | "observations", string>;
};
