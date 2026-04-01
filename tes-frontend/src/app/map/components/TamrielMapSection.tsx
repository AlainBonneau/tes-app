import Image from "next/image";
import type { Region } from "../../types/region";

const ORIGINAL_WIDTH = 1200;
const ORIGINAL_HEIGHT = 800;

type TamrielMapSectionProps = {
  regions: Region[];
  selected: number | null;
  setSelected: React.Dispatch<React.SetStateAction<number | null>>;
  loading: boolean;
};

export default function TamrielMapSection({
  regions,
  selected,
  setSelected,
  loading,
}: TamrielMapSectionProps) {
  return (
    <div
      className="relative mb-6 w-full max-w-6xl"
      style={{
        aspectRatio: `${ORIGINAL_WIDTH} / ${ORIGINAL_HEIGHT}`,
      }}
    >
      <Image
        src="/assets/tamriel.png"
        alt="Carte de Tamriel"
        fill
        className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
        draggable={false}
        style={{ objectFit: "contain" }}
      />

      <svg
        viewBox={`0 0 ${ORIGINAL_WIDTH} ${ORIGINAL_HEIGHT}`}
        className="absolute top-0 left-0 w-full h-full"
      >
        {regions.map((region) => (
          <circle
            key={region.id}
            cx={region.x}
            cy={region.y}
            r={selected === region.id ? 14 : 11}
            fill={selected === region.id ? "#e1c699" : "#5a2a2a"}
            stroke="#222"
            strokeWidth={selected === region.id ? 5 : 3}
            className="transition-all duration-200 outline-none focus:ring-2 focus:ring-gold cursor-pointer"
            tabIndex={0}
            aria-label={region.name}
            onClick={() => setSelected(region.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelected(region.id);
              }
            }}
            onMouseEnter={(e) => {
              if (selected !== region.id) {
                e.currentTarget.setAttribute("fill", "#e1c699");
              }
            }}
            onMouseLeave={(e) => {
              if (selected !== region.id) {
                e.currentTarget.setAttribute("fill", "#5a2a2a");
              }
            }}
          >
            <title>{region.name}</title>
          </circle>
        ))}
      </svg>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-parchment/80 rounded-xl">
          <span className="text-blood font-bold text-xl animate-pulse">
            Chargement…
          </span>
        </div>
      )}
    </div>
  );
}
