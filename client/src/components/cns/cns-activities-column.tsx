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
        <>
            <div className="border border-blue-500 rounded-lg p-4 ">
                <div className="text-lg text-center font-bold mb-4 uppercase">
                    {title}
                </div>
                {activities?.length === 0 && (
                    <div className="italic text-center text-gray-400">
                        No topic yet
                    </div>
                )}
                {activities?.map((a) => {
                    return (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="border border-yellow-500 rounded p-2 my-2">
                                    <div className="text-lg font-bold">
                                        {a.title}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {a.description?.substring(0, 100)}
                                        {a.description?.length > 100 && "..."}
                                    </div>
                                    <div className="grid grid-cols-2 mt-2">
                                        <div className="text-xs text-gray-400">
                                            <Badge className="bg-blue-500 text-white">
                                                <span className="lowercase">
                                                    {a.category}
                                                </span>
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <div className="flex justify-end gap-1 items-center">
                                                <ThumbsUp width={15} />
                                                {a.upvotes}
                                            </div>
                                            <div className="flex justify-end gap-1 items-center">
                                                <ThumbsDown width={15} />
                                                {a.downvotes}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <div className="w-80 bg-black border border-gray-200 rounded-lg text-xs text-gray-200 p-3">
                                    {a.description}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </>
    );
}
