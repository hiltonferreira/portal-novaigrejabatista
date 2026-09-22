"use client";
import { useDemo } from "@/components/demo-provider";
import { resolveStudyForEncounter } from "@/data/pastoral-studies";
export function EncounterStudy({dateIso}: {dateIso: string}) {
  const {studies, schedules} = useDemo();
  const study = resolveStudyForEncounter(dateIso, studies, schedules);
  return <div><h3>{study?.title ?? "Estudo a definir"}</h3>{study ? <><p>Lição {study.lessonNumber} · {study.baseReference}</p>{study.pdf.objectUrl ? <a className="action-link secondary" href={study.pdf.objectUrl} target="_blank" rel="noopener noreferrer">Abrir PDF do estudo</a> : <p>PDF ainda indisponível nesta demonstração.</p>}</> : <p>Aguardando a programação oficial desta semana.</p>}</div>;
}
