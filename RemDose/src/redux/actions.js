export const SET_PILLS = 'SET_PILL';
export const SET_PILL_ID = 'SET_PILL_ID';

export const ADD_ALARM = 'ADD_ALARM';

export const setPills = pills => dispatch => {
    dispatch({
        type: SET_PILLS,
        payload: pills,
    });
};

export const setPillID = pillID => dispatch => {
    dispatch({
        type: SET_PILL_ID,
        payload: pillID,
    });
};


export const addAlarm = time => {
    return {
      type: ADD_ALARM,
      payload: time,
    };
};