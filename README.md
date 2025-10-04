```markdown
# cf_ai_worker_wizard

AI-powered Cloudflare Worker code generator built with Llama 3.3. Describe what you want in natural language and get production-ready Worker code instantly.

## Live Demo

🚀 **[Try it live](https://cf-ai-worker-wizard.rahulranjith369.workers.dev)**

## Features

- **AI Code Generation**: Uses Llama 3.3 on Workers AI to generate clean, working Cloudflare Worker code
- **Chat Interface**: Simple text-based input for describing Workers
- **Persistent Conversations**: Durable Objects store conversation history across sessions
- **Real-time Generation**: Code appears in seconds with syntax highlighting
- **One-Click Copy**: Copy generated code instantly to your clipboard
- **Error Handling**: Comprehensive error handling throughout the application
- **CORS Support**: Properly configured CORS headers for API endpoints

## Tech Stack

- **LLM**: Llama 3.3 70B (via Workers AI - `@cf/meta/llama-3.3-70b-instruct-fp8-fast`)
- **Runtime**: Cloudflare Workers
- **State Management**: Cloudflare Durable Objects
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Cloudflare Workers & Pages

## Architecture

```
┌─────────────────┐
│   User Browser  │
│  (Chat UI)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│ Worker          │◄──────── API Requests
│ (src/index.js)  │
└────┬────────┬───┘
     │        │
     ▼        ▼
┌─────────┐ ┌──────────────┐
│ Workers │ │   Durable    │
│   AI    │ │   Objects    │
│(Llama3.3)│ │(Conversation)│
└─────────┘ └──────────────┘
```

## Requirements Met

This project fulfills all Cloudflare assignment requirements:

✅ **LLM**: Llama 3.3 on Workers AI  
✅ **Workflow**: Cloudflare Workers + Durable Objects  
✅ **User Input**: Chat interface  
✅ **Memory/State**: Durable Objects for conversation persistence  

## Project Structure

```
cf_ai_worker_wizard/
├── src/
│   ├── index.js           # Main Worker with AI integration
│   └── conversation.js    # Durable Object for state management
├── public/
│   └── index.html         # Chat UI
├── wrangler.toml          # Cloudflare configuration
├── package.json           # Dependencies
├── README.md              # This file
├── PROMPTS.md             # AI prompts documentation
└── .gitignore             # Git ignore rules
```

## Local Development

### Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ranjith36963/cf_ai_worker_wizard.git
   cd cf_ai_worker_wizard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```
   This opens your browser to authorize Wrangler.

4. **Start development server**
   ```bash
   npx wrangler dev --local
   ```

5. **Open in browser**
   Navigate to `http://localhost:8787`

### Testing Locally

Try these example prompts:
- "Create a Worker that returns Hello World"
- "Build a Worker that returns JSON with current timestamp"
- "Make a Worker that handles CORS and returns user data"

## Deployment

### Deploy to Cloudflare

1. **Deploy the Worker**
   ```bash
   npx wrangler deploy
   ```

2. **Access your live app**
   After deployment, Wrangler outputs your live URL:
   ```
   https://cf-ai-worker-wizard.rahulranjith369.workers.dev/
   ```

### Configuration

The `wrangler.toml` file contains all necessary configuration:
- Workers AI binding for Llama 3.3
- Durable Objects binding for conversation state
- Static asset serving from `public/` directory

## How It Works

1. **User Input**: User describes desired Worker functionality in the chat interface
2. **Request Processing**: Frontend sends request to `/api/generate` endpoint
3. **State Management**: Durable Object stores the conversation message
4. **AI Generation**: Worker calls Llama 3.3 via Workers AI with system and user prompts
5. **Code Return**: Generated code is displayed with syntax highlighting
6. **Conversation History**: All messages persist in Durable Object storage

## API Endpoints

### `POST /api/generate`
Generates Worker code based on user description.

**Request:**
```json
{
  "message": "Create a Worker that returns Hello World",
  "sessionId": "session-12345"
}
```

**Response:**
```json
{
  "code": "export default { async fetch(request) { ... } }",
  "success": true
}
```

### `GET /api/history?sessionId=session-12345`
Retrieves conversation history for a session.

**Response:**
```json
[
  {
    "role": "user",
    "content": "Create a Worker that returns Hello World",
    "timestamp": 1696435200000
  },
  {
    "role": "assistant",
    "content": "export default { ... }",
    "timestamp": 1696435205000
  }
]
```

## Development Notes

- **AI Costs**: Workers AI calls incur usage charges even in local development
- **Authentication**: Local development uses OAuth login (`wrangler login`)
- **State Persistence**: Durable Objects provide strong consistency for conversation history
- **CORS**: API endpoints include proper CORS headers for cross-origin requests

## Troubleshooting

**"Authentication error" when generating code:**
- Run `npx wrangler logout` then `npx wrangler login`
- Ensure you're logged in via OAuth (not API token) for local dev

**Page loads slowly:**
- First request may be slow as Durable Object initializes
- Subsequent requests are fast

**Code doesn't generate:**
- Check browser console for errors
- Verify `npx wrangler dev --local` is running
- Ensure you have Workers AI enabled in your Cloudflare account

## License

MIT

## Author

Ranjith Maliga Guruprakash

## Acknowledgments

Built for the Cloudflare AI Application Assignment. AI-assisted development using Claude (Anthropic) for architecture guidance and debugging. All code implementation is original.
```