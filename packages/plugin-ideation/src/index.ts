import type { Plugin } from "@elizaos/core";

import { registerIdeaAction } from "./actions/registerIdea.ts";
import { ideasProvider } from "./providers/ideas.ts";

export const ideationPlugin: Plugin = {
    name: "ideation",
    description: "Register needs, ideas, initiatives comming from the community",
    actions: [registerIdeaAction],
    evaluators: [],
    providers: [ideasProvider],
};
export default ideationPlugin;
