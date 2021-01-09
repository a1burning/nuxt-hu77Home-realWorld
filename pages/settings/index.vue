<template> 
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <!-- 错误信息 -->
          <ul class="error-messages">
            <template v-for="(error, field) in errors">
              <li v-for="(msg, index) in error" :key="index">
                {{ field }} {{ msg }}
              </li>
            </template>
          </ul>

          <!-- 表单 -->
          <form @submit.prevent="updateUser">
            <fieldset>
                <fieldset class="form-group">
                  <input class="form-control" type="text" placeholder="URL of profile picture" v-model="user.image">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Your Name" v-model="user.username" required>
                </fieldset>
                <fieldset class="form-group">
                  <textarea class="form-control form-control-lg" rows="8" placeholder="Short bio about you" v-model="user.bio"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="text" placeholder="Email" v-model="user.email" required>
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password"
                  v-model="user.password"
                  minlength="8">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template> 
<script>
import { currentUser, updateUser } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default { 
  name: 'SettingsPage',
  middleware: 'authenticated',
  data () {
    return {
      user: {
        image: '',
        bio: '',
        email: '',
        username: '',
        password: ''
      },
      errors: {}
    }
  },
  head () {
    return {
      title: `Settings - Fox Home`
    }
  },
  async mounted () {
    const { data } = await currentUser()
    console.log(data)
    this.user = data.user
  },
  methods: {
    logout () {
      this.$store.commit('setUser', null)
      Cookie.remove('user')
      this.$router.push('/')
    },
    async updateUser() {
      console.log(this.user)
      try {
        const { data } = await updateUser(this.user)
        this.$store.commit('setUser', this.user)
        Cookie.set('user', this.user)
        this.$router.push({
          name: 'profile',
          params: {
            username: this.user.username
          }
        })
      } catch (error) {
        this.errors = error.response.data.errors
      }
      
    }
  }
}
</script> 

<style> </style>