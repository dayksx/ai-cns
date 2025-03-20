import { Star } from "lucide-react";

export function InitiativeScore({ score }: { score: bigint }) {
    return (
        <>
            <div className="mr-4">AI score</div>
            <div className="flex gap-1">
                <Star
                    className={` ${
                        score >= 1 ? "text-yellow-500" : "text-gray-500"
                    }`}
                />
                <Star
                    className={`${
                        score >= 2 ? "text-yellow-500" : "text-gray-500"
                    }`}
                />
                <Star
                    className={` ${
                        score >= 3 ? "text-yellow-500" : "text-gray-500"
                    }`}
                />
            </div>
        </>
    );
}
