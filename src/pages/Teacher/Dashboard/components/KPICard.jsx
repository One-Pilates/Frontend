import React from "react";

const KPICard = ({ title, value, subtitle, iconBgColor, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <div
          className="kpi-icon"
          style={{ backgroundColor: iconBgColor }}
        >
          {icon}
        </div>
      </div>

      <div className="kpi-card-body">
        <p className="kpi-title">{title}</p>
        <h2 className={typeof value === 'string' && value.length > 10 ? "kpi-value--text" : "kpi-value"}>{value}</h2>
        {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;
