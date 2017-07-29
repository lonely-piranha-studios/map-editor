import React from 'react';
import { connect } from 'react-redux';
import style from './style.scss';

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selType: 'none',
      sel: 0
    };
  }

  componentDidMount() {
    document.onkeypress = e => this.keyPress(e);
  }

  keyPress(e) {
    if (this.state.selType === 'tile' && parseInt(e.key) == e.key) {
      this.props.dispatch({ type: 'MAP_TILE', map: this.props.map.get('id'), index: this.state.sel, value: parseInt(e.key) });
    }
    if (this.state.selType === 'tile' && e.key === 's') {
      this.props.dispatch({ type: 'MAP_SOLID', map: this.props.map.get('id'), index: this.state.sel, value: 1 });
    }
    if (this.state.selType === 'tile' && e.key === 'd') {
      this.props.dispatch({ type: 'MAP_SOLID', map: this.props.map.get('id'), index: this.state.sel, value: 0 });
    }
    if (this.state.selType === 'object' && e.key === 'd') {
      this.props.dispatch({ type: 'MAP_OBJECT_REMOVE', map: this.props.map.get('id'), id: this.state.sel });
      this.setState({ selType: 'none' });
    }
    if (this.state.selType === 'tile' && e.key === 'o') {
      const map = this.props.map.toJS();
      this.objectNew(this.state.sel - Math.floor(this.state.sel/map.width) * map.width, Math.floor(this.state.sel/map.width))
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

  objectNew(x, y) {
    this.props.dispatch({ type: 'MAP_OBJECT_NEW', map: this.props.map.get('id'), x, y, objectType: 'rock', data: {} });
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
            className={[style.block, style[`block_${m}`], map.collision[ind] && style.solid, this.state.selType === 'tile' && this.state.sel === ind && style.active].join(' ')}
            style={{ left: `${(ind - Math.floor(ind/map.width) * map.width)*64}px`, top: `${Math.floor(ind/map.width)*64}px` }}
            onClick={() => this.setState({ sel: ind, selType: 'tile' })}
          >
            <div className={style.tile}>{m}</div>
          </div>)}
          {map.objects.map((o, ind) => <div
            key={ind}
            className={[style.object, style[`object_${o.type}`], this.state.selType === 'object' && this.state.sel === ind && style.active].join(' ')}
            style={{ left: `${o.x*64+24}px`, top: `${o.y*64+24}px` }}
            onClick={() => this.setState({ sel: ind, selType: 'object' })}
          >
            {o.type}
          </div>)}
        </div>
        <div className={style.hints}>
          <b>Shorcuts for tiles</b><br />
          <b>0 - 9</b> Set tile type<br />
          <b>S</b> Set block to solid<br />
          <b>D</b> Set block to non-solid<br />
          <b>O</b> Create a object at location<br /><br />
          <b>Shorcuts for objects</b><br />
          <b>D</b> Delete object<br />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  map: state.getIn(['game', 'maps', props.match.params.id], false)
});

export default connect(mapStateToProps)(MapEditor);
