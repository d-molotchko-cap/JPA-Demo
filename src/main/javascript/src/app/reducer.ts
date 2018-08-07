import { isNil, isPlainObject, isEmpty, cloneDeep } from 'lodash';

import { Instances as projectInitial } from './components/project/instances';

export const FORM_STORE_KEY = "form";
export const TASK_STORE_KEY = "task";
export const TASK_STORE_LIST_KEY = "list";

export const INITIAL_STATE = {
    [FORM_STORE_KEY]: {
        'project': cloneDeep(projectInitial.data)    },
    [TASK_STORE_KEY]: {
        [TASK_STORE_LIST_KEY]: []
    }
};

export function rootReducer (state, action) {
    switch (action.type) {
        case 'CREATE_INSTANCE':
            return Object.assign({}, state, {
                [FORM_STORE_KEY]: {
                    [action.store]: action.data
                }
            })
        case 'LOAD_TASK_DATA_FAILED':
            return Object.assign({}, state, {
                [FORM_STORE_KEY]: {
                    [action.store]: null
                }
            })
        case 'FINISH_TASK_SUCCESSED':
            action.callback && action.callback(state);
            return state;
        case 'GET_INSTANCES_SUCCESSED':
            action.callback && action.callback(state);
            return Object.assign({}, state, {
                [TASK_STORE_KEY]: {
                    [TASK_STORE_LIST_KEY]: action.data
                }
            })
        case 'GET_INSTANCES_FAILED': {
            action.callback && action.callback(state);
            return Object.assign({}, state, {
                [TASK_STORE_KEY]: {
                    [TASK_STORE_LIST_KEY]: []
                }
            })
        }
    }
    return state;
}
