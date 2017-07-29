import { fromJS } from 'immutable';
import uuid from 'uuid-v4';

const INITIAL_STATE = fromJS({
  maps: {}
});

export function mapNew(state, name, width, height) {
  const id = uuid();
  return state
    .setIn(['maps', id], fromJS({
      id,
      name,
      width,
      height,
      collision: Array(width*height).fill(0),
      tiles: Array(width*height).fill(0),
      objects: [],
      entryTop: false,
      entryBottom: false,
      entryLeft: false,
      entryRight: false
    }));
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case 'GAME_STATE':
      return state.merge(fromJS(action.state));

    case 'MAP_NEW':
      return mapNew(state, action.name, action.width, action.height);

    case 'MAP_TILE':
      return state.updateIn(['maps', action.map, 'tiles'], tiles => tiles.set(action.index, action.value));

    case 'MAP_SOLID':
      return state.updateIn(['maps', action.map, 'collision'], collision => collision.set(action.index, action.value));

    case 'MAP_OPEN_LEFT':
      return state.updateIn(['maps', action.map, 'entryLeft'], e => !e);

    case 'MAP_OPEN_RIGHT':
      return state.updateIn(['maps', action.map, 'entryRight'], e => !e);

    case 'MAP_OPEN_TOP':
      return state.updateIn(['maps', action.map, 'entryTop'], e => !e);

    case 'MAP_OPEN_BOTTOM':
      return state.updateIn(['maps', action.map, 'entryBottom'], e => !e);

    case 'MAP_REMOVE':
      return state.deleteIn(['maps', action.id]);

    default:
      return state;
  }
};
