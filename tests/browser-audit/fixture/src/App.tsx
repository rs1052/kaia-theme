import "./styles.css";

type CardProps = {
  title: string;
  count: number;
  active?: boolean;
};

export function Card({ title, count, active = false }: CardProps) {
  const label = `${title}: ${count}`;
  return (
    <button className={active ? "card card--active" : "card"} type="button">
      <strong>{label}</strong>
      <span aria-label="status">Ready</span>
    </button>
  );
}

export const cards = [
  <Card key="first" title="Kaia" count={4} active />,
  <Card key="second" title="OLED" count={0} />,
];
