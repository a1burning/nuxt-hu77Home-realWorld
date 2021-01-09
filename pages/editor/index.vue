<template> 
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <!-- 错误信息 -->
          <ul class="error-messages">
            <template v-for="(error, field) in errors">
              <li v-for="(msg, index) in error" :key="index">
                {{ field }} {{ msg }}
              </li>
            </template>
          </ul>

        <!-- 表单 -->
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <!-- 标题 -->
              <fieldset class="form-group">
                  <input type="text" class="form-control form-control-lg" placeholder="Article Title"
                  required
                  v-model="article.title">
              </fieldset>
              <!-- 描述 -->
              <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="What's this article about?"
                  required
                  v-model="article.description">
              </fieldset>
              <!-- 正文 -->
              <fieldset class="form-group">
                  <textarea class="form-control" rows="8" placeholder="Write your article (in markdown)"
                  required
                  v-model="article.body"></textarea>
              </fieldset>
              <!-- 标签 -->
              <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="Enter tags"
                  v-model="tagInput"
                  v-on:keyup.13="addTag">
                  <!-- tag列表 -->
                  <div class="tag-list">
                    <span class="tag-default tag-pill" v-for="(tag, index) in article.tagList" :key="index">
                      <i 
                        class="ion-close-round"
                        @click="removeTag(index)"></i>
                      {{ tag }}
                    </span>
                  </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click.prevent="onSubmit">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template> 
<script> 
import { createArticle, getArticle, updateArticle } from '@/api/article'
export default { 
  middleware: 'authenticated',
  name: 'EditorPage',
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: []
      },
      errors: {},
      tagInput: '',
      slug: ''
    }
  },
  async asyncData({ params }) {
    const slug = params.slug
    if (slug) {
      const { data } = await getArticle(slug)
      return {
        article: data.article,
        slug
      }
    } else {
      return {
        article: {
          title: '',
          description: '',
          body: '',
          tagList: []
        },
        errors: {},
        tagInput: '',
        slug: ''
      }
    }
  },
  head () {
    return {
      title: `Editor - Fox Home`
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 更新
        const { data } = this.slug ? await updateArticle({
            slug: this.slug,
            article: this.article
          })
        : await createArticle(this.article)
        const { article: newArticle } = data
        console.log(newArticle)
        this.$router.push({
          name: 'article',
          params: {
            slug: newArticle.slug
          }
        })
      } catch (error) {
        this.errors = error.response.data.errors
      }
    },
    // 添加tag
    addTag() {
      const tag = this.article.tagList.find(item => item === this.tagInput)
      console.log(tag)
      if (!tag) {
        this.article.tagList.push(this.tagInput)
        this.tagInput = ''
      }
    },
    // 移除tag
    removeTag (index) {
      console.log(index)
      this.article.tagList.splice(index,1)
    }
  }
}
</script> 

<style> </style>