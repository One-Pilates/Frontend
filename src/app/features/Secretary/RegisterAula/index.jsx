import React from "react";
import { useRegisterAulaModel } from "./model";
import RegisterAulaView from "./view";

export default function RegisterAula() {
  const model = useRegisterAulaModel();
  return <RegisterAulaView {...model} />;
}
