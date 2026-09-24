# distill

Turn a rough idea into an AI-ready prompt.

**Live:** https://oniko-io.github.io/distill/

Type (or dictate) what you want, however messy. distill rewrites it into a clear prompt for:

- **Claude Code**: goal, context, constraints, and "done when" criteria, ready to paste into Claude Code.
- **General AI**: a clean prompt for any chat assistant (ChatGPT, Claude, Gemini, ...).

The rewrite runs on the OpenAI API with your own key.

## Use it

1. Open the site, or open `index.html` locally.
2. Tap **Settings**, paste your OpenAI API key, pick a model (default `gpt-5.5`: it follows the rewrite rules best and answers in a few seconds; mini models run slower here and pad the prompt).
3. Pick a mode, type your idea, press **Distill** (or `Ctrl+Enter`), then **Copy**.

On a phone, use your browser's **Add to Home Screen** to open distill like an app. Avoid private/incognito windows: they forget your key when closed.

## Privacy

Your key is stored only in your browser's localStorage and is sent only to `api.openai.com`. Anyone can open the site, but it has no key of its own: each visitor uses and pays for their own. Use a project key with a spending limit. The page asks search engines not to index it.

## Customize

The rewrite instructions for each mode live in [`prompts.js`](prompts.js). Edit them to change the output style.

To check a change against real output, save an OpenAI key in `~/.config/distill/openai-key` and run `node tools/try-prompts.js [model]`. It runs a set of sample ideas (tiny, messy, vague, question, large) and writes each prompt to `tools/out/`.

## Stack

Plain HTML, CSS, and JavaScript. No build step, no dependencies. Deployed by GitHub Pages from `main`: every push goes live in about a minute.
