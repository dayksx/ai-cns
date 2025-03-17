import { composeContext, generateText, ModelClass, type HandlerCallback, type IAgentRuntime, type Memory, type Provider, type State } from "@elizaos/core";
import axios from "axios";

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
export const valuesEndpoint = "https://prod.linea.intuition-api.com/v1/graphql";

const valuesInfoTemplate = `# Contextual Message on Consensys Network State (CNS) Values for @recipient  
  Based on previous discussions, this message provides additional context about CNS community values.  
  
  {{recentMessages}}  
  
  # Instructions:  
  {{senderName}} has mentioned CNS values. Your task is to ensure that @recipient fully understands them by adding missing context, including:  
  
  - CNS values are proposed dynamically by the community.  
  - Their importance is weighted based on staked ETH.  
  - The community votes on values through this Dapp: https://ethereum-values.consensys.io/ (ensure the link is included if not already shared).  
  
  Respond in {{agentName}}'s natural speaking style. If essential information is missing, ask {{senderName}} for the specifics needed to complete the request, maintaining {{agentName}}'s tone.`;  
  
export const communityValuesURL = "https://ethereum-values.consensys.io/";

const valuesProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state?: State, callback?: HandlerCallback) => {

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
                          image
                          description
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
      
            // GraphQL request
            const response = await axios.post<GraphQLResponse>(
                valuesEndpoint,
              graphqlQuery,
              {
                headers: {
                  'Content-Type': 'application/json',
                }
              }
            );
      
            // Extract the values from the response
            const values = response.data.data.triples.map(triple => 
              triple.object.value.thing.name
            );
      
            // Format the values as a comma-separated list
            const formattedValues = values.join(", ");


            // Profile more info about the community values
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
            // Return the formatted values for the AI agent
            return `The Consensys Network State (CNS) values voted by the community through ETH staking are: ${formattedValues}`;

          } catch (error) {
            console.error("Error fetching values from GraphQL API:", error);
          }
        },
};
export { valuesProvider };
