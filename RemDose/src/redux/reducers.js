import { SET_PILLS, SET_PILL_ID, ADD_ALARM} from './actions';

const initialState = {
    pills: [],
    pillID: 1,
    alarms: [],
}

function pillReducer(state=initialState, action ){
    switch (action.type){
        case SET_PILLS:
            return {...state, pills: action.payload};
        case SET_PILL_ID:
            return {...state, pillID: action.payload };
        case ADD_ALARM:
            console.log('time', state);
            const payload = action.payload;
            console.log(time);
            const alarm = {
                alarmNotifData: payload,
                value: payload.data.value,
                time: time,
                date: date,
            };
            return {
                ...state, alarms: state.alarms.concat(alarm),
            };
        default:
            return state;
    }
}

export default pillReducer;