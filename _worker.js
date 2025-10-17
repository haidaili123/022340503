export default {
  async fetch(request, env) {
    // 简单的静态文件服务器
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // 默认路由到index.html
    if (pathname === '/') {
      pathname = '/index.html';
    }
    
    // 尝试从ASSETS获取文件
    try {
      return await env.ASSETS.fetch(new Request(new URL(pathname, url.origin)));
    } catch (error) {
      // 如果文件不存在，返回404
      return new Response('Not Found', { status: 404 });
    }
  }
};