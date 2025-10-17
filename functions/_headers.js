export async function onRequest(context) {
  // 返回静态文件
  return context.env.ASSETS.fetch(context.request);
}