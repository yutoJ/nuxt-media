import Vuex from 'vuex'
import md5 from 'md5';

export default () => (new Vuex.Store({
  state: {
      user: null,
      headlines: [],
      category: '',
      loading: false,
      country: 'us',
      token: ''
  },
  getters: {
      user: state => state.user,
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
      country: state => state.country,
      isAuthenticated: state => !!state.token,
  },
  mutations: {
      setUser(state, user) {
        state.user = user
      },
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
      },
      setToken(state, token) {
        state.token = token;
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
              //const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`
              const avatar = '../assets/avatar.jpeg'
              const user = { email: authUserData.email, avatar };
              console.log(authUserData)
              commit('setUser', user);
              commit('setToken', authUserData.idToken);
              commit('setLoading', false)
          } catch (err) {
              console.err(err)
              commit('setLoading', false)
          }

      }
  }
}))
