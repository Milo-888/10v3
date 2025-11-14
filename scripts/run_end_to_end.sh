#!/usr/bin/env bash
set -euo pipefail

# Simple helper to create venv, install deps, and run generate_ebook.py
# Usage examples:
#   bash scripts/run_end_to_end.sh --topic "weight loss for beginners" --provider mock --auto
#   bash scripts/run_end_to_end.sh --topic "sleep optimization" --provider anthropic --model claude-3-5-sonnet-latest --auto
#   bash scripts/run_end_to_end.sh --topic "habit building" --provider openai --model gpt-4o-mini --auto

# Parse args and pass through to python script
ARGS=("$@")

# Choose python
PY=python3
if ! command -v "$PY" >/dev/null 2>&1; then
  echo "python3 not found. Please install Python 3.10+" >&2
  exit 1
fi

# Create venv
VENV_DIR=.venv
if [ ! -d "$VENV_DIR" ]; then
  "$PY" -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR"/bin/activate

# Upgrade pip and install requirements
pip install --upgrade pip >/dev/null
if [ -f requirements.txt ]; then
  pip install -r requirements.txt
fi

# Ensure output dir exists
mkdir -p output

# Provider sanity checks
PROVIDER="mock"
for i in "${!ARGS[@]}"; do
  if [[ "${ARGS[$i]}" == "--provider" && -n "${ARGS[$((i+1))]:-}" ]]; then
    PROVIDER="${ARGS[$((i+1))]}"; break
  fi
done
case "$PROVIDER" in
  anthropic)
    : "${ANTHROPIC_API_KEY:?Set ANTHROPIC_API_KEY}" ;;
  openai)
    : "${OPENAI_API_KEY:?Set OPENAI_API_KEY}" ;;
  gemini)
    : "${GOOGLE_API_KEY:-${GEMINI_API_KEY:-}}" || { echo "Set GOOGLE_API_KEY or GEMINI_API_KEY" >&2; exit 1; } ;;
  openrouter)
    : "${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY}" ;;
  groq)
    : "${GROQ_API_KEY:?Set GROQ_API_KEY}" ;;
  custom)
    : "${CUSTOM_LLM_BASE_URL:?Set CUSTOM_LLM_BASE_URL}"
    : "${CUSTOM_LLM_API_KEY:?Set CUSTOM_LLM_API_KEY}" ;;
  *) ;;
esac

# Prompt for template if not provided
if ! printf '%s\n' "${ARGS[@]}" | grep -q -- '--template'; then
  echo "Select book template:" >&2
  echo "  1) standard   - Intro 600-900, 5 chapters @ 1200, Final 600-900, Review 300-500" >&2
  echo "  2) quickstart - Intro 300-500, 3 chapters @ 800,  Final 300-500, Review 150-250" >&2
  echo "  3) deepdive   - Intro 800-1200, 8 chapters @ 2000, Final 800-1200, Review 400-700" >&2
  read -r -p "Choose (1-3) [1]: " tpl
  case "$tpl" in
    2|quickstart) ARGS=("--template" "quickstart" "${ARGS[@]}") ;;
    3|deepdive)   ARGS=("--template" "deepdive"   "${ARGS[@]}") ;;
    ""|1|standard)ARGS=("--template" "standard"   "${ARGS[@]}") ;;
    *) echo "Invalid selection. Defaulting to standard." >&2; ARGS=("--template" "standard"   "${ARGS[@]}") ;;
  esac
fi

# Run orchestrator
exec "$PY" generate_ebook.py "${ARGS[@]}" --output ./output
