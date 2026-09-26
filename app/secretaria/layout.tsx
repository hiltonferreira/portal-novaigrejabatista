import { SecretariatThemeShell } from "./_components/secretariat-theme-shell";

export default function SecretariatLayout({ children }: { children: React.ReactNode }) {
  return <SecretariatThemeShell>{children}</SecretariatThemeShell>;
}
