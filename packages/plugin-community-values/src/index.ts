import type { Plugin } from "@elizaos/core";

import { valuesProvider } from "./providers/values.ts";
import { listValuesAction } from "./actions/listValues.ts";
import { valueAlignmentEvaluator } from "./providers/valueAlignment.ts";

export * as providers from "./providers";

export const communityValuesPlugin: Plugin = {
    name: "communityValues",
    description: "Awareness of community values and ability to evaluate alignment with them",
    actions: [listValuesAction],
    evaluators: [],
    providers: [valuesProvider, valueAlignmentEvaluator],
};
export default communityValuesPlugin;
