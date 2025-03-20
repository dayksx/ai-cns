import { SquareArrowOutUpRight } from "lucide-react";

const physicalAssets: { label: string; link?: string }[] = [
    {
        label: "France, Work office",
        link: "https//",
    },
    {
        label: "Brooklyn, Hacker House",
        link: "https//",
    },
    {
        label: "UK, Building",
        link: "https//",
    },
    {
        label: "Decentraland, 134,56",
        link: "https//",
    },
];

export function CnsCoreGoods() {
    return (
        <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-4  ">
            <span className="text-xl font-bold">Physical</span>
            <div className="flex flex-col gap-2">
                {physicalAssets.map((asset, i) => {
                    return (
                        <div
                            key={i}
                            className="flex flex-row items-center gap-2"
                        >
                            <span>{asset.label}</span>
                            {asset.link && (
                                <a href={asset.link}>
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
