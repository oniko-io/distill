const DEFAULT_MODEL = "gpt-5-mini";
const API = "https://api.openai.com/v1";

const $ = (id) => document.getElementById(id);
const ideaEl = $("idea");
const outputEl = $("output");
const statusEl = $("status");
const goBtn = $("go");
const settings = $("settings");
const keyEl = $("api-key");
const modelEl = $("model");

const store = {
  get(k, fallback = "") {
    try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; }
  },
  set(k, v) {
    try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k); } catch {}
  },
};

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle("error", isError);
}

function currentMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

// Restore saved state
ideaEl.value = store.get("distill.draft");
const savedMode = store.get("distill.mode");
if (MODES[savedMode]) document.querySelector(`input[name="mode"][value="${savedMode}"]`).checked = true;

ideaEl.addEventListener("input", () => store.set("distill.draft", ideaEl.value));
document.querySelectorAll('input[name="mode"]').forEach((r) =>
  r.addEventListener("change", () => store.set("distill.mode", currentMode()))
);

// Settings dialog
function openSettings() {
  keyEl.value = store.get("distill.key");
  modelEl.value = store.get("distill.model", DEFAULT_MODEL);
  settings.returnValue = "";
  settings.showModal();
  if (keyEl.value) loadModels(keyEl.value);
}

$("settings-btn").addEventListener("click", openSettings);

settings.addEventListener("close", () => {
  if (settings.returnValue !== "save") return;
  store.set("distill.key", keyEl.value.trim());
  store.set("distill.model", modelEl.value.trim() || DEFAULT_MODEL);
  setStatus("Settings saved.");
});

$("clear-key").addEventListener("click", () => {
  keyEl.value = "";
  store.set("distill.key", "");
  setStatus("API key removed from this browser.");
});

keyEl.addEventListener("change", () => keyEl.value.trim() && loadModels(keyEl.value.trim()));

// Fill the model suggestions with chat-capable models this key can use.
async function loadModels(key) {
  const note = $("model-note");
  try {
    const res = await fetch(`${API}/models`, { headers: { Authorization: `Bearer ${key}` } });
    if (!res.ok) throw new Error(await errorMessage(res));
    const { data } = await res.json();
    const skip = /audio|realtime|tts|transcribe|image|search|embedding|moderation|dall-e|whisper|instruct/;
    const ids = data
      .map((m) => m.id)
      .filter((id) => /^(gpt-|o\d|chatgpt-)/.test(id) && !skip.test(id))
      .sort();
    $("model-list").replaceChildren(...ids.map((id) => new Option(id, id)));
    note.textContent = `${ids.length} models available. Type or pick one.`;
  } catch (err) {
    note.textContent = `Could not load models: ${err.message}`;
  }
}

async function errorMessage(res) {
  let detail = "";
  try { detail = (await res.json()).error?.message ?? ""; } catch {}
  const hints = {
    401: "Invalid API key. Check it in Settings.",
    404: "Model not found. Pick another in Settings.",
    429: "Rate limit or out of credits.",
  };
  return hints[res.status] ? `${hints[res.status]} ${detail}`.trim() : detail || `HTTP ${res.status}`;
}

// Generate
async function distill() {
  if (goBtn.disabled) return;
  const idea = ideaEl.value.trim();
  if (!idea) return setStatus("Write your idea first.", true);

  const key = store.get("distill.key");
  if (!key) {
    setStatus("Add your OpenAI API key first.", true);
    return openSettings();
  }

  const mode = MODES[currentMode()];
  const model = store.get("distill.model", DEFAULT_MODEL);

  goBtn.disabled = true;
  setStatus(`Distilling with ${model}...`);
  try {
    const res = await fetch(`${API}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: mode.system },
          { role: "user", content: `Here is my idea:\n\n${idea}` },
        ],
      }),
    });
    if (!res.ok) throw new Error(await errorMessage(res));
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Empty response from model.");

    outputEl.value = text;
    $("out-title").textContent = `${mode.label} prompt`;
    $("out-panel").hidden = false;
    setStatus("Done.");
    outputEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    setStatus(err.message, true);
  } finally {
    goBtn.disabled = false;
  }
}

goBtn.addEventListener("click", distill);
ideaEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) distill();
});

$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outputEl.value);
  } catch {
    outputEl.select();
    document.execCommand("copy");
  }
  setStatus("Copied to clipboard.");
});
