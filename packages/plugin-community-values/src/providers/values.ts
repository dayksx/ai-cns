import type { IAgentRuntime, Memory, Provider, State } from "@elizaos/core";

const valuesProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {

        return `The Network State values are Decentralization, Censorship resistance`;
    },
};
export { valuesProvider };
