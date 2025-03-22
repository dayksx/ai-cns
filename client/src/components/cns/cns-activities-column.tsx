import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Badge } from "../ui/badge";
import { Tooltip } from "../ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export function ActivitiesColumn({
    title,
    activities,
}: {
    title: string;
    activities: any[];
}) {
    return (
        <div className="border border-gray-700 bg-gray-900 rounded-lg p-4 shadow-lg">
            <div className="text-lg text-center font-bold mb-4 uppercase text-gray-200">
                {title}
            </div>
            {activities?.length === 0 ? (
                <div className="italic text-center text-gray-500">
                    No topic yet
                </div>
            ) : (
                activities.map((a, index) => (
                    <Tooltip key={index}>
                        <TooltipTrigger asChild>
                            <div className="border border-gray-700 bg-gray-800 rounded-lg p-3 my-2 hover:bg-gray-700 transition-all">
                                {/* Title */}
                                <div className="text-sm font-bold text-gray-100">
                                    {a.title}
                                </div>

                                {/* Description */}
                                <div className="text-xs text-gray-400">
                                    {a.description?.substring(0, 100)}
                                    {a.description?.length > 100 && "..."}
                                </div>

                                {/* Category + Voting Icons */}
                                <div className="flex justify-between items-center mt-3">
                                    {/* Category Badge */}
                                    <div className="text-xs text-gray-400">
                                        <Badge className="bg-blue-500 text-white px-2 py-1">
                                            <span className="lowercase">
                                                {a.category}
                                            </span>
                                        </Badge>
                                    </div>

                                    {/* Voting Icons */}
                                    <div className="flex gap-4 text-gray-400 text-xs">
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp
                                                size={15}
                                                className="text-green-400"
                                            />
                                            {a.upvotes}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ThumbsDown
                                                size={15}
                                                className="text-red-400"
                                            />
                                            {a.downvotes}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                            <div className="w-80 bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-300 p-3 shadow-md">
                                {a.description}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))
            )}
        </div>
    );
}
