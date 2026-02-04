import React from "react";
import { useCalendarSecretaryModel } from "./model";
import CalendarSecretaryView from "./view";

export default function CalendarSecretary() {
  const model = useCalendarSecretaryModel();
  return <CalendarSecretaryView {...model} />;
}
