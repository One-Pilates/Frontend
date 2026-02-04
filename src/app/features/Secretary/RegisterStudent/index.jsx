import React from "react";
import { useRegisterStudentModel } from "./model";
import RegisterStudentView from "./view";

export default function RegisterStudent() {
  const model = useRegisterStudentModel();
  return <RegisterStudentView {...model} />;
}
