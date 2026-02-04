import React from "react";
import { useViewProfileModel } from "./model";
import ViewProfile from "./view";

export default function ProfileView() {
  const model = useViewProfileModel();
  return <ViewProfile {...model} />;
}
