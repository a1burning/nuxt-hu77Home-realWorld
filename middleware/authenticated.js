export default function ({ store, redirect }) {
  // 判断如果没有user，就是没有登录
  if(!store.state.user) {
    // 跳转到登录页面
    return redirect('/login')
  }
}