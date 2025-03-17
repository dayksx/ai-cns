import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";
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

const valuesProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {

        try {
            const endpoint = "https://prod.linea.intuition-api.com/v1/graphql";
            
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
              endpoint,
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
            console.log('Community values: ', formattedValues);
            // Return the formatted values for the AI agent
            return `The Consensys Network State (CNS) values are ${formattedValues}`;

          } catch (error) {
            console.error("Error fetching values from GraphQL API:", error);
          }
        },
};
export { valuesProvider };
