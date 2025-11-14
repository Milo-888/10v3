# Quick Start (Updated)

This guide highlights the latest improvements for running and controlling the eBook generation workflow:
- New lightweight runners for users who already have dependencies installed
- New parameters-only mode to preview and edit configuration before running any stages
- Updated web UI flow that allows reviewing and editing of parameters (including SEO queries) before starting a job

---

## Prerequisites
- Python 3.10+
- Dependencies installed (`pip install -r requirements.txt`) unless you use the end-to-end runner that creates a venv automatically
- API key(s) depending on provider (optional when using `mock`):
  - ANTHROPIC_API_KEY
  - OPENAI_API_KEY
  - GOOGLE_API_KEY or GEMINI_API_KEY
  - OPENROUTER_API_KEY
  - GROQ_API_KEY
  - CUSTOM_LLM_BASE_URL + CUSTOM_LLM_API_KEY (for custom provider)

---

## Choose a Runner

### Option A: Lightweight (no venv / no install)
Use these if you already have Python dependencies installed locally.

- Bash (macOS/Linux):
  - `bash scripts/run_no_setup.sh --topic "your topic" --provider mock`
  - `bash scripts/run_no_setup.sh --config ./my_config.yaml`
  - You can also set an explicit output directory: `--output ./output/my_run`

- PowerShell (Windows):
  - `scripts/run_no_setup.ps1 --topic "your topic" --provider anthropic --model claude-3-5-sonnet-latest`
  - `scripts/run_no_setup.ps1 --config ./my_config.yaml`

These scripts call `generate_ebook.py` directly without creating a virtual environment or installing anything.

### Option B: End-to-End (creates venv and installs deps)
If you prefer a fully automated setup:

- Bash (general): `bash scripts/run_end_to_end.sh --topic "your topic" --provider mock --auto`
- Bash (Ubuntu-optimized): `bash scripts/run_end_to_end_ubuntu.sh --topic "your topic" --provider mock --auto`
- PowerShell: `scripts/run_end_to_end.ps1 --topic "your topic" --provider openai --model gpt-4o-mini --auto`

These scripts will create a `.venv`, install dependencies, and then run the workflow.

---

## Parameters-Only Mode (Preview & Edit Before Generation)
You can now generate and review parameters only, save them to `config.yaml`, and exit without running the nine stages.

- CLI:
  - `python generate_ebook.py --topic "ai marketing" --params-only`
  - `python generate_ebook.py --config ./my_config.yaml --params-only`

- Lightweight runners:
  - `bash scripts/run_no_setup.sh --topic "ai marketing" --params-only`
  - `scripts/run_no_setup.ps1 --topic "ai marketing" --params-only`

Behavior:
1) Generate parameters (from `--topic` or load from `--config`).
2) Review and edit interactively (unless `--auto` is provided).
3) Save to `./output/config.yaml` (or your `--output` directory).
4) Exit without running stages.

To proceed with full generation later, run any standard command without `--params-only`.

---

## Web UI: Review & Edit Parameters Before Starting
The Create page now lets you:
- Enter a topic and click "Generate with AI" to auto-fill parameters.
- Edit all fields, including SEO queries (add, edit, remove).
- Click "Review Parameters" to switch to a confirmation step.
- Click "Confirm & Start Generation" to start the job.

This ensures you can view and modify everything before any generation begins.

---

## Common Examples
- Minimal mock run (no API keys needed):
  - `bash scripts/run_no_setup.sh --topic "weight loss for beginners" --provider mock`

- Anthropic with explicit model:
  - `ANTHROPIC_API_KEY=... bash scripts/run_no_setup.sh --topic "sleep optimization" --provider anthropic --model claude-3-5-sonnet-latest`

- Edit-only flow, then stop:
  - `python generate_ebook.py --topic "ai marketing" --params-only`

- Full end-to-end with venv:
  - `bash scripts/run_end_to_end.sh --topic "habit building" --provider openai --model gpt-4o-mini --auto`

---

## Troubleshooting
- "Python 3 is required": Ensure Python 3.10+ is installed and available on PATH.
- Provider errors (e.g., missing API key): Export/set the required environment variables for your chosen provider.
- Parameters not editable in UI: Fixed in this update. If you still see issues, hard refresh the page or clear cache and retry.
- Output directory: Use `--output ./output/my_run` to group artifacts per run.

---

## Next Steps
- Open the generated `FINAL_EBOOK.md` and review.
- Use `stage_6_cover_prompt.txt` and `stage_8_diagram_prompts.json` as inputs for your favorite image generation tools.
- Iterate on parameters via `--params-only` until you’re satisfied, then run a full generation.
