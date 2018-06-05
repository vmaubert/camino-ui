import Vue from 'vue'
import Vuex from 'vuex'

import titre from './titre'
import titres from './titres'
import carte from './carte'
import utilisateur from './utilisateur'

const modules = {
  titre,
  titres,
  carte,
  utilisateur
}

export const state = {
  config: {}
}

export const actions = {}

export const mutations = {}

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  mutations,
  modules
})
