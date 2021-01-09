import { request } from '@/plugins/request'

// 获取文章列表
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 获取单个文章
export const getArticle = slug => {
  return request ({
    method: 'GET',
    url: `/api/articles/${slug}`
  })
}

// 获取用户文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/api/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}/favorite`
  })
}

// 创建文章
export const createArticle = article => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data: {
      article
    }
  })
}

// 更新文章
export const updateArticle = ({slug, article}) => {
  console.log(slug,article)
  return request({
    method: 'PUT',
    url: `/api/articles/${slug}`,
    data: {
      article
    }
  })
}

//删除文章
export const deleteArticle = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}`
  })
}

