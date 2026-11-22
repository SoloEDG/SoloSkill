import type { FishSpecies } from "../../../shared/types";
export function FishIllustration({
  fish,
  locked = false,
}: {
  fish: FishSpecies;
  locked?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 180 85"
      role="img"
      aria-label={locked ? "尚未发现的鱼种" : fish.name}
      className={"fish-art " + (locked ? "locked" : "")}
    >
      <path d="M40 43L13 20l5 27-5 22 30-22" fill={fish.color} />
      <path
        d="M51 31q25-31 44-19l15 16m-36 27 19 21 17-20"
        fill={fish.color}
        opacity=".8"
      />
      <path
        d="M37 44Q73 7 124 27q28 7 38 20-26 32-69 20Q54 61 37 44Z"
        fill={fish.color}
      />
      <path d="M45 45q50-17 105 3-50 17-105-3" fill="#f3f3de" opacity=".35" />
      <path
        d="M114 32q-9 16 2 28m-42-20 17 7-13 12"
        fill="none"
        stroke="#3c625e"
        opacity=".4"
        strokeWidth="2"
      />
      <circle cx="140" cy="40" r="3" fill="#284943" />
      <circle cx="141" cy="39" r="1" fill="#fff" />
      <path d="M151 50h10" stroke="#49675e" strokeWidth="1.4" />
      {fish.id === "carp" && (
        <path
          d="M61 32l19 23m6-29 18 31m8-29 14 29"
          stroke="#c0714b"
          strokeWidth="4"
          opacity=".6"
        />
      )}
    </svg>
  );
}
