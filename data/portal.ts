type NavigationItem = {
  label: string;
  href: string;
  icon: "home" | "cell" | "check" | "leadership" | "journey" | "group" | "profile";
  group?: string;
};

export const navigation: readonly NavigationItem[] = [
  { label: "Início", href: "/", icon: "home" },
  { label: "Minha Célula", href: "/minha-celula", icon: "cell" },
  { label: "Secretaria", href: "/secretaria", group: "Minhas Responsabilidades", icon: "check" },
  { label: "Liderança", href: "/lideranca", group: "Minhas Responsabilidades", icon: "leadership" },
  { label: "Jornada DNA", href: "/jornada-dna", group: "Minha Jornada", icon: "journey" },
  { label: "Grupo de Discipulado", href: "/grupo-de-discipulado", group: "Minha Jornada", icon: "group" },
  { label: "Meu Perfil", href: "/meu-perfil", icon: "profile" },
] as const;
