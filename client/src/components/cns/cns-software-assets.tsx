import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router";

type CampaignType = "grant" | "hackathon" | "incubator" | "bounty" | "incubator" | null;

interface SoftwareAsset {
    label: string;
    description: string;
    link: string;
    image: string;
    campaign?: {
        type: CampaignType;
        label: string;
        link?: string;
    };
}

const softwareAssets: SoftwareAsset[] = [
    {
        label: "[Verax] Attestation Service",
        description: "On-chain attestation service",
        link: "hhttps://docs.ver.ax/verax-documentation",
        image: "verax-logo.png",
        campaign: {
            type: "grant",
            label: "Open Grant",
            link: "https://example.com/grant"
        }
    },
    {
        label: "[DeleGator] Delegation Tookit",
        description: "Delegation mechanism and smart account factory",
        link: "https://docs.gator.metamask.io/",
        image: "https://miro.medium.com/v2/da:true/resize:fit:1024/0*1lsqKyrFNYVZ6UHA",
        campaign: {
            type: "hackathon",
            label: "Hackathon",
            link: "https://example.com/hackathon"
        }
    },
    {
        label: "[MetaMask Smart Account] Smart Account Factory",
        description: "Smart account with social login, multisig and passkeys",
        link: "https://docs.gator.metamask.io/how-to/create-delegator-account",
        image: "https://cimg.co/wp-content/uploads/2024/07/09075010/1720511409-1720511173642_processed.jpg",
        campaign: {
            type: "bounty",
            label: "Bounty",
            link: "https://example.com/bounty"
        }
    },
    {
        label: "[Agreement Protocol] Onchain Agreement Protocol",
        description: "Standard agreement protocol with onchain compensation",
        link: "https://sobol.io/",
        image: "sobol-logo.png",
        campaign: {
            type: "incubator",
            label: "Incubator",
            link: "https://example.com/award"
        }
    },
];

const getCampaignColor = (type: CampaignType) => {
    switch (type) {
        case "grant":
            return "bg-green-500";
        case "hackathon":
            return "bg-purple-500";
        case "incubator":
            return "bg-blue-500";
        case "bounty":
            return "bg-yellow-500";
        case "incubator":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

export function CnsSoftwareAssets() {
    return (
        <div className="flex flex-col gap-4 p-4">
            <span className="text-lg font-semibold text-gray-700 uppercase border-b pb-1">
                Building blocks
            </span>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-6">
                {softwareAssets.map((asset, i) => (
                    <a
                        key={i}
                        href={asset.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 relative"
                    >
                        {/* Campaign Label */}
                        {asset.campaign && (
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(asset.campaign?.link, '_blank');
                                }}
                                className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getCampaignColor(asset.campaign.type)} cursor-pointer hover:opacity-90 z-10 shadow-md`}
                            >
                                {asset.campaign.label}
                            </div>
                        )}

                        {/* Image Box with Black & White Effect */}
                        <div
                            className="h-32 bg-cover bg-center transition-all duration-300 group-hover:opacity-100"
                            style={{
                                backgroundImage: `url(${asset.image})`,
                                filter: "grayscale(95%) brightness(60%)",
                                opacity: 0.75,
                            }}
                        />

                        {/* Text Box */}
                        <div className="bg-gray-800 text-white p-2 text-center text-sm font-semibold flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="truncate">{asset.label}</span>
                                <SquareArrowOutUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                            <span className="text-xs text-gray-400">{asset.description}</span>
                        </div>
                    </a>
                ))}
            </div>
            <Link
                to="https://permissionless.snaps.metamask.io"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-600 transition-shadow w-fit shadow-md hover:shadow-lg"
            >
                Explore builders infrastructure
            </Link>
        </div>
    );
} 