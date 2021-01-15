<template> 
  <div class="profile-page">
    <!-- 用户信息 -->
    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img 
              :src="profile.image ? profile.image : '/default.jpg'" 
              class="user-img"
              onerror="this.src='/default.jpg'" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <!-- 不是自己就关注 -->
            <button 
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: profile.following
              }"
              v-if="!isMe"
              @click="onFollow"
              :disabled="profile.followDisabled">
              <i :class="!profile.following ? 'ion-plus-round' : 'ion-minus-round'"></i>
              &nbsp;
              {{ profile.following ?  'UnFollow' : 'Follow'}} {{ profile.username }} 
            </button>
            <!-- 是自己就编辑 -->
            <nuxt-link
              :to="{
                name:'settings'
              }"
              v-else>
              <button 
                class="btn btn-sm btn-outline-secondary action-btn">
                <i class="ion-gear-a"></i>
                &nbsp;
                Edit Profile Settings 
              </button>
            </nuxt-link>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <!-- tab栏 -->
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                  exact>My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                 class="nav-link"
                 :class="{
                   active: tab === 'fav-articles'
                 }" 
                 :to="{
                   name: 'profile',
                   query: {
                     tab: 'fav-articles'
                   }
                 }"
                 exact>Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章 -->
          <article-list :articles="articles"/>

          <!-- 分页 -->
          <article-pagination                   :articlesCount="articlesCount" :limit="limit" :pageOtherParams="pageOtherParams"
          :pageTo="'profile'"
          :page="page"/>
        </div>

      </div>
    </div>

  </div>
</template> 
<script> 
import { mapState } from 'vuex'
import { getProfile, followUser, unFollowUser } from '@/api/user'
import { getArticles } from '@/api/article'
import articleList from '../home/components/article-list.vue'
import articlePagination from '../home/components/article-pagination.vue'
export default {
  components: { 
    articleList,
    articlePagination
  }, 
  middleware: ['authenticated', 'jumperror'],
  name: 'UserProfile',
  computed: {
    ...mapState(['user']),
    isMe () {
      console.log(this.$route.params.username)
      return this.$route.params.username === this.user.username
    }
  },
  head () {
    return {
      title: this.$route.query.tab === 'fav-articles' ? `Articles favorited by ${this.profile.username} - Fox Home` : `@${this.profile.username} - Fox Home`
    }
  },
  watchQuery: ['tab','page'],
  async asyncData({ params, query, store }) {
    console.log(query)
    const page = Number.parseInt(query.page || 1)
    const limit = 5
    const { tab = 'my_articles'} = query
    // 获取用户信息
    const { data } = await getProfile(params.username)
    const { profile } = data 
    console.log(profile)
    // 获取文章信息
    const { data: articlesData } = await getArticles({
      ...tab === 'my_articles' ? { author: profile.username } : {},
      limit,
      offset: (page - 1) * limit,
      ...tab === 'my_articles' ? {} : { favorited: profile.username}
    })
    console.log(articlesData)
    
    const { articles, articlesCount } = articlesData
    profile.followDisabled = false
    return {
      profile,
      articles,
      articlesCount,
      limit,
      tab,
      page,
      pageOtherParams: {
        tab
      }
    }
  },
  methods: {
    async onFollow() {
      this.profile.followDisabled = true
      this.profile.following = !this.profile.following
      this.profile.following ? await followUser(this.profile.username) : await unFollowUser(this.profile.username)
      this.profile.followDisabled = false
    }
  }
}
</script> 

<style> </style>