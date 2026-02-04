import React from "react";
import { useRegisterTeacherModel } from "./model";
import RegisterTeacherView from "./view";

export default function RegisterTeacher() {
  const model = useRegisterTeacherModel();
  return <RegisterTeacherView {...model} />;
}
