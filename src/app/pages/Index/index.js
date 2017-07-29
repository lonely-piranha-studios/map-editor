import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import style from './style.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  mapRemove(id) {
    this.props.dispatch({ type: 'MAP_REMOVE', id });
  }

  render() {
    return (
      <div>
        maps:
        {Object.values(this.props.game.maps).map(m => <div key={m.name} className={style.map}>
          <Link to={`/map/${m.id}`}>{m.name}</Link>
          <button className={style.delete} onClick={() => this.mapRemove(m.id)}>X</button>
        </div>)}
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  game: state.get('game').toJS()
});

export default connect(mapStateToProps)(Index);
