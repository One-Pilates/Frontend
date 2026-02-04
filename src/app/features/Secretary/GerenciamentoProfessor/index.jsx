import React from "react";
import { useGerenciamentoProfessorModel} from "./model";
import GerenciamentoProfessorView  from "./view";

export default function GerenciamentoProfessor() {
  const model = useGerenciamentoProfessorModel();
  return <GerenciamentoProfessorView {...model} />;
}
