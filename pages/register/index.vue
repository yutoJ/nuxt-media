<template>
    <div class="md-layout md-alignment-center-center" style="height: 100vh!">
        <md-card class="md-layout-item md-size-50">
            <md-card-header>
                <div class="md-title">Register</div>
            </md-card-header>

            <form @submit.prevent="registerUser">
                <md-card-content>
                    <md-field md-clearable>
                        <label for="email">Email</label>
                        <md-input :disabled="loading" type="email" id="email" autocomplete="email" v-model="form.email" />
                    </md-field>

                    <md-field>
                        <label for="passwprd">Password</label>
                        <md-input :disabled="loading" type="password" name="password" id="password" autocomplete="password" v-model="form.password" />
                    </md-field>
                </md-card-content>
                <md-card-actions>
                    <md-button>
                        <nuxt-link class="md-primary" to="/login">GO to Login</nuxt-link>
                    </md-button>
                    <md-button class="md-primary md-raised" :disabled="loading" type="submit">Submit</md-button>
                </md-card-actions>
            </form>
            <md-snackbar :md-active.sync="isAuthenticated">
                {{form.email}} was successfully registered!
            </md-snackbar>
        </md-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    middleware: 'auth',
    data: () => ({
        form: {
            email: '',
            password: ''
        }
    }),
    computed: {
        ...mapGetters(['loading', 'isAuthenticated'])
    },
    watch: {
        isAuthenticated(value) {
            if(value) {
                setTimeout(() => this.$router.push('/'), 2000)
            }
        }
    },
    methods: {
        async registerUser() {
            await this.$store.dispatch('authenticateUser', {
                email: this.form.email,
                password: this.form.password,
                returnSecureToken: true
            })
        }
    }
}
</script>
