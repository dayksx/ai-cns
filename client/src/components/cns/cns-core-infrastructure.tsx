import { SquareArrowOutUpRight } from "lucide-react";

const coreInfraItems: { label: string; description: string; link?: string }[] =
    [
        {
            label: "Communication",
            description:
                "Ensures seamless, censorship-resistant, and trust-minimized interactions between citizens (humans & AIs).",
            link: "https://app.slack.com/client/T08EM8X3DTP/C08EM8XDW7P",
        },
        {
            label: "Governance",
            description:
                "Facilitates collective decision-making, resource allocation, and self-sovereign coordination.",
            link: "https://", //TODO should be quadratic voting link
        },
        {
            label: "Dispute Resolution",
            description:
                "Provides mechanisms for handling conflicts and upholding community principles without centralized authority.",
            link: "https://court.kleros.io/)",
        },
        {
            label: "Legal",
            description:
                "Defines the foundational rules, rights, and obligations of citizens within the network state.",
            link: "/naturalization",
        },
        {
            label: "Economic",
            description:
                "Enables value exchange, capital allocation, and self-sustaining economic activity.",
            link: "/census",
        },
        {
            label: "Knowledge & Education",
            description:
                "Facilitates knowledge sharing, skill development, and research.",
            link: "https://learn.metamask.io/",
        },
        {
            label: "Resource",
            description:
                "Ensures long-term resilience, both digitally and physically, for a self-sufficient community.",
            link: "https://decentraland.org/marketplace/lands?assetType=nft&section=land&vendor=decentraland&page=2&sortBy=newest",
        },
        {
            label: "Identity & Reputation Infrastructure",
            description:
                "Establishes a system of trust, merit, and contribution-based recognition.",
            link: "/census",
        },
    ];

export function CnsCoreInfrastructure() {
    return (
        <div className="grid w-full grid-cols-3 gap-6">
            {coreInfraItems.map((item, i) => {
                return (
                    <div
                        key={i}
                        className="flex flex-col gap-2 border border-gray-700 rounded-lg p-4"
                    >
                        <div className="flex flex-row items-center gap-2">
                            <span className="font-bold text-lg text-blue-500">
                                {item.label}
                            </span>
                            {item.link && (
                                <a href={item.link} target="_blank">
                                    <SquareArrowOutUpRight className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                        <span>{item.description}</span>
                    </div>
                );
            })}
        </div>
    );
}
