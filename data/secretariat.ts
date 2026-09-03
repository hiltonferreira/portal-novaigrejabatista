import { formatShortDate, genesisCellMock } from "@/data/cell";

export const secretariatOverviewMock = {
  cell: {
    name: genesisCellMock.name,
  },
  supportingText: {
    firstLine: "Organize as informações e acompanhe",
    secondLine: "os encontros da sua célula.",
  },
  nextAction: {
    context: "Comunicação do encontro",
    title: `Prepare a comunicação do encontro de ${formatShortDate(genesisCellMock.nextMeeting.dateIso)}.`,
    description: "A escala do encontro já está definida. Prepare as informações que serão compartilhadas com a célula.",
    href: "/secretaria/encontros",
  },
  nextMeeting: {
    ...genesisCellMock.nextMeeting,
    participation: "Boas-vindas e Avisos",
    statuses: [
      { label: "Comunicação", status: { label: "A preparar", tone: "action" } },
      { label: "Presença", status: { label: "Após o encontro", tone: "neutral" } },
      { label: "Relatório", status: { label: "Após o encontro", tone: "neutral" } },
    ],
  },
  organization: [
    { title: "Lanche", description: "Organizar o lanche dos próximos encontros", href: "/secretaria/lanche" },
    { title: "Aniversários", description: "Acompanhar os próximos aniversariantes", href: "/secretaria/pessoas" },
    { title: "Pessoas", description: "Acompanhar participantes e visitantes", href: "/secretaria/pessoas" },
  ],
} as const;
