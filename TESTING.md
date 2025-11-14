# Testing & Examples Guide
## Nine-Stage Automated eBook Generation System

This guide provides testing instructions and example outputs for the automated eBook generation system.

---

## Quick Test (No API Key Required)

Test the complete workflow without an API key using the mock LLM:

```bash
# Install dependencies
pip install -r requirements.txt

# Run test generation
python generate_ebook.py --provider mock --topic "beginner yoga" --auto --output ./test_output
```

**Expected Output:**
- Configuration auto-generated from "beginner yoga"
- All 9 stages executed
- Output directory: `./test_output/`
- Final eBook: `./test_output/FINAL_EBOOK.md`

---

## Example 1: Fitness eBook (Interactive Mode)

### Command:
```bash
python generate_ebook.py
```

### User Interaction:
```
Enter your eBook topic: weight loss for beginners

[Stage 0] Auto-Generate Configuration Parameters
────────────────────────────────────────────────────────────────

Generated Configuration:

Content Parameters:
  topic                         : sustainable weight loss for busy professionals
  main_keyword                  : weight loss
  theme                         : science-backed transformation without extremes

Audience & Style:
  target_audience               : busy professionals aged 30-50 with limited time
  tone                          : empowering
  mood                          : motivational

Distribution:
  distribution_platform         : Amazon KDP
  primary_format                : Kindle

Content Structure:
  chapter_length                : 2000
  interactive_elements_included : Printable Tracker, Progress Checklist, Habit Worksheet

Would you like to modify any parameters? (y/n): n

🚀 Generate eBook with this configuration? (y/n): y

[Stage 1] SEO Query Generation
────────────────────────────────────────────────────────────────

✓ Generated 5 SEO queries

[Stage 2] eBook Outline Generation
────────────────────────────────────────────────────────────────

✓ eBook outline created

...

✓ eBook Generation Complete!
```

### Output Structure:
```
./output/
├── config.yaml                         # Final configuration used
├── FINAL_EBOOK.md                      # Complete production-ready eBook
├── stage_1_queries.txt                 # SEO queries
├── stage_2_outline.md                  # eBook outline
├── stage_3_toc.md                      # Table of contents
├── stage_4_chapter_1.md                # Raw chapter 1
├── stage_4_chapter_2.md                # Raw chapter 2
├── stage_4_chapter_3.md                # Raw chapter 3
├── stage_4_chapter_4.md                # Raw chapter 4
├── stage_4_chapter_5.md                # Raw chapter 5
├── stage_5_optimized_chapter_1.md      # Optimized chapter 1
├── stage_5_optimized_chapter_2.md      # Optimized chapter 2
├── stage_5_optimized_chapter_3.md      # Optimized chapter 3
├── stage_5_optimized_chapter_4.md      # Optimized chapter 4
├── stage_5_optimized_chapter_5.md      # Optimized chapter 5
├── stage_6_cover_prompt.txt            # DALL·E 3 prompt for cover
├── stage_7_interactive_elements.json   # Interactive element specs
├── stage_8_diagram_prompts.json        # FLUX.1 diagram prompts
├── stage_9_background_prompts.json     # Background visual prompts
└── generation_metadata.json            # Full generation metadata
```

---

## Example 2: Nutrition eBook (Direct Topic)

### Command:
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
python generate_ebook.py --provider anthropic --topic "keto diet for beginners" --auto
```

### Configuration Auto-Generated:
```yaml
topic: "ketogenic diet fundamentals for beginners"
main_keyword: "keto diet"
theme: "simplified low-carb transformation"
target_audience: "health-conscious adults 25-45 new to keto"
tone: "conversational"
mood: "supportive"
distribution_platform: "Gumroad"
primary_format: "PDF"
chapter_length: 1800
interactive_elements_included: "Printable Tracker, Guided Journal Page, Progress Checklist"
```

### eBook Outline Generated:
```markdown
📘 The Keto Reset
🔥 Transform Your Body with Simple Low-Carb Living

🎯 Core Transformation Summary
This guide demystifies the ketogenic diet for beginners, offering practical meal plans,
science-backed strategies, and sustainable approaches to low-carb living. You'll learn
how to transition smoothly into ketosis while maintaining energy and enjoying delicious food.

🧩 Chapters & Goals

Chapter 1: Understanding Ketosis
Goal: Learn how your body enters and maintains ketosis for fat burning.

Chapter 2: Keto Foods & Meal Planning
Goal: Master which foods to eat and how to plan satisfying keto meals.

Chapter 3: Navigating the First Week
Goal: Successfully transition into keto while managing common challenges.

Chapter 4: Sustaining Long-Term Success
Goal: Build habits that make keto a sustainable lifestyle, not a temporary diet.

Chapter 5: Keto Troubleshooting
Goal: Overcome plateaus and optimize your results.

Final Thoughts
Goal: Embrace keto as a flexible, enjoyable approach to health and vitality.
```

---

## Example 3: Wellness eBook with Custom Config

### Command:
```bash
# Create custom config
cat > my_config.yaml << EOF
topic: "stress management for entrepreneurs"
main_keyword: "stress relief"
theme: "evidence-based calm for high achievers"
target_audience: "entrepreneurs and startup founders aged 28-45"
tone: "authoritative"
mood: "calming"
distribution_platform: "Self-hosted"
primary_format: "Interactive PDF"
chapter_length: 2200
interactive_elements_included: "Guided Journal Page, Reflection Prompts, Habit Worksheet"
EOF

# Run with custom config
export OPENAI_API_KEY="sk-..."
python generate_ebook.py --config my_config.yaml --provider openai --model gpt-4-turbo
```

---

## Testing Checklist

### Basic Functionality
- [ ] Script runs without errors in mock mode
- [ ] Interactive mode prompts for topic correctly
- [ ] Direct topic input (`--topic`) works
- [ ] Configuration display is readable
- [ ] Parameter editing works correctly
- [ ] All 9 stages execute in sequence
- [ ] Output directory is created
- [ ] FINAL_EBOOK.md is generated

### LLM Integration
- [ ] Anthropic client initializes with valid API key
- [ ] OpenAI client initializes with valid API key
- [ ] Mock client works without API key
- [ ] Graceful fallback to mock on API error

### Configuration Generation (Stage 0)
- [ ] Generates valid YAML format
- [ ] All 11 required parameters present
- [ ] Parameters are contextually appropriate
- [ ] Tone matches target audience
- [ ] Platform and format are compatible

### Content Quality
- [ ] SEO queries are relevant to topic
- [ ] eBook outline matches topic
- [ ] Chapters are ~target length
- [ ] Tone is consistent across chapters
- [ ] Interactive elements are appropriate

### Output Files
- [ ] All stage outputs are created
- [ ] Markdown files are valid
- [ ] JSON files are parseable
- [ ] Cover prompt is actionable for DALL·E 3
- [ ] Metadata file contains all info

---

## Common Test Scenarios

### Test 1: Mock Mode (Offline Testing)
```bash
python generate_ebook.py --provider mock --topic "morning routines" --auto
```
**Purpose**: Verify workflow without API costs

### Test 2: Interactive Review
```bash
python generate_ebook.py --topic "meditation guide"
# Answer 'y' when asked to modify
# Edit target_audience
# Edit chapter_length
# Confirm generation
```
**Purpose**: Test user interaction and parameter editing

### Test 3: Config File Override
```bash
python generate_ebook.py --config config.template.yaml --provider mock --auto
```
**Purpose**: Test manual configuration workflow

### Test 4: Different LLM Providers
```bash
# Test Anthropic
python generate_ebook.py --provider anthropic --topic "test1"

# Test OpenAI
python generate_ebook.py --provider openai --topic "test2"
```
**Purpose**: Verify multi-provider support

### Test 5: Output Directory Specification
```bash
python generate_ebook.py --topic "test" --output ./custom_output --provider mock --auto
```
**Purpose**: Test custom output paths

---

## Verifying Output Quality

### Stage 1 Verification (SEO Queries)
```bash
cat ./output/stage_1_queries.txt
```
**Check for:**
- 5 queries total
- 1-4 keywords each
- Natural language
- Relevant to topic

### Stage 2 Verification (Outline)
```bash
cat ./output/stage_2_outline.md
```
**Check for:**
- Title + subtitle ≤ 12 words
- Transformation summary (3-6 sentences)
- 5 chapters with goals
- Final thoughts

### Stage 5 Verification (Final Chapters)
```bash
wc -w ./output/stage_5_optimized_chapter_*.md
```
**Check for:**
- Word count close to target (±10%)
- Consistent tone
- Call-to-action present

### Final eBook Verification
```bash
cat ./output/FINAL_EBOOK.md
```
**Check for:**
- Complete structure (title, ToC, chapters, appendix)
- Proper markdown formatting
- No placeholder text
- Professional appearance

---

## Troubleshooting Tests

### Issue: API Key Not Recognized
```bash
# Verify environment variable
echo $ANTHROPIC_API_KEY

# Try explicit key
python generate_ebook.py --api-key "your-key" --provider anthropic
```

### Issue: Mock Output Too Generic
**Expected**: Mock mode produces generic content for testing
**Solution**: Use real LLM provider for quality content

### Issue: ModuleNotFoundError
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Issue: YAML Parse Error
```bash
# Validate config file
python -c "import yaml; yaml.safe_load(open('config.yaml'))"
```

---

## Performance Benchmarks

### Expected Execution Times

| Mode | Provider | Avg Time | Cost Estimate |
|------|----------|----------|---------------|
| Mock | N/A | 2-5 seconds | $0 |
| Real | Claude Sonnet | 3-5 minutes | $0.50-$1.50 |
| Real | GPT-4 Turbo | 4-7 minutes | $1.00-$2.00 |

**Note**: Times vary based on API latency and chapter length

### Token Usage Estimates

| Stage | Approx Tokens (Input) | Approx Tokens (Output) |
|-------|----------------------|------------------------|
| Stage 0 | 500 | 200 |
| Stage 1 | 300 | 50 |
| Stage 2 | 600 | 400 |
| Stage 4 (per chapter) | 800 | 2000 |
| Stage 5 (per chapter) | 2200 | 2200 |

**Total for 5-chapter eBook**: ~15,000-25,000 tokens

---

## Example Output Snippets

### Auto-Generated Config (Stage 0)
```yaml
topic: "intermittent fasting for busy professionals"
main_keyword: "intermittent fasting"
theme: "time-efficient health transformation"
target_audience: "working professionals aged 35-55 with hectic schedules"
tone: "empowering"
mood: "motivational"
distribution_platform: "Amazon KDP"
primary_format: "Kindle"
chapter_length: 2000
interactive_elements_included: "Printable Tracker, Progress Checklist"
```

### SEO Queries (Stage 1)
```
intermittent fasting
intermittent fasting benefits
how to start intermittent fasting
intermittent fasting guide
intermittent fasting for weight loss
```

### Cover Prompt (Stage 6)
```
Ultra-realistic, cinematic eBook cover depicting the transformation journey of intermittent
fasting through visual metaphors: a split-screen sunrise representing the fasting/eating
windows, glowing energy arcs symbolizing metabolic renewal, soft warm gradients suggesting
health vitality, A4 portrait format, emotionally immersive and aspirational, high-resolution.
```

### Interactive Element (Stage 7)
```json
{
  "chapter": 1,
  "title": "Your 7-Day Fasting Success Tracker",
  "type": "Printable Tracker",
  "description": "Track your fasting windows, energy levels, and hunger signals for the first week"
}
```

---

## Next Steps After Testing

1. ✅ Verify all tests pass
2. ✅ Review sample output quality
3. ✅ Test with real LLM provider
4. ✅ Generate actual eBook for your niche
5. ✅ Use visual prompts to create images
6. ✅ Format final eBook for distribution platform
7. ✅ Publish and iterate!

---

**Testing Support**: For issues or questions, refer to README.md or open an issue.

**Version**: 2.0
**Last Updated**: 2025-11-14
