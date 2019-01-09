import Vuex from 'vuex'

export default () => (new Vuex.Store({
  state: {
      headlines: [],
      category: '',
      loading: false,
      country: 'us'
  },
  getters: {
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
      country: state => state.country
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
      },
      setCountry(state, country) {
        state.country = country;
      }
  },
  actions: {
      async loadHeadlines({ commit }, apiUtl) {
        console.log(apiUtl)
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUtl)
        commit('setLoading', false)
        commit('setHeadlines', articles)
      },
      async authenticateUser({ commit }, userPayload) {
          try {
              commit('setLoading', true)
              const authUserData = await this.$axios.$post('/register/', userPayload)
              console.log(authUserData)
              commit('setLoading', false)
          } catch (err) {
              console.err(err)
              commit('setLoading', false)
          }

      }
  }
}))
