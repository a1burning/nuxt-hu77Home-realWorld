import { request } from '@/plugins/request.js'
import axios from 'axios'

export const login = params => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data: {
      user: params
    }
  })
}

export const register = params => {
  return request({
    method: 'POST',
    url: '/api/users',
    data: {
      user: params
    }
  })
}

export const followUser = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

export const unFollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}

export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}

// 查询现在的用户
export const currentUser = () => {
  return request({
    method: 'GET',
    url: '/api/user'
  })
}

export const updateUser = user => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data: {
      user
    }  
  })
}