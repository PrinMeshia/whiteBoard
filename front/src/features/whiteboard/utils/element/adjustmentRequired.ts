import { toolTypes } from "src/constants";


type ToolType = string | toolTypes | null;

export const adjustmentRequired = (type: ToolType | null): boolean =>
  type !== null && [toolTypes.RECTANGLE, toolTypes.LINE].includes(type as toolTypes);