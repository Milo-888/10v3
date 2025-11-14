#!/usr/bin/env bash
set -euo pipefail

# Ubuntu-specific end-to-end runner
# - Verifies python3 and venv availability
# - Creates a Python virtualenv
# - Installs dependencies
# - Runs the orchestrator
#
# Examples:
#   bash scripts/run_end_to_end_ubuntu.sh --topic "ai marketing" --provider mock --auto
#   ANTHROPIC_API_KEY=... bash scripts/run_end_to_end_ubuntu.sh --topic "sleep optimization" --provider anthropic --model claude-3-5-sonnet-latest --auto

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="${SCRIPT_DIR%/scripts}"
cd "$REPO_ROOT"

command -v python3 >/dev/null 2>&1 || { echo >&2 "python3 is required. Install with: sudo apt-get update && sudo apt-get install -y python3"; exit 1; }
if ! python3 -m venv --help >/dev/null 2>&1; then
  echo "python3-venv is required. Install with: sudo apt-get install -y python3-venv" >&2
  exit 1
fi

# Defaults
TOPIC=""
CONFIG_PATH=""
PROVIDER="mock"
MODEL=""
OUTPUT_DIR=""
AUTO_FLAG=""
API_KEY_ARG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --topic) TOPIC="$2"; shift 2 ;;
    --config) CONFIG_PATH="$2"; shift 2 ;;
    --provider) PROVIDER="$2"; shift 2 ;;
    --model) MODEL="$2"; shift 2 ;;
    --output) OUTPUT_DIR="$2"; shift 2 ;;
    --auto) AUTO_FLAG="--auto"; shift 1 ;;
    --api-key) API_KEY_ARG="--api-key $2"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed -e 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$CONFIG_PATH" && -z "$TOPIC" ]]; then
  echo "Error: --topic is required when --config is not provided" >&2
  exit 1
fi

if [[ -z "$OUTPUT_DIR" ]]; then
  TS=$(date +%Y%m%d_%H%M%S)
  SAFE_TOPIC=${TOPIC:-ebook}
  SAFE_TOPIC=${SAFE_TOPIC// /-}
  OUTPUT_DIR="./output/${SAFE_TOPIC}_${TS}"
fi

VENV_DIR=".venv"
if [[ ! -d "$VENV_DIR" ]]; then
  python3 -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

python -m pip install --upgrade pip >/dev/null
pip install -r requirements.txt

CMD=(python generate_ebook.py "--output" "$OUTPUT_DIR" "--provider" "$PROVIDER")

# Prompt for template if not provided in args
if ! printf '%s\n' "${CMD[@]}" | grep -q -- '--template'; then
  echo "Select book template:" >&2
  echo "  1) standard   - Intro 600-900, 5 chapters @ 1200, Final 600-900, Review 300-500" >&2
  echo "  2) quickstart - Intro 300-500, 3 chapters @ 800,  Final 300-500, Review 150-250" >&2
  echo "  3) deepdive   - Intro 800-1200, 8 chapters @ 2000, Final 800-1200, Review 400-700" >&2
  read -r -p "Choose (1-3) [1]: " tpl
  case "$tpl" in
    2|quickstart) CMD=("${CMD[@]}" "--template" "quickstart") ;;
    3|deepdive)   CMD=("${CMD[@]}" "--template" "deepdive") ;;
    ""|1|standard)CMD=("${CMD[@]}" "--template" "standard") ;;
    *) echo "Invalid selection. Defaulting to standard." >&2; CMD=("${CMD[@]}" "--template" "standard") ;;
  esac
fi
[[ -n "$MODEL" ]] && CMD+=("--model" "$MODEL")
[[ -n "$API_KEY_ARG" ]] && CMD+=($API_KEY_ARG)
if [[ -n "$CONFIG_PATH" ]]; then
  CMD+=("--config" "$CONFIG_PATH")
else
  CMD+=("--topic" "$TOPIC")
fi
[[ -n "$AUTO_FLAG" ]] && CMD+=("--auto")

echo "Running: ${CMD[*]}"
"${CMD[@]}"

echo
echo "========================================"
echo "✓ Completed end-to-end generation"
echo "Output directory: $OUTPUT_DIR"
[[ -f "$OUTPUT_DIR/FINAL_EBOOK.md" ]] && echo "Final eBook: $OUTPUT_DIR/FINAL_EBOOK.md"
[[ -f "$OUTPUT_DIR/generation_metadata.json" ]] && echo "Metadata:    $OUTPUT_DIR/generation_metadata.json"
echo "========================================"
