<template>
  <nav>
    <ul class="pagination">
      <li
        class="page-item"
        :class="{
          active: item === page
        }"
        v-for="item in totalPage"
        :key="item">
        <nuxt-link 
          class="page-link"
          :to="{
            name: pageTo,
            query: {
              page: item,
              ...pageOtherParams
            }
          }">{{ item }}</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'articlePagination',
  props: {
    articlesCount: {
      type: Number,
      require: true
    },
    limit: {
      type: Number,
      require: true
    },
    pageOtherParams: {
      type: Object,
      require: true
    },
    pageTo: {
      type: String,
      require: true
    },
    page: {
      type: Number,
      require: true
    }
  },
  computed: {
    totalPage () {
      const pageNum = Math.ceil(this.articlesCount / this.limit)
      return pageNum > 1 ? pageNum : 0
    }
  },
  methods: {
    
  }
}
</script>

<style></style>