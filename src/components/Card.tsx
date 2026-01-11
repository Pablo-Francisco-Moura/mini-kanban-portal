import type { TypeCard } from "../store/kanbanStore";

interface Props {
  card: TypeCard;
}

export function Card({ card }: Props) {
  return (
    <div
      style={{
        padding: 10,
        boxShadow: "0 1px 4px #0001",
        background: "#fff",
        borderRadius: 6,
      }}
    >
      <strong>{card.title}</strong>

      {card.description && (
        <p style={{ margin: "6px 0 0 0", fontSize: 14 }}>{card.description}</p>
      )}
    </div>
  );
}
