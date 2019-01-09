import Vuex from 'vuex'

export default () => (new Vuex.Store({
  state: {
      headlines: [],
      category: '',
      loading: false
  },
  getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
  },
  mutations: {
      setHeadlines(state, headlines) {
          state.headlines = headlines
      },
      setCategory(state, category) {
        state.category = category;
      },
      setLoading(state, loading) {
        state.loading = loading;
      }
  },
  actions: {
      async loadHeadlines({ commit }, apiUtl) {
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUtl)
        commit('setLoading', false)
        commit('setHeadlines', articles)
      }
  }
}))
