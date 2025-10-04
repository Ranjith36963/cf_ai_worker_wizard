Open `PROMPTS.md` in VS Code and paste this complete content:

```markdown
# AI Prompts Documentation

This document contains all AI prompts used in the development and operation of the cf_ai_worker_wizard project.

## Table of Contents

1. [System Prompts](#system-prompts)
2. [Code Generation Prompts](#code-generation-prompts)
3. [Development Prompts](#development-prompts)
4. [Prompt Engineering Decisions](#prompt-engineering-decisions)

---

## System Prompts

### Main Code Generation System Prompt

**Location**: `src/index.js` (lines 63-71)

**Prompt**:
```
You are an expert Cloudflare Workers developer. Generate clean, working Cloudflare Worker code based on user requests. Always include:
- Proper export default syntax
- Error handling
- CORS headers when needed
- Comments explaining the code
- Modern JavaScript (ES modules)

Return ONLY the code, no explanations before or after.
```

**Purpose**: Ensures the AI generates production-ready Worker code with best practices.

**Key Requirements**:
- **Export syntax**: Ensures code works with Workers runtime
- **Error handling**: Makes generated code robust
- **CORS headers**: Common requirement for APIs
- **Comments**: Makes code understandable
- **ES modules**: Modern JavaScript standard
- **Code only**: Prevents extra text that would break copy-paste

---

## Code Generation Prompts

### User Prompt Template

**Location**: `src/index.js` (line 73)

**Template**:
```javascript
const userPrompt = `Create a Cloudflare Worker that: ${message}`;
```

**Example Inputs**:
1. "returns Hello World"
2. "returns JSON with current timestamp"
3. "handles CORS and returns user data"

**Example Output** (for input 1):
```javascript
export default {
  async fetch(request) {
    return new Response('Hello World', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};
```

---

## Development Prompts

These are the prompts I used with Claude AI during the development of this project.

### 1. Initial Architecture Prompt

**Used in**: Project planning phase

**Prompt**:
```
I need to build a Cloudflare AI application that meets these requirements:
- Use Llama 3.3 on Workers AI
- Implement Cloudflare Workers and Durable Objects
- Create a chat interface
- Include persistent state/memory
- Repository must start with cf_ai_
- Must have README.md and PROMPTS.md

Help me design the architecture and file structure.
```

**Result**: Designed the 3-tier architecture (UI → Worker → AI + Durable Objects)

---

### 2. Code Implementation Prompt

**Used in**: Building the main Worker

**Prompt**:
```
Create a Cloudflare Worker that:
1. Serves an HTML chat interface
2. Accepts POST requests to /api/generate
3. Calls Llama 3.3 via Workers AI binding
4. Stores conversation history in Durable Objects
5. Returns generated code to the frontend
```

**Result**: Complete `src/index.js` implementation

---

### 3. UI Design Prompt

**Used in**: Creating the frontend

**Prompt**:
```
Create an HTML page with:
- Beautiful gradient background
- Two-panel layout (chat left, code display right)
- Chat input with send button
- Code display with syntax highlighting
- Copy button for generated code
- Responsive design
- Loading indicators
```

**Result**: Complete `public/index.html` with modern UI

---

### 4. Durable Objects Prompt

**Used in**: Implementing state management

**Prompt**:
```
Create a Durable Object class that:
- Stores conversation messages
- Persists across page refreshes
- Supports GET and POST operations
- Returns conversation history as JSON
```

**Result**: Complete `src/conversation.js` implementation

---

### 5. Debugging Prompt

**Used in**: Fixing authentication issues

**Prompt**:
```
I'm getting "10000: Authentication error" when calling Workers AI in local development. 
The error occurs even with CLOUDFLARE_API_TOKEN set. How do I fix this?
```

**Result**: Discovered that local development requires OAuth login (`wrangler login`) instead of API tokens

---

## Prompt Engineering Decisions

### Why These System Prompt Choices?

**1. "Export default syntax"**
- Workers require specific export format
- Without this, generated code won't run

**2. "Return ONLY the code"**
- Prevents AI from adding explanations
- Makes copy-paste work immediately
- Users can see the code without parsing extra text

**3. "Error handling"**
- Production code needs error handling
- Prevents Worker crashes
- Better user experience

**4. "CORS headers when needed"**
- Most APIs need CORS
- Common pain point for developers
- AI includes it automatically when relevant

**5. "Modern JavaScript (ES modules)"**
- Workers use ES modules, not CommonJS
- Ensures compatibility
- Follows current best practices

---

## Model Configuration

**Model**: `@cf/meta/llama-3.3-70b-instruct-fp8-fast`

**Parameters**:
```javascript
{
  max_tokens: 2048,    // Enough for complete Worker code
  temperature: 0.7     // Balance between creativity and consistency
}
```

**Why Llama 3.3?**
- Recommended by Cloudflare for Workers AI
- Good code generation capabilities
- Fast inference time
- Cost-effective

**Why temperature 0.7?**
- 0.0 = Too deterministic, repetitive code
- 1.0 = Too random, potential syntax errors
- 0.7 = Good balance for code generation

---

## Prompt Iteration Process

### Initial Attempt
```
Generate a Cloudflare Worker based on: ${message}
```
**Problem**: Generated code with explanations, inconsistent format

### Second Attempt
```
You are a Cloudflare Workers expert. Generate code for: ${message}
Return only code, no explanations.
```
**Problem**: Sometimes missing error handling and CORS

### Final Version (Current)
```
You are an expert Cloudflare Workers developer. Generate clean, working 
Cloudflare Worker code based on user requests. Always include:
- Proper export default syntax
- Error handling
- CORS headers when needed
- Comments explaining the code
- Modern JavaScript (ES modules)

Return ONLY the code, no explanations before or after.
```
**Result**: Consistent, production-ready code with all best practices

---

## Testing Prompts

Example prompts used to test the system:

1. ✅ "Create a Worker that returns Hello World"
2. ✅ "Build a Worker that returns JSON with current timestamp"
3. ✅ "Make a Worker that handles CORS"
4. ✅ "Create a Worker with error handling"
5. ✅ "Build a Worker that fetches from an API"

All prompts generated valid, working code.

---

## Lessons Learned

1. **Specificity matters**: Vague prompts produce inconsistent results
2. **Explicit requirements**: List all must-have features in system prompt
3. **Output format control**: "Return ONLY the code" is critical
4. **Temperature tuning**: 0.7 works well for code generation
5. **Context length**: 2048 tokens sufficient for most Workers

---

## Future Improvements

Potential prompt enhancements:
- Add TypeScript support option
- Include unit test generation
- Add performance optimization suggestions
- Generate deployment configurations
- Include documentation generation

---

**Last Updated**: October 4, 2025
**Model Version**: Llama 3.3 70B Instruct (FP8 Fast)
**AI Assistant Used**: Claude (Anthropic) for development guidance
```