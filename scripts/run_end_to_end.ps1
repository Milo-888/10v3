Param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

$ErrorActionPreference = "Stop"

# Ensure Python
$py = "python"
if (-not (Get-Command $py -ErrorAction SilentlyContinue)) {
  $py = "python3"
}
if (-not (Get-Command $py -ErrorAction SilentlyContinue)) {
  Write-Error "Python 3 is required. Please install Python 3.10+"
}

# Create venv if missing
$venvPath = ".venv"
if (-not (Test-Path $venvPath)) {
  & $py -m venv $venvPath
}
# Activate venv
$activate = Join-Path $venvPath "Scripts/Activate.ps1"
. $activate

# Upgrade pip and install requirements
python -m pip install --upgrade pip | Out-Null
if (Test-Path "requirements.txt") {
  python -m pip install -r requirements.txt | Out-Null
}

# Ensure output dir exists
if (-not (Test-Path "output")) { New-Item -ItemType Directory -Path "output" | Out-Null }

# Determine provider from args (default mock)
$provider = "mock"
for ($i = 0; $i -lt $Args.Length; $i++) {
  if ($Args[$i] -eq "--provider" -and ($i + 1) -lt $Args.Length) {
    $provider = $Args[$i + 1]
    break
  }
}

# Provider env checks
switch ($provider) {
  "anthropic" {
    if (-not $env:ANTHROPIC_API_KEY) { throw "Set ANTHROPIC_API_KEY" }
  }
  "openai" {
    if (-not $env:OPENAI_API_KEY) { throw "Set OPENAI_API_KEY" }
  }
  "gemini" {
    if (-not $env:GOOGLE_API_KEY -and -not $env:GEMINI_API_KEY) { throw "Set GOOGLE_API_KEY or GEMINI_API_KEY" }
  }
  "openrouter" {
    if (-not $env:OPENROUTER_API_KEY) { throw "Set OPENROUTER_API_KEY" }
  }
  "groq" {
    if (-not $env:GROQ_API_KEY) { throw "Set GROQ_API_KEY" }
  }
  "custom" {
    if (-not $env:CUSTOM_LLM_BASE_URL) { throw "Set CUSTOM_LLM_BASE_URL" }
    if (-not $env:CUSTOM_LLM_API_KEY) { throw "Set CUSTOM_LLM_API_KEY" }
  }
  Default { }
}

# Run orchestrator
& $py "generate_ebook.py" @Args --output ./output
