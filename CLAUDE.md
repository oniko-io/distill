# distill

Static web app: user types a rough idea → OpenAI API rewrites it into a prompt for Claude Code or a general AI chat. Live at https://oniko-io.github.io/distill/ (GitHub Pages from `main`, repo root; every push to `main` deploys).

- `index.html`, `style.css`: UI. Colors are CSS variables on `:root` with a dark-mode override. Touch-screen tweaks live in the media queries at the end of `style.css`.
- `app.js`: settings (API key + model in localStorage), OpenAI Chat Completions call, clear and copy buttons.
- `prompts.js`: system prompt per output mode (`MODES`). Add a mode here + a radio button in `index.html`. Tuned on `gpt-5.5` (the default): output should stay faithful and short, with nothing the user didn't ask for. `gpt-5-mini` pads prompts with invented requirements; `gpt-5.4-mini` is too terse.
- `tools/try-prompts.js`: dev-only Node script. Runs sample ideas through `prompts.js` with a real key from `~/.config/distill/openai-key` and writes results to `tools/out/` (git-ignored). Run it after any prompt change and read the outputs.
- `manifest.webmanifest`, `icons/`: Add to Home Screen support. `icons/icon.svg` is the source; the PNGs are rendered from it (the maskable/apple icons use a padded, square version of the same drop).

Constraints:
- No build step, no frameworks, no dependencies. Plain scripts (not ES modules) so `index.html` also works opened from disk.
- The API key never goes anywhere but `api.openai.com`. Never commit a key. The repo is public.
- Mostly used on a phone: keep inputs at 16px or larger (iOS zooms otherwise), tap targets at least 44px, no horizontal scroll at 375px.
- Test in a browser: `python3 -m http.server` then open http://localhost:8000. Check a phone viewport too.
