<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">
        <!-- 标题 -->
        <h1>{{ article.title }}</h1>
        <!-- 用户信息 -->
        <article-meta :article="article" v-on:onFavorite="onFavorite"/>

      </div>
    </div>

    <div class="container page">
      <!-- 正文 -->
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body">
        </div>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline" v-for="(tag, index) in article.tagList" :key="index">
            {{ tag }}
          </li>
        </ul>
      </div>

      <hr />

      <div class="article-actions">
        <!-- 用户信息 -->
        <article-meta :article="article" v-on:onFavorite="onFavorite"/>
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">
          <!-- 评论 -->
          <article-comments :article="article"/>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { getArticle, addFavorite, deleteFavorite } from "@/api/article"
import MarkdownIt from "markdown-it";
import ArticleMeta from './components/article-meta'
import ArticleComments from './components/article-comments'
export default {
  name: 'articlePage',
  components: {
    ArticleMeta,
    ArticleComments
  },
  head () {
    return {
      title: `${this.article.title} - Fox Home`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug)
    const { article } = data
    article.followDisabled = false
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    return {
      article
    }
  },
  methods: {
    async onFavorite(article) {
      this.article.disabled = true
      this.article.favorited = !article.favorited
      if(this.article.favorited) {
        await addFavorite(this.article.slug)
        this.article.favoritesCount += 1
      } else {
        await deleteFavorite(this.article.slug)
        this.article.favoritesCount += -1
      }
      this.article.disabled = false
    }
  }
}
</script>

<style>

</style>