#!/usr/bin/env bash
set -euo pipefail

# Lightweight runner: assumes Python deps are already installed
# Usage examples:
#   bash scripts/run_no_setup.sh --topic "weight loss for beginners" --provider mock
#   bash scripts/run_no_setup.sh --topic "sleep optimization" --provider anthropic --model claude-3-5-sonnet-latest
#   bash scripts/run_no_setup.sh --config ./my_config.yaml
#   bash scripts/run_no_setup.sh --topic "ai marketing" --params-only  # preview/edit params then exit

ARGS=("$@")

# Choose python
PY=python3
if ! command -v "$PY" >/dev/null 2>&1; then
  PY=python
fi
if ! command -v "$PY" >/dev/null 2>&1; then
  echo "Python 3 is required. Please install Python 3.10+" >&2
  exit 1
fi

# Ensure output dir exists if provided
OUT_DIR=""
for i in "${!ARGS[@]}"; do
  if [[ "${ARGS[$i]}" == "--output" && -n "${ARGS[$((i+1))]:-}" ]]; then
    OUT_DIR="${ARGS[$((i+1))]}"; break
  fi
done
if [[ -n "$OUT_DIR" ]]; then
  mkdir -p "$OUT_DIR"
fi

# Optional provider checks (best-effort, only if explicitly set)
PROVIDER=""
for i in "${!ARGS[@]}"; do
  if [[ "${ARGS[$i]}" == "--provider" && -n "${ARGS[$((i+1))]:-}" ]]; then
    PROVIDER="${ARGS[$((i+1))]}"; break
  fi
done
case "$PROVIDER" in
  anthropic) : "${ANTHROPIC_API_KEY:?Set ANTHROPIC_API_KEY}" ;;
  openai)    : "${OPENAI_API_KEY:?Set OPENAI_API_KEY}" ;;
  gemini)    : "${GOOGLE_API_KEY:-${GEMINI_API_KEY:-}}" || { echo "Set GOOGLE_API_KEY or GEMINI_API_KEY" >&2; exit 1; } ;;
  openrouter): "${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY}" ;;
  groq)      : "${GROQ_API_KEY:?Set GROQ_API_KEY}" ;;
  custom)    : "${CUSTOM_LLM_BASE_URL:?Set CUSTOM_LLM_BASE_URL}"; : "${CUSTOM_LLM_API_KEY:?Set CUSTOM_LLM_API_KEY}" ;;
  ""|*) : ;; # skip if not provided
esac

# Run orchestrator as-is
# If no template provided, prompt user unless --params-only is set and --auto provided
if ! printf '%s\n' "${ARGS[@]}" | grep -q -- '--template'; then
  # Interactive prompt unless in full auto mode (params-only may still want a template)
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

exec "$PY" generate_ebook.py "${ARGS[@]}"
