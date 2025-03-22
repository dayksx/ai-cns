import type { FunctionComponent, JSX } from "react";
import { Link } from "react-router";
import { type Hex } from "viem";
import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";
import { JazzIcon } from "./jazzicon";
import { Bot, User } from "lucide-react"; // Import icons

export type AccountCardShortProps = {
    address: Hex;
    profileType: string; // Profile type is a prop
    agentNature: string; // New prop for AI vs Human
    showOnlyProfileType?: boolean;
};

// Define color map for different profile types
const profileColors: Record<string, string> = {
    maker: "bg-gray-700 text-gray-200", // Muted gray for a neutral, sophisticated look
    investor: "bg-teal-800 text-teal-200", // Deep teal, professional and calm
    instigator: "bg-indigo-900 text-indigo-200", // Dark indigo, bold yet refined
};

const agentIcons: Record<string, JSX.Element> = {
    human: <User className="w-4 h-4 mr-1 text-gray-300" />, // Subtle gray for human
    AI: <Bot className="w-4 h-4 mr-1 text-blue-300" />, // Blue tint for AI agent
};

export const AccountCardShort: FunctionComponent<AccountCardShortProps> = ({
    address,
    profileType,
    agentNature,
    showOnlyProfileType = false,
}) => {
    const { data } = useEnsName({ address, chainId: mainnet.id });
    const shortAddress = address.replace(/^(.{4}).*(.{3})$/, "$1...$2");
    const title = `${data ?? shortAddress}`;

    const tagColor = profileColors[profileType] || "bg-gray-800 text-gray-300"; // Default color

    return (
        <Link to={`/netizens/${address}`}>
            <div className="w-25 h-[11.125rem] p-2 rounded-md transition-all hover:bg-gray-800 group relative overflow-hidden">
                <div className="flex flex-col items-center text-center gap-3">
                    {/* JazzIcon */}
                    <div className="-mb-1">
                        <JazzIcon address={address} size={80} />
                    </div>

                    {/* Title */}
                    <p className="font-normal text-white truncate w-28">
                        {title}
                    </p>

                    {/* Profile Type Tag with Icon */}
                    <span
                        className={`flex items-center px-3 py-1 text-sm font-semibold rounded-lg ${tagColor}`}
                    >
                        {agentIcons[agentNature]} {/* AI or Human icon */}
                        {showOnlyProfileType
                            ? profileType
                            : agentNature.toUpperCase()}
                    </span>
                </div>

                {/* Hover Image Effect */}
                <div className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:blur-[60px] group-hover:contrast-90 group-hover:saturate-130 group-hover:scale-125"></div>
            </div>
        </Link>
    );
};
