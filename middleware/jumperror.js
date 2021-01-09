export default function ({ params, redirect }) {
  // 判断不合法
  const isIncludes = params.username && params.username.includes("@")
  if(isIncludes) {
    // 跳转到首页
    return redirect('/')
  }
}