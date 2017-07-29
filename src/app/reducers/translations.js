import { fromJS } from 'immutable';

const INITIAL_STATE = fromJS({});

export function setLanguage(state, language, translation) {
  return state.set(language, fromJS(translation));
}

export function setTranslation(state, language, key, value) {
  return state.setIn([language, key], value);
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case 'TRANSLATION_SET_LANGUAGE':
      return setLanguage(state, action.language, action.translation);

    case 'TRANSLATION_SET_TRANSLATION':
      return setTranslation(state, action.language, action.key, action.value);

    default:
      return state;
  }
};

export function getTranslations(state, key) {
  const keys = Array.isArray(key) ? key : [key];
  const language = state.getIn(['cookie', 'language'], 'en');
  const defaults = keys.reduce((s, k) => ({ ...s, [k]: k }), {});
  return Object.assign(
    defaults, // Fallback 3 : we just return the key
    state
      .getIn(['translations', 'en'], fromJS({})) // Fallback 2 : english language
      .filter((v, k) => keys.includes(k))
      .toJS(),
    state
      .getIn(['translations', 'default'], fromJS({})) // Fallback 1 : 'default' language
      .filter((v, k) => keys.includes(k))
      .toJS(),
    state
      .getIn(['translations', language], fromJS({}))
      .filter((v, k) => keys.includes(k))
      .toJS()
  );
}
