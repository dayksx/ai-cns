import axios from "axios";
export const valuesEndpoint = "https://prod.linea.intuition-api.com/v1/graphql";

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

export async function getCNSValues(): Promise<string[]> {
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
            limit: 100,
            offset: 0,
            where: {
                predicate_id: {
                    _eq: 3,
                },
                subject_id: {
                    _eq: 2,
                },
            },
            orderBy: {
                vault: {
                    total_shares: "desc",
                },
            },
        },
    };

    // GraphQL request
    const response = await axios.post<GraphQLResponse>(
        valuesEndpoint,
        graphqlQuery,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    // Extract the values from the response
    const values = response.data.data.triples.map(
        (triple: any) => triple.object.value.thing.name
    );
    return values;
}
