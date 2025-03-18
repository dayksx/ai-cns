import type { Plugin } from "@elizaos/core";

import { registerIdeaAction } from "./actions/registerIdea.ts";
import { ideasProvider } from "./providers/ideas.ts";

export const ideationPlugin: Plugin = {
    name: "ideation",
    description: "Register ideas comming from the community",
    actions: [registerIdeaAction],
    evaluators: [],
    providers: [ideasProvider],
};
export default ideationPlugin;
