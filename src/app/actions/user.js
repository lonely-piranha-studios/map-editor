export const auth = (dispatch, credentials) => Promise.resolve()
  .then(() => dispatch({ type: 'USER_SELF_PENDING' }))
  .then(() => new Promise((r) => { // Simulate a second of asynch waiting...
    setTimeout(() => {
      r();
    }, 1000);
  }))
  .then(() => {
    dispatch({ type: 'USER_SELF_SET', user: { credentials } });
    dispatch({ type: 'COOKIE_SET', key: 'session', value: 'MOCK' });
  })
  .then(() => ({ status: 200 }));

export const clear = (dispatch) => {
  dispatch({ type: 'USER_SELF_CLEAR' });
  dispatch({ type: 'COOKIE_REMOVE', key: 'session' });
  return Promise.resolve();
};
