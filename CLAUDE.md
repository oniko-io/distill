# distill

Static web app: user types a rough idea → OpenAI API rewrites it into a prompt for Claude Code or a general AI chat. Hosted on GitHub Pages.

- `index.html`, `style.css`: UI. Colors are CSS variables on `:root` with a dark-mode override.
- `app.js`: settings (API key + model in localStorage), OpenAI Chat Completions call, copy button.
- `prompts.js`: system prompt per output mode (`MODES`). Add a mode here + a radio button in `index.html`.

Constraints:
- No build step, no frameworks, no dependencies. Plain scripts (not ES modules) so `index.html` also works opened from disk.
- The API key never goes anywhere but `api.openai.com`. Never commit a key.
- Test in a browser: `python3 -m http.server` then open http://localhost:8000.
