<template>
  <div v-if="user">
    <!-- 发表评论 -->
    <form class="card comment-form" @submit.prevent="onSubmit">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3" v-model="writeComment" required></textarea>
      </div>
      <div class="card-footer">
        <img 
          :src="user.image ? user.image : '/default.png'" 
          class="comment-author-img"
          onerror="this.src='/default.png'" />
        <button class="btn btn-sm btn-primary" :disabled="disabled">
        Post Comment
        </button>
      </div>
    </form>

    <!-- 评论卡片 -->
    <div class="card" v-for="(comment, index) in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" class="comment-author">
          <img 
          :src="comment.author.image ? comment.author.image : '/articleDefault.jpg'" 
          class="comment-author-img" 
          onerror="this.src='/articleDefault.jpg'"/>
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }" class="comment-author">{{ comment.author.username }}</nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date }}</span>
        <span class="mod-options" v-if="isMe">
          <i class="ion-trash-a" @click="delComment(index, comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from '@/api/comment'
import { mapState } from 'vuex'
export default {
  name:'articleComments',
  props: {
    article: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      comments: [],
      writeComment: '',
      disabled: false,
      delDisabled: false
    }
  },
  async mounted() {
    const { data } = await getComments(this.article.slug)
    this.comments = data.comments
  },
  computed: {
    ...mapState(['user']),
    isMe () {
      return this.user && this.article.author.username === this.user.username
    }
  },
  methods: {
    async onSubmit() {
      this.disabled = true
      const { data } = await addComment({
        slug: this.article.slug,
        body: this.writeComment
      })
      console.log(data)
      this.comments.push(data.comment)
      this.disabled = false
    },
    async delComment(index, { id }) {
      if(!this.delDisabled){
        this.delDisabled = true
        await deleteComment({
          slug: this.article.slug,
          id
        })
        this.comments.splice(index, 1)
        this.delDisabled = false
      }
    }
  }
}
</script>

<style>

</style>