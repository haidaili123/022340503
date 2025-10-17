export async function onRequest(context) {
  // 简单的静态文件重定向到index.html
  const url = new URL(context.request.url);
  
  // 如果不是根路径且不是静态文件，重定向到index.html
  if (!url.pathname.includes('.') && url.pathname !== '/') {
    return Response.redirect(new URL('/', url.origin), 301);
  }
  
  return context.env.ASSETS.fetch(context.request);
}