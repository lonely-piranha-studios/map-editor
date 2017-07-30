import React from 'react';
import { connect } from 'react-redux';
import style from './style.scss';

const jsonValid = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

class MapEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selType: 'none',
      sel: 0,
      objData: '',
      objType: ''
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
    if (this.state.selType === 'object' && e.key === 'd' && false) {// Cant type :/
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

  objectSave(id, type, data, x, y) {
    this.props.dispatch({ type: 'MAP_OBJECT_SET', map: this.props.map.get('id'), id, objectType: type, data, x, y });
  }

  renderObjectSettings(id) {
    const map = this.props.map.toJS();
    const object = map.objects[id]
    if (!object) {
      return (
        <div className={style.objectSettings}>
          Object not found
        </div>
      );
    }
    return (
      <div className={style.objectSettings}>
        Object<br />
        <form onSubmit={e => { e.preventDefault(); this.objectSave(id, this.state.objType, this.state.objData, object.x, object.y); }}>
          <b>Type</b><br />
          <input value={this.state.objType} onChange={e => this.setState({ objType: e.target.value })} /><br />
          <b>Data</b><br />
          <textarea
            value={this.state.objData}
            onChange={e => this.setState({ objData: e.target.value })}
            className={!jsonValid(this.state.objData) && style.invalid}
          /><br />
          <button disabled={!jsonValid(this.state.objData)} type="submit">Save</button>
        </form>
      </div>
    );
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
      <div style={{ padding: '10px' }}>
        <div className={style.title}>{map.name} ({`${map.width}x${map.height}`})</div>
        Openings<br />
        Left: <input type="checkbox" checked={map.entryLeft} onChange={() => this.openLeftToggle()} /><br />
        Right: <input type="checkbox" checked={map.entryRight} onChange={() => this.openRightToggle()} /><br />
        Top: <input type="checkbox" checked={map.entryTop} onChange={() => this.openTopToggle()} /><br />
        Bottom: <input type="checkbox" checked={map.entryBottom} onChange={() => this.openBottomToggle()} /><br /><br />
        <div className={style.hints}>
          <b>Shorcuts for tiles</b><br />
          <b>0 - 9</b> Set tile type<br />
          <b>S</b> Set block to solid<br />
          <b>D</b> Set block to non-solid<br />
          <b>O</b> Create a object at location<br /><br />
          <b>Shorcuts for objects</b><br />
          <b>D</b> Delete object<br />
        </div>
        {this.state.selType === 'object' && this.renderObjectSettings(this.state.sel)}
        <div className={style.map}>
          {map.tiles.map((m, ind) => <div
            key={`${(ind - Math.floor(ind/map.width) * map.width)}x${Math.floor(ind/map.width)}`}
            className={[style.block, style[`block_${m}`], map.collision[ind] && style.solid, this.state.selType === 'tile' && this.state.sel === ind && style.active].join(' ')}
            style={{ left: `${(ind - Math.floor(ind/map.width) * map.width)*32}px`, top: `${Math.floor(ind/map.width)*32}px` }}
            onClick={() => this.setState({ sel: ind, selType: 'tile' })}
          >
            <div className={style.tile}>{m}</div>
          </div>)}
          {map.objects.map((o, ind) => <div
            key={ind}
            className={[style.object, style[`object_${o.type}`], this.state.selType === 'object' && this.state.sel === ind && style.active].join(' ')}
            style={{ left: `${o.x*32+8}px`, top: `${o.y*32+8}px` }}
            onClick={() => this.setState({ sel: ind, selType: 'object', objData: JSON.stringify(o.data), objType: o.type })}
          >
            {o.type}
          </div>)}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => ({
  map: state.getIn(['game', 'maps', props.match.params.id], false)
});

export default connect(mapStateToProps)(MapEditor);
