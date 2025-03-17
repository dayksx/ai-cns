import { getEmbeddingZeroVector, IMemoryManager, MemoryManager, UUID, type IAgentRuntime, type Memory, type Provider, type State } from "@elizaos/core";
import axios from "axios";
import { valuesEndpoint } from "./values";
import { randomUUID } from "crypto";

interface GraphQLResponse {
    data: {
      total: {
        aggregate: {
          count: number;
        }
      };
      triples: Array<{
        id: string;
        object: {
          id: string;
          value: {
            thing: {
              name: string;
              description: string;
              image: string;
              url: string;
            }
          }
        };
        vault: {
          total_shares: number;
          position_count: number;
          current_share_price: number;
        };
        counter_vault: {
          total_shares: number;
          position_count: number;
          current_share_price: number;
        };
      }>;
    };
}

// Alignment levels for providing status messages
const alignmentLevels = [
    {
        minScore: -10,
        statusMessages: [
            "{{userId}} is actively opposing the community values and promoting contradictory principles",
            "{{userId}} has expressed strong views that conflict with core community values",
            "{{userId}} appears to fundamentally misunderstand or reject the community's value system",
            "{{userId}} is advocating for positions that undermine the community's established values",
            "{{userId}} has demonstrated significant misalignment with community principles"
        ],
    },
    {
        minScore: -5,
        statusMessages: [
            "{{userId}} is showing resistance to several key community values",
            "{{userId}} seems to disagree with important aspects of the community value system",
            "{{userId}} has expressed views that contradict some community principles",
            "{{userId}} appears to be misaligned with multiple community values",
            "{{userId}} has shown notable inconsistency with the community's value framework"
        ],
    },
    {
        minScore: -2,
        statusMessages: [
            "{{userId}} is slightly misaligned with a few community values",
            "{{userId}} has expressed minor disagreements with certain community principles",
            "{{userId}} shows some hesitation about fully embracing community values",
            "{{userId}} appears to have reservations about specific community principles",
            "{{userId}} has demonstrated small inconsistencies with the community value system"
        ],
    },
    {
        minScore: 0,
        statusMessages: [
            "{{userId}} is neutral regarding community values",
            "{{userId}} hasn't clearly expressed alignment or misalignment with community values",
            "{{userId}} maintains a balanced perspective on community principles",
            "{{userId}} shows neither strong support nor opposition to the community value system",
            "{{userId}} has not demonstrated a definitive position on community values"
        ],
    },
    {
        minScore: 2,
        statusMessages: [
            "{{userId}} shows basic alignment with some community values",
            "{{userId}} has expressed agreement with certain community principles",
            "{{userId}} demonstrates understanding of key community values",
            "{{userId}} appears to support fundamental aspects of the community value system",
            "{{userId}} has shown interest in community principles"
        ],
    },
    {
        minScore: 5,
        statusMessages: [
            "{{userId}} is well-aligned with most community values",
            "{{userId}} consistently demonstrates support for community principles",
            "{{userId}} actively promotes ideas that align with community values",
            "{{userId}} shows strong understanding and appreciation of the community value system",
            "{{userId}} regularly expresses views consistent with community principles"
        ],
    },
    {
        minScore: 8,
        statusMessages: [
            "{{userId}} is highly aligned with all core community values",
            "{{userId}} passionately advocates for the community's value system",
            "{{userId}} demonstrates exceptional understanding and embodiment of community principles",
            "{{userId}} consistently champions the community's foundational values",
            "{{userId}} exemplifies the ideals expressed in the community value framework"
        ],
    },
];

// Function to fetch community values from GraphQL API
async function fetchCommunityValues(endpoint: string): Promise<string[]> {
    try {
        const graphqlQuery = {
            query: `
                query GetTriplesWithPositions(
                    $limit: Int
                    $offset: Int
                    $orderBy: [triples_order_by!]
                    $where: triples_bool_exp
                ) {
                    triples(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
                        object {
                            value {
                                thing {
                                    name
                                    description
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                "limit": 100,
                "offset": 0,
                "where": {
                    "predicate_id": {
                        "_eq": 3
                    },
                    "subject_id": {
                        "_eq": 2
                    }
                },
                "orderBy": {
                    "vault": {
                        "total_shares": "desc"
                    }
                }
            }
        };

        const response = await axios.post<GraphQLResponse>(
            valuesEndpoint,
            graphqlQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data.data.triples.map(triple => 
            triple.object.value.thing.name.toLowerCase()
        );
    } catch (error) {
        console.error("Error fetching community values:", error);
    }
}

// Generate keyword variations for value matching
function generateValueKeywords(values: string[]): Record<string, string[]> {
    const valueKeywords: Record<string, string[]> = {};
    
    for (const value of values) {
        const keywords = [value];
        
        // Add variations based on the value
        switch(value) {
            case "decentralization":
                keywords.push("decentralized", "distribute", "distributed", "peer-to-peer", "p2p", "trustless");
                break;
            case "censorship resistance":
                keywords.push("uncensored", "uncensorable", "freedom of speech", "free speech", "permissionless");
                break;
            case "transparency":
                keywords.push("transparent", "clarity", "open", "visible", "auditable");
                break;
            case "openness":
                keywords.push("open-source", "collaborative", "accessible", "inclusive");
                break;
            case "privacy":
                keywords.push("private", "confidential", "anonymous", "secret", "secure");
                break;
            case "sovereignty":
                keywords.push("sovereign", "self-sovereign", "autonomy", "self-custody", "ownership");
                break;
            // Add more value-specific keywords as needed
            default:
                // Generate common variations
                if (value.endsWith("y")) {
                    keywords.push(value.slice(0, -1) + "ies");
                }
                if (value.endsWith("ness")) {
                    keywords.push(value.slice(0, -4));
                }
                keywords.push(value + "s");
        }
        
        valueKeywords[value] = keywords;
    }
    
    return valueKeywords;
}

// Words that oppose community values (adjust based on your specific values)
const opposingWords: Record<string, string[]> = {
    "decentralization": ["centralized", "central", "controlling", "control", "authority", "centralization", "monopoly"],
    "censorship resistance": ["censorship", "censor", "ban", "silence", "suppress", "restrict", "control content"],
    "transparency": ["secrecy", "hidden", "obscure", "opaque", "closed"],
    "openness": ["closed", "proprietary", "exclusive", "restricted", "limited"],
    "privacy": ["surveillance", "monitoring", "tracking", "exposure", "intrusion"],
    "sovereignty": ["dependence", "controlled", "restricted", "dependent", "managed"]
};

const valueAlignmentEvaluator: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State) => {

        // Create Agent Memory for Users Value Score tracking
        let valueScoring: IMemoryManager = new MemoryManager({
            runtime: runtime,
            tableName: "valueAlignmentScore",
        });
        runtime.registerMemoryManager(valueScoring);
        // runtime.getMemoryManager("valueAlignmentTracking").getMemories({ roomId: message.roomId});
        

        // Fetch community values
        const communityValues = await fetchCommunityValues(valuesEndpoint);
        const valueKeywords = generateValueKeywords(communityValues);
        
        const now = Date.now();
        const thirtyMinutesAgo = now - 30 * 60 * 1000;
        
        // Get recent messages from this user
        const recentMessages = await runtime.messageManager.getMemories({
            roomId: message.roomId,
            start: thirtyMinutesAgo,
            end: now,
            count: 15,
            unique: false,
        });
        
        let alignmentScore = 0;
        
        for (const recentMessage of recentMessages) {
            const messageText = recentMessage?.content?.text?.toLowerCase();
            if (!messageText) {
                continue;
            }
            
            // Check alignment with community values
            for (const value of communityValues) {
                // Check for positive alignment
                const keywords = valueKeywords[value] || [value];
                for (const keyword of keywords) {
                    if (messageText.includes(keyword)) {
                        // If directly mentions value in a positive context
                        alignmentScore += 1;
                        break;
                    }
                }
                
                // Check for opposition to values
                const opposingTerms = opposingWords[value] || [];
                for (const term of opposingTerms) {
                    if (messageText.includes(term)) {
                        // If promotes concepts that contradict values
                        alignmentScore -= 1;
                        break;
                    }
                }
            }
            
            // Additional contextual analysis
            // Positive indicators of community alignment
            if (messageText.includes("community") || 
                messageText.includes("collaborate") || 
                messageText.includes("contribute") ||
                messageText.includes("benefit") ||
                messageText.includes("value") ||
                messageText.includes("improve")) {
                alignmentScore += 0.5;
            }
            
            // Negative indicators
            if (messageText.includes("control") || 
                messageText.includes("restrict") || 
                messageText.includes("limit") ||
                messageText.includes("ban") ||
                messageText.includes("eliminate")) {
                // Context-dependent, so smaller negative impact
                alignmentScore -= 0.3;
            }
        }
        
        // Get alignment level based on score
        const alignmentLevel = 
            alignmentLevels
                .filter(level => alignmentScore >= level.minScore)
                .pop() || alignmentLevels[3]; // Default to neutral
        
        // Select random message from appropriate level
        const randomIndex = Math.floor(Math.random() * alignmentLevel.statusMessages.length);
        const selectedMessage = alignmentLevel.statusMessages[randomIndex];

        valueScoring.createMemory({
            id: crypto.randomUUID() as UUID,
            userId: message.userId,
            agentId: runtime.agentId,
            content: { text: message.userId + " has a value alignment score of " + alignmentScore}, // Adjust based on your Content type
            roomId: message.roomId,
            embedding: getEmbeddingZeroVector()
        }, false);

        if (alignmentScore > 2) {
            console.log(">>>> send ERC20 $WAGMAI token");
        }

        return {
            message: selectedMessage.replace("{{userId}}", message.userId),
            score: alignmentScore,
            values: communityValues
        };
    },
};

export { valueAlignmentEvaluator };