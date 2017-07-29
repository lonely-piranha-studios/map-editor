import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({
  self: null,
  pending: false
});

export function setUserSelf(state, user) {
  return state.merge({ pending: false, self: user });
}

export function clearUserSelf(state) {
  return state
    .set('pending', false)
    .remove('self');
}

export function setPendingSelf(state, pending = true) {
  return state.set('pending', !!pending);
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case 'USER_SELF_SET':
      return setUserSelf(state, action.user);

    case 'USER_SELF_CLEAR':
      return clearUserSelf(state);

    case 'USER_SELF_PENDING':
      return setPendingSelf(state, action.pending);

    default:
      return state;
  }
};
