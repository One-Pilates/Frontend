import React from "react";
import { useGerenciamentoAlunoModel} from "./model";
import GerenciamentoAlunoView  from "./view";

export default function GerenciamentoAluno() {
  const model = useGerenciamentoAlunoModel();
  return <GerenciamentoAlunoView {...model} />;
}
