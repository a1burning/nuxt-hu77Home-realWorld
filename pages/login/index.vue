<template> 
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up'}}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="!isLogin" to="/login">Have an account?</nuxt-link>
            <nuxt-link v-else to="/register">Need an account?</nuxt-link>
          </p>
          <!-- 错误信息 -->
          <ul class="error-messages">
            <template v-for="(error, field) in errors">
              <li v-for="(msg, index) in error" :key="index">
                {{ field }} {{ msg }}
              </li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <!-- 名称 -->
            <fieldset class="form-group" v-if="!isLogin">
              <input 
                class="form-control form-control-lg"
                v-model="user.username"
                type="text"
                placeholder="Your Name"
                required>
            </fieldset>
            <!-- email -->
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                v-model="user.email"
                type="email"
                placeholder="Email"
                required>
            </fieldset>
            <!-- password -->
            <fieldset class="form-group">
              <input
               class="form-control form-control-lg" 
               type="password" 
               v-model="user.password"
               placeholder="Password"
               required
               minlength="8">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template> 
<script> 
import { login, register } from '@/api/user'
const Cookie = process.client ? require('js-cookie') : undefined
export default { 
  name: 'loginPage',
  data () {
    return {
      user: {
        username: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  middleware: 'noauthenticated',
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
  },
  head () {
    return {
      title: this.isLogin ? `Sign in - Fox Home` : `Sign up - Fox Home`
    }
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin ? await login(this.user) : await register(this.user)
        console.log(data)
        // 保存
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)
        // 跳转
        this.$router.push('/')
      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script> 

<style> </style>