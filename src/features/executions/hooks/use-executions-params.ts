import { useQueryStates } from "nuqs";
import { executionParams } from "../params";

export const useCExecutionsParams = () => {
  return useQueryStates(executionParams);
};
