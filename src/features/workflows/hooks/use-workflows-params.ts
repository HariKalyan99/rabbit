import {useQueryStates} from 'nuqs';
import { workflowsParams } from '../params';

export const useWorkFlowParams = () => {
    return useQueryStates(workflowsParams)
} 
