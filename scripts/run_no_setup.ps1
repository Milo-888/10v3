Param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Args
)

$ErrorActionPreference = "Stop"

# Choose python
$py = "python"
if (-not (Get-Command $py -ErrorAction SilentlyContinue)) { $py = "python3" }
if (-not (Get-Command $py -ErrorAction SilentlyContinue)) {
  Write-Error "Python 3 is required. Please install Python 3.10+"
}

# Ensure output dir exists if provided
for ($i = 0; $i -lt $Args.Length; $i++) {
  if ($Args[$i] -eq "--output" -and ($i + 1) -lt $Args.Length) {
    $out = $Args[$i + 1]
    if (-not (Test-Path $out)) { New-Item -ItemType Directory -Path $out | Out-Null }
    break
  }
}

# Provider env checks (best-effort)
$provider = $null
for ($i = 0; $i -lt $Args.Length; $i++) {
  if ($Args[$i] -eq "--provider" -and ($i + 1) -lt $Args.Length) {
    $provider = $Args[$i + 1]
    break
  }
}
if ($provider) {
  switch ($provider) {
    "anthropic" { if (-not $env:ANTHROPIC_API_KEY) { throw "Set ANTHROPIC_API_KEY" } }
    "openai"    { if (-not $env:OPENAI_API_KEY) { throw "Set OPENAI_API_KEY" } }
    "gemini"    { if (-not $env:GOOGLE_API_KEY -and -not $env:GEMINI_API_KEY) { throw "Set GOOGLE_API_KEY or GEMINI_API_KEY" } }
    "openrouter"{ if (-not $env:OPENROUTER_API_KEY) { throw "Set OPENROUTER_API_KEY" } }
    "groq"      { if (-not $env:GROQ_API_KEY) { throw "Set GROQ_API_KEY" } }
    "custom"    { if (-not $env:CUSTOM_LLM_BASE_URL) { throw "Set CUSTOM_LLM_BASE_URL" }; if (-not $env:CUSTOM_LLM_API_KEY) { throw "Set CUSTOM_LLM_API_KEY" } }
    Default { }
  }
}

# Prompt for template if not provided
if ($Args -notcontains "--template") {
  Write-Host "Select book template:" -ForegroundColor Cyan
  Write-Host "  1) standard   - Intro 600-900, 5 chapters @ 1200, Final 600-900, Review 300-500"
  Write-Host "  2) quickstart - Intro 300-500, 3 chapters @ 800,  Final 300-500, Review 150-250"
  Write-Host "  3) deepdive   - Intro 800-1200, 8 chapters @ 2000, Final 800-1200, Review 400-700"
  $sel = Read-Host "Choose (1-3) [1]"
  switch ($sel) {
    "2" { $Args = @("--template", "quickstart") + $Args }
    "3" { $Args = @("--template", "deepdive") + $Args }
    "" { $Args = @("--template", "standard") + $Args }
    "1" { $Args = @("--template", "standard") + $Args }
    default { Write-Host "Invalid selection. Defaulting to standard." -ForegroundColor Yellow; $Args = @("--template", "standard") + $Args }
  }
}

# Run orchestrator
& $py "generate_ebook.py" @Args
