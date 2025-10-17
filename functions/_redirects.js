export async function onRequest(context) {
  const url = new URL(context.request.url);
  
  // 处理重定向
  if (url.pathname !== '/') {
    return Response.redirect(url.origin + '/index.html', 301);
  }
  
  return context.env.ASSETS.fetch(context.request);
}