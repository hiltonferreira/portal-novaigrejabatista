import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Portal Nova Igreja Batista", template: "%s | Nova Igreja Batista" },
  description: "Responsabilidades, jornadas e próximos passos de Maria na Nova Igreja Batista.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
