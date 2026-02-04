import React from "react";
import CalendarView from "./view";
import { useCalendarModel } from "./model";

const Calendar = () => {
  const model = useCalendarModel();
  return <CalendarView {...model} />;
};

export default Calendar;
