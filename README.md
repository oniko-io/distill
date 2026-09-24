# distill

Turn a rough idea into an AI-ready prompt.

Type (or dictate) what you want, however messy. distill rewrites it into a clear prompt for:

- **Claude Code**: goal, context, constraints, and "done when" criteria, ready to paste into Claude Code.
- **General AI**: a clean prompt for any chat assistant (ChatGPT, Claude, Gemini, ...).

The rewrite runs on the OpenAI API with your own key.

## Use it

1. Open the site (GitHub Pages) or open `index.html` locally.
2. Click **Settings**, paste your OpenAI API key, pick a model (default `gpt-5-mini`).
3. Pick a mode, type your idea, press **Distill** (or `Ctrl+Enter`).

Your key is stored only in your browser's localStorage and is sent only to `api.openai.com`. Use a project key with a spending limit.

## Customize

The rewrite instructions for each mode live in [`prompts.js`](prompts.js). Edit them to change the output style.

## Stack

Plain HTML, CSS, and JavaScript. No build step, no dependencies.
