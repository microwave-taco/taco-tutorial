import { SESSION_REQUEST_ACTIONS } from '../actions';

export interface IRequestState {
  id: number;
  name: string;
  studentauthid: string;
  teacherauthid: string;
  subjectid: number;
}

export interface ISessionRequestState {
  maxRequests: number;
  requests: IRequestState[];
}

const INIT_STATE: ISessionRequestState = {
  maxRequests: 3,
  requests: []
};

export function sessionRequestReducer(
  state = INIT_STATE,
  action
): ISessionRequestState {
  switch (action.type) {
    case SESSION_REQUEST_ACTIONS.SET_REQUESTS:
      return Object.assign({}, state, {
        requests: action.requests
      });

    default:
      return state;
  }
}
