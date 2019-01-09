import Vuex from 'vuex'

export default () => (new Vuex.Store({
  state: {
      headlines: []
  },
  getters: {
      headlines: state => state.headlines
  },
  mutations: {
      setHeadlines(state, headlines) {
          state.headlines = headlines
      }
  },
  actions: {
      async loadHeadlines({ commit }, apiUtl) {
        const { articles } = await this.$axios.$get(apiUtl)
        commit('setHeadlines', articles)
      }
  }
}))
