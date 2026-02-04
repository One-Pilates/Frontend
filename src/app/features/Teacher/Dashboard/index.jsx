import React, { useState, useCallback } from "react";
import { useDashboardModel } from "./model";
import DashboardView from "./view";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const model = useDashboardModel(selectedPeriod);

  const handleFilterChange = useCallback((newPeriod) => {
    setSelectedPeriod(newPeriod);
  }, []);

  return (
    <DashboardView
      {...model}
      selectedPeriod={selectedPeriod}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Dashboard;
