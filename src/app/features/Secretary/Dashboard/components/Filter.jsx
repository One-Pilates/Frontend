const Filter = ({ value = 30, onChange }) => {
  const periods = [
    { value: 7, label: "Últimos 7 dias" },
    { value: 30, label: "Últimos 30 dias" },
    { value: 90, label: "Últimos 90 dias" },
  ];

  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    if (onChange && typeof onChange === "function") {
      onChange(newValue);
    }
  };

  return (
    <select value={value} onChange={handleChange} className="period-filter">
      {periods.map((period) => (
        <option key={period.value} value={period.value}>
          {period.label}
        </option>
      ))}
    </select>
  );
};

export default Filter;