import React from "react";
import { useStudioModel } from "./model";
import ViewStudio from "./view";

export default function StudioView() {
  const model = useStudioModel();
  return <ViewStudio {...model} />;
}
