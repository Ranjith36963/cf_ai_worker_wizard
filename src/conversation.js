/**
 * Durable Object: Stores conversation history
 * This provides the "state/memory" requirement
 */
export class ConversationState {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    
    if (url.pathname === '/messages') {
      if (request.method === 'GET') {
        // Get conversation history
        const messages = (await this.state.storage.get('messages')) || [];
        return new Response(JSON.stringify(messages), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (request.method === 'POST') {
        // Add message to conversation
        const { role, content } = await request.json();
        const messages = (await this.state.storage.get('messages')) || [];
        messages.push({ role, content, timestamp: Date.now() });
        await this.state.storage.put('messages', messages);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response('Not found', { status: 404 });
  }
}