import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { auth, clear } from '~/actions/user';
import { get } from '~/actions/translations';
import languages from '~/utils/languages';
import style from './style.scss';

const menuOptions = {
  '/': 'Overview',
  '/map-new': 'New map',
  '/generation': 'World generation',
};

class AppFrame extends React.Component {
  static childContextTypes = {
    apiClient: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.apiClient = { dummy: 'new ApiClient({ uri: CONFIG.api_url, session: props.session });' };
    this.state = {
      loading: false
    };
  }

  getChildContext() {
    return {
      apiClient: this.apiClient
    };
  }

  componentDidMount() {
    const promises = [];
    promises.push(get(this.props.dispatch, this.props.language)); // Get translation file
    if (this.props.session) { // Auth if we have a session cookie
      promises.push(
        auth(this.props.dispatch, { session: this.props.session })
        .catch(() => clear(this.props.dispatch)) // Clear session if login fails
      );
    }
    if (localStorage.game) {
      this.props.dispatch({ type: 'GAME_STATE', state: JSON.parse(localStorage.game) })
    }
    Promise.all(promises) // Wait for all async loading then let the application start
      .then(() => this.setState({ loading: false }));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.language !== nextProps.language) { // language has changed
      this.setState({ loading: true });
      get(this.props.dispatch, nextProps.language)
        .then(() => this.setState({ loading: false }));
    }
  }

  render() {
    // language file has not been loaded yet
    if (this.state.loading) {
      return (
        <p>LOADING</p>
      );
    }

    return (
      <div className={style.container}>
        <div className={style.menu}>
          {Object.keys(menuOptions).map(k =>
            <Link key={k} to={k}>{menuOptions[k]}</Link>
          )}
          {Object.keys(languages).map(l =>
            <button
              key={l}
              className={this.props.language === l && style.active}
              onClick={() => this.props.dispatch({ type: 'COOKIE_SET', key: 'language', value: l })}
            >
              {languages[l].name}
            </button>
          )}
        </div>
        <div className={style.content}>
          {this.props.children}
        </div>
        <div className={style.footer}>&copy; Copyright ISPYGROUP AB</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  language: state.getIn(['cookie', 'language'], 'en'),
  session: state.getIn(['cookie', 'session'], false),
});

// Setting pure: false is required for react router to work
export default connect(mapStateToProps, null, null, { pure: false })(AppFrame);
