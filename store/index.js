import Vuex from 'vuex'
import md5 from 'md5'
import db from '~/plugins/firestore'
import { saveUserData, clearUserData } from '~/utils'

export default () => (new Vuex.Store({
  state: {
      user: null,
      headlines: [],
      category: '',
      loading: false,
      country: 'us',
      token: '',
      feed: []
  },
  getters: {
      user: state => state.user,
      headlines: state => state.headlines,
      category: state => state.category,
      loading: state => state.loading,
      country: state => state.country,
      isAuthenticated: state => !!state.token,
      feed: state => state.feed
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
      },
      setFeed(state, headlines) {
        state.feed = headlines;
      },
      clearToken: state => (state.token = ''),
      clearUser: state => (state.user = null)
  },
  actions: {
      async loadHeadlines({ commit }, apiUtl) {
        console.log(apiUtl)
        commit('setLoading', true)
        const { articles } = await this.$axios.$get(apiUtl)
        commit('setLoading', false)
        commit('setHeadlines', articles)
      },
      async addHeadlineToFeed({ state }, headline) {
        const feedRef = db.collection(`users/${state.user.email}/feed`).doc(headline.title)
        await feedRef.set(headline)
      },
      async authenticateUser({ commit }, userPayload) {
          try {
              commit('setLoading', true)
              const authUserData = await this.$axios.$post(`/${userPayload.action}/`, userPayload);
              let user;
              if (userPayload.action === 'register') {
                //const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?d=identicon`
                const avatar = '~/assets/avatar.jpeg';
                user = { email: authUserData.email, avatar };
                await db.collection('users').doc(userPayload.email).set(user);
              } else {
                const loginRef = db.collection('users').doc(userPayload.email);
                const loggedInUser = await loginRef.get();
                user = loggedInUser.data();
              }
              console.log(authUserData)
              commit('setUser', user)
              commit('setToken', authUserData.idToken)
              commit('setLoading', false)
              saveUserData(authUserData, user)
          } catch (err) {
              console.err(err)
              commit('setLoading', false)
          }
      },
      setLogoutTimer({ dispatch }, interval) {
        setTimeout(() => dispatch('logoutUser'), interval)
      },
      logoutUser({ commit }) {
        commit('clearToken')
        commit('clearUser')
        clearUserData()
      },
      async loadUserFeed({ state, commit }) {
        if (state.user) {
          const feedRef = db.collection(`users/${state.user.email}/feed`)
          await feedRef.get().then(querySnapshot => {
            let headlines = [];
            querySnapshot.forEach(doc => {
              headlines.push(doc.data())
            })
            commit('setFeed', headlines)
          })
        }
      }
  }
}))
