export default {
  async fetch(request, env) {
    const list = await env.METRICS.list();
    const keys = list.keys;

    // Fetch each event
    const events = [];
    for (const key of keys) {
      const value = await env.METRICS.get(key.name);
      events.push(JSON.parse(value));
    }

    return new Response(JSON.stringify({
      total_events: events.length,
      events
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
