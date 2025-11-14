# Quick Start

This is the canonical, up-to-date Quick Start for the Nine‑Stage Automated eBook Generation System. It replaces and supersedes any prior quick start files.

What’s new in this version
- Lightweight runners: run without creating a venv/installing deps if you already have them
- Templates: choose one of three book templates before parameter generation (standard/quickstart/deepdive)
- Parameters-only mode: preview and edit parameters, save config, and exit (no generation)
- Live streaming output: watch the LLM generate content in your terminal in real time
- Web UI improvements: review parameters and edit SEO queries before starting

Prerequisites
- Python 3.10+
- Node 18+ (for the web UI)
- API keys (only if using real providers; mock requires none):
  - ANTHROPIC_API_KEY (Anthropic)
  - OPENAI_API_KEY (OpenAI/OpenRouter-compatible)
  - GOOGLE_API_KEY or GEMINI_API_KEY (Gemini)
  - OPENROUTER_API_KEY (OpenRouter)
  - GROQ_API_KEY (Groq)
  - CUSTOM_LLM_BASE_URL and CUSTOM_LLM_API_KEY (Custom provider)

Recommended: Work inside your Linux home in WSL
- Copy the repo from /mnt/c/... into your Linux home for better performance and fewer permission issues:
  - cp -r /mnt/c/path/to/repo ~/repo && cd ~/repo

Install and run options

Option A: End‑to‑end (Ubuntu, auto‑venv)
- If apt update is broken due to Docker key conflict, see Troubleshooting below first.
- bash scripts/run_end_to_end_ubuntu.sh --topic "your topic" --provider mock --auto
- This will:
  - Create a venv
  - Install Python deps
  - Prompt you to choose a template (unless --template is supplied)
  - Run the full workflow

Option B: End‑to‑end (cross‑platform)
- Bash (macOS/Linux): bash scripts/run_end_to_end.sh --topic "your topic" --provider mock --auto
- PowerShell (Windows): scripts/run_end_to_end.ps1 --topic "your topic" --provider openai --model gpt-4o-mini --auto
- These create a venv, install deps, prompt for a template, and run the workflow.

Option C: Manual venv + install
- python3 -m venv .venv
- source .venv/bin/activate  # Windows PowerShell: .\.venv\Scripts\Activate.ps1
- python -m pip install --upgrade pip
- pip install -r requirements.txt
- Run with template prompt:
  - bash scripts/run_no_setup.sh --topic "your topic" --provider mock
  - Or explicitly pass: --template standard|quickstart|deepdive

Option D: No‑setup runners (use if deps already installed)
- Bash: bash scripts/run_no_setup.sh --topic "your topic" --provider mock
- PowerShell: scripts/run_no_setup.ps1 --topic "your topic" --provider anthropic --model claude-3-5-sonnet-latest
- Both prompt for a template if not supplied.

Templates
- standard (default)
  - Intro: 600–900 words
  - Chapters: 5 @ 1200 words
  - Final thoughts: 600–900 words
  - Leave a review: 300–500 words
- quickstart
  - Intro: 300–500 words
  - Chapters: 3 @ 800 words
  - Final thoughts: 300–500 words
  - Leave a review: 150–250 words
- deepdive
  - Intro: 800–1200 words
  - Chapters: 8 @ 2000 words
  - Final thoughts: 800–1200 words
  - Leave a review: 400–700 words

Parameters‑only mode (no generation)
- Use this to preview/edit parameters and save config.yaml without running stages.
- CLI:
  - python generate_ebook.py --topic "your topic" --params-only [--template standard]
- Lightweight runners:
  - bash scripts/run_no_setup.sh --topic "your topic" --params-only
  - scripts/run_no_setup.ps1 --topic "your topic" --params-only
- Behavior:
  1) Generates parameters (or loads from --config)
  2) Prompts for template if not provided (interactive mode)
  3) Lets you review/edit (unless --auto)
  4) Saves config to output/config.yaml
  5) Exits without running stages

Web UI (review before running)
- npm install
- npm run dev
- Open http://localhost:5173/
- Create page flow:
  - Enter a topic and click "Generate with AI" (optional)
  - Edit form fields and SEO queries (add, remove, inline edit)
  - Click "Review Parameters" to confirm
  - Click "Confirm & Start Generation" to begin

Live terminal streaming
- The backend streams LLM output in real time for:
  - Stage 1 (SEO queries)
  - Stage 2 (Outline)
  - Stage 4 (Chapters)
  - Final compilation sections (Introduction, Final Thoughts, Review) per template
- If a provider doesn’t support streaming, generation will fall back to non‑streamed output.

Chapter parsing correctness
- Only top‑level lines matching “Chapter N – Title” are used as chapters.
- Subsections (like 1.1, 2.3) and front matter are not treated as chapters.
- The TOC is built from these top‑level chapter titles.

Common examples
- Minimal mock run (no API keys):
  - bash scripts/run_no_setup.sh --topic "quick smoke" --provider mock --template standard --auto
- Anthropic with streaming:
  - export ANTHROPIC_API_KEY=...
  - bash scripts/run_no_setup.sh --topic "streaming demo" --provider anthropic --model claude-3-5-sonnet-latest --auto
- Edit‑only (save config and exit):
  - python generate_ebook.py --topic "ai marketing" --params-only --template quickstart
- End‑to‑end with venv:
  - bash scripts/run_end_to_end.sh --topic "habit building" --provider openai --model gpt-4o-mini --auto

Troubleshooting
- PEP 668 (externally managed environment) when pip install -r requirements.txt:
  - Create a venv:
    - sudo apt install -y python3-venv  # if needed
    - python3 -m venv .venv
    - source .venv/bin/activate
    - python -m pip install --upgrade pip
    - pip install -r requirements.txt
  - Or use the end‑to‑end runner which creates a venv for you.
- apt update fails due to Docker Signed‑By conflict:
  - Temporary disable Docker source:
    - sudo mv /etc/apt/sources.list.d/docker.list /etc/apt/sources.list.d/docker.list.disabled
    - sudo apt update
  - Proper fix:
    - sudo install -m 0755 -d /etc/apt/keyrings
    - curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    - sudo chmod a+r /etc/apt/keyrings/docker.gpg
    - echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    - sudo rm -f /etc/apt/keyrings/docker.asc
    - sudo apt update
- WSL performance/permissions:
  - Work inside your Linux home: cp -r /mnt/c/your/path ~/yourdir && cd ~/yourdir

Output artifacts
- FINAL_EBOOK.md
- stage_1_queries.txt, stage_2_outline.md, stage_3_toc.md
- stage_4_chapter_*.md, stage_5_optimized_chapter_*.md
- stage_6_cover_prompt.txt, stage_7_interactive_elements.json
- stage_8_diagram_prompts.json, stage_9_background_prompts.json
- generation_metadata.json

Next steps
- Review FINAL_EBOOK.md and iterate via --params-only until satisfied
- Generate visuals from stage_6 and stage_8 prompts
- Publish to your distribution platform of choice
