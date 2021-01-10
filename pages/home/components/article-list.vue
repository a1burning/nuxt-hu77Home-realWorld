<template>
  <div>
    <div 
      class="article-preview"
      v-for="article in articles"
      :key="article.slug"
      >
      <div class="article-meta">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: article.author.username
            }
          }">
          <!-- 图片错误处理 -->
          <img 
            :src="article.author.image ? article.author.image : '/nuxt-hu77-realworld/default.jpg'" 
            onerror="this.src='/nuxt-hu77-realworld/default.jpg'"
          />
        </nuxt-link>
        <div class="info">
          <nuxt-link
            :to="{
              name: 'profile',
              params: {
                username: article.author.username
              }
            }" 
            class="author"
          >{{ article.author.username }}
          </nuxt-link>
          <span class="date">{{ article.createdAt | date }}</span>
        </div>
        <!-- 文章点赞 -->
        <button 
          class="btn btn-outline-primary btn-sm pull-xs-right"
          :class="{
            active: article.favorited
          }"
          @click="onFavorite(article)"
          :disabled="article.disabled">
          <i class="ion-heart"></i> {{ article.favoritesCount }}
        </button>
      </div>
      <nuxt-link
        :to="{
          name: 'article',
          params: {
            slug: article.slug
          }
        }" class="preview-link">
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
        <ul class="tag-list">
          <li class="tag-default tag-pill tag-outline" v-for="(tag, index) in article.tagList" :key="index">
            {{ tag }}
          </li>
        </ul>
      </nuxt-link>
    </div>
    <div class="article-preview" v-if="!articles.length">
      No articles are here... yet.
    </div>
  </div>
</template>

<script>
import { deleteFavorite, addFavorite } from '@/api/article'
export default {
  name: 'articleList',
  props: {
    articles: {
      type: Array,
      require: true
    }
  },
  methods: {
    async onFavorite(article) {
      article.disabled = true
      if( article.favorited ){
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.disabled = false
    }
  }
}
</script>

<style></style>