import type { Plugin } from "@elizaos/core";

import { valuesProvider } from "./providers/values.ts";
import { shareValuesAction } from "./actions/shareValuesInfo.ts";

export * as providers from "./providers";

export const communityValuesPlugin: Plugin = {
    name: "communityValues",
    description: "Awareness of community values and ability to evaluate alignment with them",
    actions: [shareValuesAction],
    evaluators: [],
    providers: [valuesProvider],
};
export default communityValuesPlugin;
