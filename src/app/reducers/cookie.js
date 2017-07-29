import { fromJS } from 'immutable';
import cookies from 'js-cookie';

const INITIAL_STATE = fromJS({});

export function set(state, key, value) {
  if (typeof document !== 'undefined') {
    cookies.set(key, value);
  }
  return state.set(key, value);
}

export function remove(state, key) {
  if (typeof document !== 'undefined') {
    cookies.remove(key);
  }
  return state.remove(key);
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case 'COOKIE_SET':
      return set(state, action.key, action.value);

    case 'COOKIE_REMOVE':
      return remove(state, action.key);

    default:
      return state;
  }
};
