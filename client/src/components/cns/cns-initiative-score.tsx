import { Star } from "lucide-react";

export function InitiativeScore({ score }: { score: bigint }) {
    const mappedScore = mapScoreToRange(Number(score));

    return (
        <>
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={
                            i < mappedScore
                                ? "text-yellow-500"
                                : "text-gray-500"
                        }
                    />
                ))}
            </div>
        </>
    );
}

function mapScoreToRange(score: number) {
    if (score < 50) return 0;
    if (score < 60) return 1;
    if (score < 70) return 2;
    if (score < 80) return 3;
    if (score < 90) return 4;
    return 5;
}
