<template> 
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }">
      <img :src="article.author.image ? article.author.image : '/default.jpg'" onerror="this.src='/default.jpg'"/>
    </nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
        class="author">
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date }}</span>
    </div>
    <!-- 如果是自己 -->
    <template v-if="isMe">
      <!-- 编辑 -->
      <nuxt-link 
        class="btn btn-outline-secondary btn-sm"
        :to="{
          name: 'editor',
          params: {
            slug: article.slug
          }
        }">
        <i class="ion-edit"></i> Edit Article
      </nuxt-link>
      <!-- 删除 -->
      <button 
        class="btn btn-outline-danger btn-sm" 
        @click="deleteArticle"
        :disabled="disabled">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
    <template v-else>
      <!-- 收藏 -->
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        @click="onFollow"
        :disabled="article.followDisabled">
        <i :class="!article.author.following ? 'ion-plus-round' : 'ion-minus-round'"></i>
        &nbsp;
        {{article.author.following ? 'UnFollow' : 'Follow'}} {{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <!-- 点赞 -->
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        @click="favoriteHandler"
        :disabled="article.disabled">
        <i class="ion-heart"></i>
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>   
<script> 
import { followUser, unFollowUser } from '@/api/user'
import { deleteArticle } from '@/api/article'
import { mapState } from 'vuex'
export default { 
    name: 'ArticleMeta',
    props: {
      article: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        disabled: false
      }
    },
    computed: {
    ...mapState(['user']),
    isMe () {
      return this.user && this.article.author.username === this.user.username
    }
  },
    methods: {
      favoriteHandler() {
        console.log("click")
        this.$emit('onFavorite', this.article)
      },
      async onFollow() {
        this.article.followDisabled = true
        this.article.author.following = !this.article.author.following
        // 如果是true就关注，false就取消
        this.article.author.following ? await followUser(this.article.author.username) : await unFollowUser(this.article.author.username)
        this.article.followDisabled = false
      },
      async deleteArticle() {
        this.disabled = true
        try{
          await deleteArticle(this.article.slug)
          this.$router.push({
            name: 'profile',
            params: {
              username: this.article.author.username
            }
          })
        } catch (error) {
          console.log(error)
        }
        this.disabled = false
      }
    }
}
</script> 

<style> </style>