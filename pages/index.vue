<template>
  <div class="md-layout md-alignment-center" style="margin: 4em 0">
    <!-- TOP Navigation -->
    <md-toolbar class="fixed-toolbar" elevation="1">
      <md-button class="md-icon-button" @click="showLeftSidepanel = true">
        <md-icon>menu</md-icon>
      </md-button>
      <nuxt-link class="md-primary md-title" to="/">
        NuxtMedia
      </nuxt-link>
      <div class="md-toolbar-section-end">
        <template v-if="isAuthenticated">
          <md-button>
            <!--<md-avatar><img :src="user.avatar" :alt="user.email"></md-avatar>-->
            <md-avatar><img src="~/assets/avatar.jpeg" :alt="user.email"></md-avatar>-->
            {{user.email}}
          </md-button>
          <md-button @click="logoutUser">Logout</md-button>
        </template>
        <template v-else>
          <md-button>
            <nuxt-link class="md-primary" to="/login">Login</nuxt-link>
          </md-button>
          <md-button>
            <nuxt-link class="md-primary" to="/register">Register</nuxt-link>
          </md-button>
        </template>
        <md-button class="md-accent" @click="showSidePanel = true">Categories</md-button>
      </div>
    </md-toolbar>

    <md-drawer md-fixed :md-active.sync="showLeftSidepanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">Pernonal Feed</span>
      </md-toolbar>

      <md-progress-bar v-if=loading md-mode='indeterminate'></md-progress-bar>

      <md-field>
        <label for="country">Country</label>
        <md-select @input="changeCountry" :value="country" name="country" id="country">
          <md-option value="us">United States</md-option>
          <md-option value="ca">Canada</md-option>
          <md-option value="de">Germany</md-option>
          <md-option value="ru">Russia</md-option>
        </md-select>
      </md-field>
      <md-list class="md-triple-line" v-for="headline in feed" :key="headline.id">
        <md-list-item>
          <md-avatar><img :src="headline.urlToImage" :alt="headline.title"></md-avatar>
          <div class="md-list-item-text">
            <span><a :href="headline.url" target="_blank">{{headline.title}}</a></span>
            <span>{{headline.source.name}}</span>
            <span>View Comments</span>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-accent">delete</md-icon>
          </md-button>
        </md-list-item>
        <md-divider class="md-inset"></md-divider>
      </md-list>
    </md-drawer>

    <md-drawer class="md-right" md-fixed :md-active.sync="showSidePanel">
      <md-toolbar :md-elevation="1">
        <span class="md-title">News Categories</span>
      </md-toolbar>

      <md-progress-bar v-if="loading" md-mode='indeterminate'></md-progress-bar>

      <md-list>
        <md-subheader class="md-primary">Categories</md-subheader>
        <md-list-item v-for="(newsCategory, i) in newsCategories" :key="i" @click="loadCategory(newsCategory.path)">
          <md-icon :class="newsCategory.path === category ? 'md-primary' : ''">{{newsCategory.icon}}</md-icon>
          <span class="md-list-item-text">{{newsCategory.name}}</span>
        </md-list-item>
      </md-list>
    </md-drawer>

    <!-- App Content -->
    <div class="md-layout-item md-size-90">
      <md-content class="md-layout md-gutter" style="background: #X007998; padding: 1em;">
        <ul v-for="headline in headlines" :key="headline.id" class="md-layout-item md-large-size-25 md-medium-size-33 md-small-size-50 md-xsmall-size-100">
            <md-card style="margin-top: 2em;" md-with-hover>
              <md-ripple>
                <md-card-media>
                  <img :src="headline.urlToImage" :alt="headline.title">
                </md-card-media>
                <md-card-header>
                  <div class="md-title">
                    <a :href="headline.url" target="_blank">{{headline.title}}</a>
                  </div>
                  <div>
                    {{headline.source.name}}
                    <md-icon class="small-icon">book</md-icon>
                  </div>        
                  <div class="md-subhead" v-if="headline.author">
                    {{headline.author}}
                    <md-icon class="small-icon">face</md-icon>
                  </div>
                  <div class="md-subhead">
                    {{headline.publishedAt}}
                    <md-icon class="small-icon">alarm</md-icon>
                  </div>
                </md-card-header>  
                <md-card-content>{{headline.description}}</md-card-content>
                <md-card-actions>
                  <md-button @click="addHeadlineToFeed(headline)" class="md-icon-button">
                    <md-icon>bookmark</md-icon>
                  </md-button>
                  <md-button class="md-icon-button">
                    <md-icon>message</md-icon>
                  </md-button>
                </md-card-actions>
              </md-ripple>
            </md-card>
        </ul>
      </md-content>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    showSidePanel: false,
    showLeftSidepanel: false,
    newsCategories: [
      { name: 'Top Headlines', path: '', icon: 'today' },
      { name: 'Technology', path: 'technology', icon: 'keyboard' },
      { name: 'Business', path: 'business', icon: 'business-center' },
      { name: 'Entertainment', path: 'entertainment', icon: 'weekend' },
      { name: 'Health', path: 'health', icon: 'fastfood' },
      { name: 'Science', path: 'science', icon: 'fingerprint' },
      { name: 'Sports', path: 'sports', icon: 'golf-course' },
    ]
  }),
  async fetch({ store }) {
    await store.dispatch('loadHeadlines', `/api/top-headlines?country=${store.state.country}&category=${store.state.category}`)
    await store.dispatch('loadUserFeed')
  },
  watch: {
    async country() {
      await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
    }
  },
  computed: {
    ...mapGetters(['user', 'headlines', 'category', 'country', 'loading', 'isAuthenticated', 'feed'])
  },
  methods: {
    async loadCategory(category) {
      this.$store.commit('setCategory', category)
      await this.$store.dispatch('loadHeadlines', `/api/top-headlines?country=${this.country}&category=${this.category}`)
    },
    async changeCountry(country) {
      this.$store.commit('setCountry', country)
    },
    async addHeadlineToFeed(headline) {
      if (this.user) {
        this.$store.dispatch('addHeadlineToFeed', headline)
      }
    },
    logoutUser() {
      this.$store.dispatch('logoutUser')
    }
  }
}
</script>

<style scoped>
  .small-icon {
    font-size: 18px !important;
  }

  .fixed-toolbar {
    position: fixed;
    top: 0;
    z-index: 5;

  }
</style>