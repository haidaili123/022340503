export async function onRequest(context) {
  // 简单的静态文件服务
  return context.env.ASSETS.fetch(context.request);
}