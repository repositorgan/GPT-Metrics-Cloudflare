/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. /stats endpoint (GET)
    if (url.pathname === "/stats") {
      const list = await env.METRICS.list();
      const events = [];

      for (const key of list.keys) {
        const value = await env.METRICS.get(key.name);
        if (value) events.push(JSON.parse(value));
      }

      return new Response(JSON.stringify({
        total_events: events.length,
        events
      }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Root endpoint (POST) for analytics ingestion
    if (request.method === "POST") {
      const body = await request.json();
      const key = `event:${Date.now()}`;
      await env.METRICS.put(key, JSON.stringify(body));
      return new Response("OK", { status: 200 });
    }

    // 3. Fallback
    return new Response("Not Found", { status: 404 });
  }
};
