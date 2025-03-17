import {
    type IAgentRuntime,
    type Memory,
    type State,
    type Action,
    type ActionExample,
    type HandlerCallback,
    elizaLogger,
    composeContext,
    ModelClass,
    generateText
} from "@elizaos/core";
import axios from "axios";
import { communityValuesURL, valuesEndpoint } from "../providers";

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

const valuesInfoTemplate = `# Contextual Message on Consensys Network State (CNS) Values for @recipient  
  Based on previous discussions, this message provides additional context about CNS community values.  
  
  {{recentMessages}}  
  
  # Instructions:  
  {{senderName}} has mentioned CNS values. Your task is to ensure that @recipient fully understands them by adding missing context, including:  
  
  - CNS values are proposed dynamically by the community.  
  - Their importance is weighted based on staked ETH.  
  - The community votes on values through this Dapp: https://ethereum-values.consensys.io/ (ensure the link is included if not already shared).  
  
  Respond in {{agentName}}'s natural speaking style. If essential information is missing, ask {{senderName}} for the specifics needed to complete the request, maintaining {{agentName}}'s tone.`;

export const listValuesAction: Action = {
    name: "LIST_VALUES",
    similes: [
        "FETCH_VALUES",
        "SHOW_VALUES",
        "LIST_VALUES",
    ],
    description:
        "Fetches and displays the current values of the Consensys Network State with additional context about the underlying mechanism.",

    validate: async (_runtime: IAgentRuntime, _message: Memory) => {
        elizaLogger.info(`Network State Values validation`);
        return true;
    },
    
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.info(`Network State Values handling`);

        try {
            // GraphQL API endpoint - replace with your actual endpoint
            
            // GraphQL query and variables
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

            // Make the GraphQL request
            const response = await axios.post<GraphQLResponse>(
                valuesEndpoint,
                graphqlQuery,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add any authentication headers if needed
                        // 'Authorization': 'Bearer YOUR_TOKEN',
                    }
                }
            );

            // Extract the values from the response
            const values = response.data.data.triples.map(triple => 
                triple.object.value.thing.name
            );

            // Format the values as a comma-separated list
            const formattedValues = values.join(", ");
            
            // Setup state for context generation
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }
            
            // Generate additional context information about the community values
            const valuesInfoContext = composeContext({
                state,
                template: valuesInfoTemplate,
            });
            
            const communityValuesInfo = await generateText({
                runtime,
                context: valuesInfoContext,
                modelClass: ModelClass.SMALL,
            });

            console.log('Community values: ', formattedValues);
            console.log('Community values info: ', communityValuesInfo);
            console.log('callback???: ', callback);

            if (callback) {
                callback({
                    text: communityValuesInfo,
                    content: {
                        url: {
                            communityValuesURL
                        },
                        values: values,
                        formattedValues: formattedValues
                    },
                });
            }
        } catch (error) {
            elizaLogger.error("Error fetching network state values:", error);
        }

        return true;
    },
    
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "What are the values of the Consensys Network State?" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "The Consensys Network State values are Decentralization and Censorship resistance. These values are proposed dynamically by the community and their importance is weighted based on staked ETH. You can vote on values through this Dapp: https://ethereum-values.consensys.io/", 
                    action: "GET_NETWORK_VALUES" 
                },
            }
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Tell me about the CNS values" },
            },
            {
                user: "{{user2}}",
                content: { 
                    text: "The Consensys Network State prioritizes Decentralization and Censorship resistance as core values. These aren't fixed - they're proposed and voted on by community members, with voting power determined by ETH stake. If you'd like to participate in shaping these values, check out https://ethereum-values.consensys.io/", 
                    action: "GET_NETWORK_VALUES" 
                },
            }
        ]
    ] as ActionExample[][],
} as Action;