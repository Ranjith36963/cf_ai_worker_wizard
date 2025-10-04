/**
 * AI Worker Code Generator
 * 
 * Requirements fulfilled:
 * ✅ LLM: Llama 3.3 on Workers AI
 * ✅ Workflow: User input → LLM → Response
 * ✅ Input: Chat interface
 * ✅ State: Durable Objects for conversation history
 */

import { ConversationState } from './conversation.js';
import html from '../public/index.html';

export { ConversationState };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Serve static HTML
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // API endpoint for code generation
    if (url.pathname === '/api/generate' && request.method === 'POST') {
      try {
        const { message, sessionId } = await request.json();
        
        console.log('=== AI Request Debug ===');
        console.log('Message:', message);
        console.log('Has AI binding:', !!env.AI);
        
        // Get Durable Object for this session
        const id = env.CONVERSATIONS.idFromName(sessionId);
        const stub = env.CONVERSATIONS.get(id);
        
        // Save user message
        await stub.fetch(new Request('http://fake/messages', {
          method: 'POST',
          body: JSON.stringify({ role: 'user', content: message }),
          headers: { 'Content-Type': 'application/json' }
        }));
        
        // Generate code using Llama 3.3
        const systemPrompt = `You are an expert Cloudflare Workers developer. Generate clean, working Cloudflare Worker code based on user requests. Always include:
- Proper export default syntax
- Error handling
- CORS headers when needed
- Comments explaining the code
- Modern JavaScript (ES modules)

Return ONLY the code, no explanations before or after.`;

        const userPrompt = `Create a Cloudflare Worker that: ${message}`;
        
        console.log('Calling AI...');
        
        const aiResponse = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_tokens: 2048,
          temperature: 0.7,
        });
        
        console.log('AI response received');
        
        const generatedCode = aiResponse.response;
        
        // Save assistant response
        await stub.fetch(new Request('http://fake/messages', {
          method: 'POST',
          body: JSON.stringify({ role: 'assistant', content: generatedCode }),
          headers: { 'Content-Type': 'application/json' }
        }));
        
        return new Response(JSON.stringify({ 
          code: generatedCode,
          success: true 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        console.error('=== ERROR ===');
        console.error('Type:', error.constructor.name);
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        
        return new Response(JSON.stringify({ 
          error: error.message,
          errorType: error.constructor.name,
          success: false 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Get conversation history
    if (url.pathname === '/api/history' && request.method === 'GET') {
      const sessionId = url.searchParams.get('sessionId');
      const id = env.CONVERSATIONS.idFromName(sessionId);
      const stub = env.CONVERSATIONS.get(id);
      
      const response = await stub.fetch(new Request('http://fake/messages'));
      const messages = await response.json();
      
      return new Response(JSON.stringify(messages), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('Not found', { status: 404 });
  }
};