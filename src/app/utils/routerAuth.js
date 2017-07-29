import React from 'react';
import { connect } from 'react-redux';

// This wraps a route in order to provide a simple way to restrict paths.
// By default you need to be logged in to access a path
// If you need a custom check then override the "fn" parameter with a custom check.
// fn(state, props) => boolean

const auth = (component, component403 = () => <p>403</p>, fn) => {
  const wrapper = props =>
    props.auth ? <props.component {...props} /> : <props.component403 {...props} />;
  const mapStateToProps = (state, props) => ({
    auth: (typeof fn === 'function') ?
      fn(state.toJS(), props) :
      state.getIn(['user', 'self'], false),
    component,
    component403
  });
  return connect(mapStateToProps)(wrapper);
};

export default auth;
