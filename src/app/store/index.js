import Vue from 'vue'
import Vuex from 'vuex'

import auth from '../modules/auth'
import offers from '../modules/offers'
import orders from '../modules/orders'
import search from '../modules/search'
import profile from '../modules/profile'

Vue.use(Vuex)

const mutations = {}
const state = {}
const components = {
  auth,
  offers,
  orders,
  search,
  profile
}
const modules = {}
const getters = {}
const actions = {}

Object.keys(components).forEach(key => {
  if (!components.hasOwnProperty(key))
    return
  if (components[key].module)
    modules[key] = components[key].module
  if (components[key].getters) {
    Object.keys(components[key].getters).forEach(getter => {
      if (!components[key].getters.hasOwnProperty(getter))
        return
      if (getters[getter])
        throw `Getter ${getter} already exist`
      getters[getter] = components[key].getters[getter]
    })
  }
})

export default new Vuex.Store({
  state,
  mutations,
  modules,
  getters,
  actions
})
