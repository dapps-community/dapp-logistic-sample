import {
  SET_FILES,
  ADD_FILE
} from './actions'

export const defaultState = {
  files: []
}

export const mutations = {
  [SET_FILES](state, payload) {
    state.files = payload.files;
  },
  [ADD_FILE](state, payload) {
    state.files.push(payload.data);
  }
}
