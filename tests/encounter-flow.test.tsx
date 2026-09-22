import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { useState } from "react";
import { DemoProvider, useDemo, useEncounterOperation } from "@/components/demo-provider";
import { EncounterStudy } from "@/components/encounter-study";
import { AttendanceRegister } from "@/app/secretaria/encontros/[meetingId]/_components/attendance-register";
import { ReportEditor } from "@/app/secretaria/encontros/[meetingId]/_components/report-editor";
import LeaderReports from "@/app/lideranca/relatorios/page";
import { resolveStudyForEncounter } from "@/data/pastoral-studies";

afterEach(cleanup);
const id = "genesis-2026-09-08";
function Harness() {
  const [view, setView] = useState("attendance");
  const {setStudies, setSchedules} = useDemo();
  const {operation} = useEncounterOperation(id);
  return <><nav aria-label="Teste"><button onClick={() => setView("attendance")}>Teste presença</button><button onClick={() => setView("report")}>Teste relatório</button><button onClick={() => setView("leader")}>Teste líder</button><button onClick={() => setView("other")}>Teste outro encontro</button><button onClick={() => setView("study")}>Teste estudo</button>
    <button onClick={() => setStudies(current => current.map(study => ({...study, title: "Estudo corrigido", pdf: {...study.pdf, objectUrl: "blob:demo-pdf"}})))}>Corrigir estudo pastoral</button>
    <button onClick={() => setSchedules([])}>Retirar programação</button></nav>
    <output data-testid="report-status">{operation.status}</output>
    {view === "attendance" ? <AttendanceRegister meetingId={id}/> : view === "report" ? <ReportEditor meetingId={id}/> : view === "leader" ? <LeaderReports/> : view === "other" ? <ReportEditor meetingId="genesis-2026-09-15"/> : <EncounterStudy dateIso="2026-09-08"/>}</>;
}
function go(name: string) { fireEvent.click(screen.getByRole("button", {name})); }

describe("Fluxo compartilhado de encontro", () => {
  it("leva presença e visitante ao relatório, preserva rascunho, envia e registra leitura do Líder", () => {
    render(<DemoProvider><Harness/></DemoProvider>);
    const beatriz = screen.getByRole("group", {name: "Presença de Beatriz Almeida"});
    fireEvent.click(within(beatriz).getByLabelText("Presente"));
    go("+ Adicionar visitante");
    fireEvent.change(screen.getByLabelText("Nome *"), {target: {value: "Visitante de teste"}});
    go("Adicionar e marcar presente");
    go("Salvar presença");
    go("Teste relatório");
    expect(screen.getByText("8 presentes")).toBeTruthy();
    expect(screen.getByText(/Marcos Vinícius Costa, Visitante de teste/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Como foi o encontro?"), {target: {value: "Encontro registrado pela Secretaria."}});
    go("Salvar rascunho"); go("Teste presença"); go("Teste relatório");
    expect((screen.getByLabelText("Como foi o encontro?") as HTMLTextAreaElement).value).toBe("Encontro registrado pela Secretaria.");
    go("Enviar ao Líder");
    expect(screen.getByTestId("report-status").textContent).toBe("sentToLeader");
    expect((screen.getByLabelText("Como foi o encontro?") as HTMLTextAreaElement).readOnly).toBe(true);
    go("Teste líder");
    expect(screen.getByTestId("report-status").textContent).toBe("sentToLeader");
    go("Visualizar relatório");
    expect(screen.getByTestId("report-status").textContent).toBe("viewedByLeader");
    expect(screen.getByText("Encontro registrado pela Secretaria.")).toBeTruthy();
    go("Teste relatório");
    expect(screen.getByText("Visualizado pelo Líder")).toBeTruthy();
  });
  it("isola encontros e mantém a cópia enviada mesmo depois de alterações de presença e estudo", () => {
    render(<DemoProvider><Harness/></DemoProvider>);
    go("Teste relatório"); go("Enviar ao Líder");
    go("Teste outro encontro");
    expect(screen.getByText("0 presentes")).toBeTruthy();
    expect(screen.getByText("Estudo a definir")).toBeTruthy();
    expect(screen.getByRole("button", {name: "Enviar ao Líder"})).toBeTruthy();
    go("Corrigir estudo pastoral");
    go("Teste presença");
    fireEvent.click(within(screen.getByRole("group", {name: "Presença de Ana Martins"})).getByLabelText("Ausente"));
    go("Teste relatório");
    expect(screen.getByText("6 presentes")).toBeTruthy();
    expect(screen.queryByText("Estudo corrigido")).toBeNull();
  });
  it("propaga metadados e PDF pastoral para a comunidade e trata semana sem estudo", () => {
    render(<DemoProvider><Harness/></DemoProvider>);
    go("Corrigir estudo pastoral"); go("Teste estudo");
    expect(screen.getByRole("heading", {name: "Estudo corrigido"})).toBeTruthy();
    expect(screen.getByRole("link", {name: "Abrir PDF do estudo"}).getAttribute("href")).toBe("blob:demo-pdf");
    expect(screen.queryByText(/Pedidos de oração e acompanhamentos/)).toBeNull();
    go("Retirar programação");
    expect(screen.getByRole("heading", {name: "Estudo a definir"})).toBeTruthy();
    expect(screen.queryByRole("link", {name: "Abrir PDF do estudo"})).toBeNull();
  });
  it("resolve segunda a domingo e não reutiliza estudo na semana seguinte", () => {
    expect(resolveStudyForEncounter("2026-09-07")?.id).toBe("study-guided-by-spirit");
    expect(resolveStudyForEncounter("2026-09-13")?.id).toBe("study-guided-by-spirit");
    expect(resolveStudyForEncounter("2026-09-14")).toBeUndefined();
  });
});
