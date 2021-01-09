<template> 
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Fox Home</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <!-- 导航栏 -->
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <!-- 我的文章 -->
              <li class="nav-item" v-if="user">
                <nuxt-link 
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  >Your Feed
                </nuxt-link>  
              </li>
              <!-- 全部文章 -->
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                  exact
                  >Global Feed
                </nuxt-link>  
              </li>
              <!-- 标签文章 -->
              <li class="nav-item" v-if="tag">
                <nuxt-link 
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag: tag
                    }
                  }"
                >#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->
          <article-list :articles="articles" />

          <!-- 分页 -->
          <article-pagination                   :articlesCount="articlesCount" :limit="limit" :pageOtherParams="pageOtherParams"
          :pageTo="'home'"
          :page="page"/>

        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <!-- 标签list -->
            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item">
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template> 
<script> 
import { getArticles, getFeedArticles } from '@/api/article'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'
import articleList from './components/article-list.vue'
import ArticlePagination from './components/article-pagination.vue'
export default {
  components: { 
    articleList,
    ArticlePagination
  }, 
  name: 'homePage',
  head () {
    return {
      title: `Home - Fox Home`
    }
  },
  async asyncData ({ query, store }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const { tag, tab = 'global_feed' } = query
    const loadArticles = store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [ articleData, tagData ] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleData.data
    const { tags } = tagData.data
    articles.forEach(item => item.disabled = false)
    return {
      articles,
      articlesCount,
      page,
      limit,
      tags,
      tag,
      tab,
      pageOtherParams: {
        tag,
        tab
      }
    }
  },
  watchQuery: ['page','tag','tab'],
  computed : {
    ...mapState(['user'])
  }
}
</script> 

<style> </style>