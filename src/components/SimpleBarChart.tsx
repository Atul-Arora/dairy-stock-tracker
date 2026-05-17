type Point = { label: string; value: number };

export default function SimpleBarChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((point) => point.value));
  return (
    <div className="chart">
      {points.map((point) => (
        <div className="bar-row" key={point.label}>
          <span>{point.label}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(point.value / max) * 100}%` }} /></div>
          <strong>{point.value}</strong>
        </div>
      ))}
    </div>
  );
}
