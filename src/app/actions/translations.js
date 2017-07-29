export const get = (dispatch, language = 'en') => fetch(`/translations/${language}.json`)
  .then(r => r.json())
  .then((r) => {
    dispatch({ type: 'TRANSLATION_SET_LANGUAGE', language, translation: r });
    return r;
  });

export const eslint = 'Stop complaining, i do what i want';
