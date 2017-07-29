import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutable';

import user from '~/reducers/user';
import cookie from '~/reducers/cookie';
import translations from '~/reducers/translations';
import game from '~/reducers/game';

const reducers = combineReducers({
  user,
  cookie,
  translations,
  game
});

const logger = store => next => (action) => {
  const res = next(action);
  if (process.env.NODE_ENV !== 'production') {
    const stateOld = store;
    console.info( // eslint-disable-line
      'Action dispatched', action,
      'old state:', stateOld.getState().toJS(),
      'next state:', store.getState().toJS()
    );
  }
  localStorage.setItem('game', JSON.stringify(store.getState().toJS().game || {}));
  return res;
};

export default function (initialState) {
  return createStore(reducers, initialState, applyMiddleware(logger));
}
