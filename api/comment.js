import { request } from '@/plugins/request'

//获取文章评论
export const getComments = slug => {
  return request ({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}

// 添加评论
export const addComment = ({slug, body}) => {
  return request ({
    method: 'POST',
    url: `/api/articles/${slug}/comments`,
    data: {
      comment: {
        body
      }
    }
  })
}

// 删除评论
export const deleteComment = ({slug, id}) => {
  return request ({
    method: 'DELETE',
    url: `/api/articles/${slug}/comments/${id}`
  })
}