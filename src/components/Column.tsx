import { Card } from "./Card";
import type { TypeColumn } from "../store/kanbanStore";

interface Props {
  column: TypeColumn;
}

export function Column({ column }: Props) {
  const cards = column.cards;

  return (
    <div
      style={{
        padding: 12,
        minWidth: 250,
        background: "#f4f4f4",
        borderRadius: 8,
      }}
    >
      <h3>{column.name}</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
