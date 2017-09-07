import * as actions from './actions';
import { defaultState, mutations } from './mutations';

const state = defaultState;

export default {
  module: {
    actions,
    state,
    mutations
  }
};
