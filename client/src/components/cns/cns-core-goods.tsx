import { SquareArrowOutUpRight } from "lucide-react";

const physicalAssets = [
    {
        label: "Edge Esmeralda, CSY District",
        link: "https://www.edgeesmeralda.com/",
        image: "/assets/EdgeEsmeralda.jpeg", // Replace with an actual image URL
    },
    {
        label: "Crecimiento, Argentina, CSY Hacker House",
        link: "https://www.crecimiento.build/",
        image: "/assets/crecimiento.jpeg",
    },
    {
        label: "Nananu-i-Cake Fiji, 17.3333° S, 178.2167° E",
        link: "https://",
        image: "/assets/NananuFiji.jpeg",
    },
    {
        label: "Decentraland, -21.83",
        link: "https://decentraland.org/places/place/?position=-21.83",
        image: "/assets/Decentraland.jpeg",
    },
];

export function CnsCoreGoods() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <span className="text-lg font-semibold text-gray-700 uppercase border-b pb-1">
                Physical
            </span>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
                {physicalAssets.map((asset, i) => (
                    <a
                        key={i}
                        href={asset.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
                    >
                        {/* Image Box with Black & White Effect */}
                        <div
                            className="h-32 bg-cover bg-center transition-opacity group-hover:opacity-100"
                            style={{
                                backgroundImage: `url(${asset.image})`,
                                filter: "grayscale(80%) brightness(85%) contrast(110%)",
                                opacity: 0.9,
                            }}
                        />

                        {/* Text Box */}
                        <div className="bg-gray-800 text-white p-2 text-center text-sm font-semibold flex items-center justify-between">
                            <span className="truncate">{asset.label}</span>
                            <SquareArrowOutUpRight className="w-4 h-4 text-gray-300" />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
