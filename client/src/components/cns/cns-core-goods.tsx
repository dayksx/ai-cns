import { SquareArrowOutUpRight } from "lucide-react";

const physicalAssets: { label: string; link?: string }[] = [
    {
        label: "Edge Esmeralda, CSY District",
        link: "https://www.edgeesmeralda.com/",
    },
    {
        label: "Crecimiento, Argentina, CSY Hacker House",
        link: "https://www.crecimiento.build/",
    },
    {
        label: "Nananu-i-Cake Fiji, 17.3333° S, 178.2167° E",
        link: "https//",
    },
    {
        label: "Decentraland, -21.83",
        link: "https://decentraland.org/places/place/?position=-21.83",
    },
];

export function CnsCoreGoods() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <span className="text-xl font-semibold text-gray-700 uppercase border-b pb-1">Physical</span>
            <div className="flex flex-col gap-2">
                {physicalAssets.map((asset, i) => {
                    return (
                        <div
                            key={i}
                            className="flex flex-row items-center gap-2 text-sm text-gray-200 bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition"
                        >
                            <span>{asset.label}</span>
                            {asset.link && (
                                <a href={asset.link} className="text-blue-500 hover:text-blue-400">
                                    <SquareArrowOutUpRight className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}