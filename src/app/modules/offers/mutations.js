import {
  SET_OFFERS
} from './actions'

export const defaultState = {
  offers: []
};

export const mutations = {
  [SET_OFFERS](state, offers) {
    state.offers = offers;
  }
};
