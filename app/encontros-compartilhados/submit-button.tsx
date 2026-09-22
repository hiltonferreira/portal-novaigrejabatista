"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({ children, name, value }: { children: React.ReactNode; name?: string; value?: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" name={name} value={value} disabled={pending} aria-disabled={pending}>{pending ? "Aguarde…" : children}</button>;
}
