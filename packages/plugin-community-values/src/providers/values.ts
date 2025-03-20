import { composeContext, elizaLogger, generateText, ModelClass, type HandlerCallback, type IAgentRuntime, type Memory, type Provider, type State } from "@elizaos/core";
import axios from "axios";

interface CommunityValue {
    id: string;
    name: string;
    description: string;
    image: string;
    url: string;
    vault: {
        totalShares: number;
        positionCount: number;
        currentSharePrice: number;
    };
    counterVault: {
        totalShares: number;
        positionCount: number;
        currentSharePrice: number;
    };
}

interface GraphQLResponse {
    data: {
        total: {
            aggregate: {
                count: number;
            };
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
                    };
                };
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

export const valuesEndpoint = "https://prod.linea.intuition-api.com/v1/graphql";
export const communityValuesURL = "https://ethereum-values.consensys.io/";

const valuesInfoTemplate = `# Contextual Message on Consensys Network State (CNS) Values for @recipient  
  Based on previous discussions, this message provides additional context about CNS community values.  

  {{recentMessages}}  

  # Instructions:  
  {{senderName}} has mentioned CNS values. Your task is to ensure that @recipient fully understands them by adding missing context, including:  

  - CNS values are proposed dynamically by the community.  
  - Their importance is weighted based on staked ETH.  
  - The community votes on values through this Dapp: https://ethereum-values.consensys.io/ (ensure the link is included if not already shared).  
  - Each value has an associated vault that reflects total shares, position count, and the current share price.  

  Respond in {{agentName}}'s natural speaking style. If essential information is missing, ask {{senderName}} for the specifics needed to complete the request, maintaining {{agentName}}'s tone.`;  

// Function to fetch structured community values
const fetchCommunityValues = async (): Promise<CommunityValue[]> => {
    try {
        const graphqlQuery = {
            query: `
                query GetTriplesWithPositions(
                  $limit: Int
                  $offset: Int
                  $orderBy: [triples_order_by!]
                  $where: triples_bool_exp
                ) {
                  total: triples_aggregate(where: $where) {
                    aggregate {
                      count
                    }
                  }
                  triples(limit: $limit, offset: $offset, order_by: $orderBy, where: $where) {
                    id
                    object {
                      id
                      value {
                        thing {
                          name
                          description
                          image
                          url
                        }
                      }
                    }
                    vault {
                      total_shares
                      position_count
                      current_share_price
                    }
                    counter_vault {
                      total_shares
                      position_count
                      current_share_price
                    }
                  }
                }
            `,
            variables: {
                "limit": 10,
                "offset": 0,
                "where": {
                    "predicate_id": { "_eq": 3 },
                    "subject_id": { "_eq": 2 }
                },
                "orderBy": {
                    "object": {
                        "id": "asc"
                    }
                }
            }
        };

        const response = await axios.post<GraphQLResponse>(valuesEndpoint, graphqlQuery, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.data.triples.map(triple => ({
            id: triple.id,
            name: triple.object.value.thing.name,
            description: triple.object.value.thing.description,
            image: triple.object.value.thing.image,
            url: triple.object.value.thing.url,
            vault: {
                totalShares: triple.vault.total_shares,
                positionCount: triple.vault.position_count,
                currentSharePrice: triple.vault.current_share_price,
            },
            counterVault: {
                totalShares: triple.counter_vault.total_shares,
                positionCount: triple.counter_vault.position_count,
                currentSharePrice: triple.counter_vault.current_share_price,
            }
        }));

    } catch (error) {
        console.error("Error fetching values from GraphQL API:", error);
        return [];
    }
};

// Provider function that converts structured data into a string
const valuesProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State, callback?: HandlerCallback) => {
        elizaLogger.log("⏳ Provider: Fetch registered values to provide them to the Agent");
        try {
            const values = await fetchCommunityValues();

            if (values.length === 0) {
                throw new Error("No values found.");
            }

            // Format the values into a readable string including vault information
            const formattedValues = values.map(value =>
                `- **${value.name}**: ${value.description}  
                  [🔗 Link](${value.url})  
                  📊 **Vault Stats**:  
                  - **Total Shares**: ${value.vault.totalShares}  
                  - **Position Count**: ${value.vault.positionCount}  
                  - **Current Share Price**: ${value.vault.currentSharePrice}  
                  🏦 **Counter Vault Stats**:  
                  - **Total Shares**: ${value.counterVault.totalShares}  
                  - **Position Count**: ${value.counterVault.positionCount}  
                  - **Current Share Price**: ${value.counterVault.currentSharePrice}`
            ).join("\n\n");

            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            const valuesInfoContext = composeContext({
                state,
                template: valuesInfoTemplate,
            });

            const communityValuesInfo = await generateText({
                runtime,
                context: valuesInfoContext,
                modelClass: ModelClass.SMALL,
            });

            if (callback) {
                callback({
                    text: communityValuesInfo,
                    content: {
                        url: {
                            communityValuesURL
                        },
                    },
                });
            }

            return `**The Consensys Network State (CNS) values, voted on by the community through ETH staking on this platform ${communityValuesURL}, are:**\n\n${formattedValues}`;

        } catch (error) {
            console.error("Error in valuesProvider:", error);
        }
    },
};

export { valuesProvider, fetchCommunityValues };
