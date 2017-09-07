import {
    CHANGE_TOKEN,
    LOG_OFF,
    GET_USER_INFO,
    SET_FRIENDS,
    SET_KEY
} from './actions'

export const defaultState = {
    token: null,
    name: '',
    type: null,
    privateKey: null
}

export const mutations = {
    [CHANGE_TOKEN] (state, token) {
        state.token = token
    },
    [SET_KEY] (state, key) {
        state.privateKey = key
    },
    [LOG_OFF] (state) {
        state.token = null;
        state.privateKey = null;
    },
    [GET_USER_INFO] (state, payload) {
        state.name = payload.id || '';
        state.type = payload.type || [];
    }
}
