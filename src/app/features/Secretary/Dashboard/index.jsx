import React, { useState, useCallback } from "react";
import { useDashboardSecretaryModel } from "./model";
import DashboardSecretaryView from "./view";

export default function DashboardSecretary() {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const model = useDashboardSecretaryModel(selectedPeriod);

  const handleFilterChange = useCallback((newPeriod) => {
    setSelectedPeriod(newPeriod);
  }, []);

  return (
    <DashboardSecretaryView
      {...model}
      selectedPeriod={selectedPeriod}
      onFilterChange={handleFilterChange}
    />
  );
}
