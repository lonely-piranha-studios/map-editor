import React from 'react';
import { connect } from 'react-redux';
import style from './style.scss';

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sel: 0
    };
  }

  componentDidMount() {
    document.onkeypress = e => this.keyPress(e);
  }

  keyPress(e) {
    if (parseInt(e.key) == e.key) {
      this.props.dispatch({ type: 'MAP_TILE', map: this.props.map.get('id'), index: this.state.sel, value: parseInt(e.key) });
    }
    if (e.key === 's') {
      this.props.dispatch({ type: 'MAP_SOLID', map: this.props.map.get('id'), index: this.state.sel, value: 1 });
    }
    if (e.key === 'd') {
      this.props.dispatch({ type: 'MAP_SOLID', map: this.props.map.get('id'), index: this.state.sel, value: 0 });
    }
  }

  openLeftToggle(open) {
    this.props.dispatch({ type: 'MAP_OPEN_LEFT', map: this.props.map.get('id') });
  }

  openRightToggle(open) {
    this.props.dispatch({ type: 'MAP_OPEN_RIGHT', map: this.props.map.get('id') });
  }

  openTopToggle(open) {
    this.props.dispatch({ type: 'MAP_OPEN_TOP', map: this.props.map.get('id') });
  }

  openBottomToggle(open) {
    this.props.dispatch({ type: 'MAP_OPEN_BOTTOM', map: this.props.map.get('id') });
  }

  render() {
    if (!this.props.map) {
      return (
        <div>
          Map not found
        </div>
      );
    }
    const map = this.props.map.toJS();
    return (
      <div>
        <div className={style.title}>{map.name} ({`${map.width}x${map.height}`})</div>
        Openings<br />
        Left: <input type="checkbox" checked={map.entryLeft} onChange={() => this.openLeftToggle()} /><br />
        Right: <input type="checkbox" checked={map.entryRight} onChange={() => this.openRightToggle()} /><br />
        Top: <input type="checkbox" checked={map.entryTop} onChange={() => this.openTopToggle()} /><br />
        Bottom: <input type="checkbox" checked={map.entryBottom} onChange={() => this.openBottomToggle()} /><br /><br />
        <div className={style.map}>
          {map.tiles.map((m, ind) => <div
            key={`${(ind - Math.floor(ind/map.width) * map.width)}x${Math.floor(ind/map.width)}`}
            className={[style.block, style[`block_${m}`], map.collision[ind] && style.solid, this.state.sel === ind && style.active].join(' ')}
            style={{ left: `${(ind - Math.floor(ind/map.width) * map.width)*64}px`, top: `${Math.floor(ind/map.width)*64}px` }}
            onClick={() => this.setState({ sel: ind })}
          >
            <div className={style.tile}>{m}</div>
          </div>)}
        </div>
        <div className={style.hints}>
          Key list:<br />
          <b>0 - 9</b> Set tile type<br />
          <b>S</b> Set block to solid<br />
          <b>D</b> Set block to non-solid<br />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  map: state.getIn(['game', 'maps', props.match.params.id], false)
});

export default connect(mapStateToProps)(MapEditor);
