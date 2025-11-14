# Nine-Stage Automated eBook Generation System

> **🚀 NEW: Fully Automated Workflow** - Generate production-ready eBooks from a single topic input! Just run `python generate_ebook.py` and follow the prompts.

## Table of Contents
- [Quick Start (Automated Workflow)](#quick-start-automated-workflow)
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Configuration Parameters](#configuration-parameters)
- [Workflow & Data Flow](#workflow--data-flow)
- [Implementation Guide](#implementation-guide)
- [Prompt Specifications](#prompt-specifications)

---

## Quick Start

- Already have Python deps installed? Use the lightweight runner (no venv/no install):
  - bash scripts/run_no_setup.sh --topic "your topic" --provider mock
  - bash scripts/run_no_setup.sh --config ./my_config.yaml
  - Add --params-only to preview and edit parameters without running full generation (see CLI section).
 (Automated Workflow)

**Generate a complete eBook in 3 simple steps:**

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run the Generator
```bash
# Interactive mode (recommended for first time)
python generate_ebook.py

# Or provide topic directly
python generate_ebook.py --topic "weight loss for beginners"

# With real LLM (requires API key)
export ANTHROPIC_API_KEY="your-key-here"
python generate_ebook.py --provider anthropic
```

### Step 3: Review and Confirm
The system will:
1. **Auto-generate** all configuration parameters from your topic
2. **Display** the configuration for your review
3. **Allow modifications** to any parameter
4. **Execute** all 9 stages automatically
5. **Produce** a complete, production-ready eBook

**Output includes:**
- ✅ Complete eBook in Markdown format (`FINAL_EBOOK.md`)
- ✅ Cover design prompt for DALL·E 3
- ✅ Diagram prompts for FLUX.1
- ✅ Interactive element specifications
- ✅ All intermediate stage outputs for review

### Usage Examples

```bash
# Test run with mock LLM (no API key needed)
python generate_ebook.py --topic "beginner yoga" --auto

# Production run with Claude
python generate_ebook.py --provider anthropic --topic "keto diet"

# Production run with GPT-4
python generate_ebook.py --provider openai --model gpt-4-turbo

# Use existing config file
python generate_ebook.py --config my_config.yaml --provider anthropic
```

---

## Overview

This document specifies a production-ready, **10-stage** automated content generation pipeline for creating high-quality eBooks in the health, wellness, and fitness niche. The system uses a modular, persona-driven architecture where each stage performs a specialized task with expert-level output quality.

**NEW**: Stage 0 automatically generates all configuration parameters from a single topic input, eliminating manual configuration.

### Key Features
- **Modular Design**: Each stage can be updated independently without disrupting the pipeline
- **Persona-Driven Quality**: Every stage uses expert personas for domain-specific output
- **Embedded Validation**: Business logic and validation rules built into prompts
- **Multi-Modal Output**: Orchestrates both text generation (LLMs) and image generation (text-to-image models)
- **Separation of Concerns**: Strict boundaries between text and visual content generation

---

## System Architecture

### Workflow Stages

```
USER INPUT: "weight loss for beginners"
         ↓
Stage 0: Auto-Configuration → Generates ALL parameters from topic (NEW!)
         ↓
Stage 1: SEO Query Generation → Generates 5 high-demand search queries
         ↓
Stage 2: eBook Outline → Creates structure with title, chapters, transformation summary
         ↓
Stage 3: Table of Contents → Extracts chapter titles and motivating subtitles
         ↓
Stage 4: Chapter Content → Writes full chapter content (~2000 words per chapter)
         ↓
Stage 5: Content Optimization → Audits and improves content for clarity and engagement
         ↓
Stage 6: eBook Cover Design → Generates DALL·E 3 prompt for cover visual
         ↓
Stage 7: Interactive Elements → Creates fitness trackers, worksheets, checklists
         ↓
Stage 8: Diagram Generation → Creates FLUX.1 prompts for educational diagrams
         ↓
Stage 9: Background Visuals → Generates fitness-themed background imagery
         ↓
OUTPUT: Production-Ready eBook + Visual Prompts + Interactive Elements
```

---

## Configuration Parameters

### Required Global Parameters

These parameters must be configured before running the pipeline:

```yaml
# CONTENT PARAMETERS
topic: "INSERT_TOPIC_HERE"
  # Example: "weight loss", "muscle building", "nutrition planning"
  # Description: Primary subject matter for the eBook

main_keyword: "INSERT_MAIN_KEYWORD_HERE"
  # Example: "intermittent fasting", "strength training", "keto diet"
  # Description: Primary SEO keyword to target

theme: "INSERT_THEME_HERE"
  # Example: "sustainable transformation", "science-backed fitness", "beginner-friendly wellness"
  # Description: Overarching theme that ties the content together

# AUDIENCE & STYLE PARAMETERS
target_audience: "INSERT_TARGET_AUDIENCE_HERE"
  # Example: "busy professionals aged 30-45", "fitness beginners", "women over 40"
  # Description: Specific demographic and psychographic profile

tone: "INSERT_TONE_HERE"
  # Example: "empowering", "conversational", "authoritative", "inspiring"
  # Description: Voice and attitude of the content

mood: "INSERT_MOOD_HERE"
  # Example: "motivational", "calming", "energetic", "supportive"
  # Description: Emotional atmosphere of the content

# DISTRIBUTION PARAMETERS
distribution_platform: "INSERT_PLATFORM_HERE"
  # Example: "Amazon KDP", "Gumroad", "Etsy", "Self-hosted"
  # Description: Where the eBook will be sold/distributed

primary_format: "INSERT_FORMAT_HERE"
  # Example: "PDF", "EPUB", "Kindle", "Interactive PDF"
  # Description: Technical format for final delivery

# CONTENT STRUCTURE PARAMETERS
chapter_length: INSERT_WORD_COUNT_HERE
  # Example: 1500, 2000, 2500
  # Description: Target word count per chapter (recommended: 1500-2500)

interactive_elements_included: "INSERT_ELEMENT_TYPES_HERE"
  # Example: "Printable Trackers, Guided Journal Pages, Progress Checklists, Habit Worksheets"
  # Description: Types of interactive elements to include per chapter

# SEARCH EVIDENCE MINIMUM
min_search_results: 12000000
  # Default: 12 million
  # Description: Minimum Google search results required for query validation
```

### Internal Pipeline Variables

These variables are automatically populated by the pipeline as data flows between stages:

```yaml
# Stage 1 Output → Stage 2 Input
text: "AUTO_POPULATED_FROM_STAGE_1"
  # Contains: 5 SEO queries generated from Stage 1

# Stage 2 Output → Stage 3 Input
result: "AUTO_POPULATED_FROM_STAGE_2"
  # Contains: Full eBook outline with chapters and goals

# Stage 4+ Input Variables
name: "AUTO_POPULATED_CHAPTER_TITLE"
  # Contains: Current chapter title being processed

i: "AUTO_POPULATED_CHAPTER_CONTENT"
  # Contains: Current chapter content for visual/diagram generation
```

---

## Workflow & Data Flow

### Data Dependencies Between Stages

| Stage | Input Required | Output Produced | Used By |
|-------|---------------|-----------------|---------|
| **Stage 0** | **topic (user input)** | **Complete config YAML** | **Stage 1-9** |
| Stage 1 | Global config parameters | 5 SEO queries (text) | Stage 2 |
| Stage 2 | text (queries), global config | eBook outline (result) | Stage 3 |
| Stage 3 | result (outline) | Table of Contents | Documentation |
| Stage 4 | name, text, global config | Chapter content | Stage 5, 6, 7, 8, 9 |
| Stage 5 | text (chapter content) | Optimized chapter | Final eBook |
| Stage 6 | name, i (chapter content) | DALL·E 3 cover prompt | Image generation |
| Stage 7 | name, i (chapter content) | Interactive element specs | Asset creation |
| Stage 8 | i (chapter content) | FLUX.1 diagram prompt | Image generation |
| Stage 9 | name, i (chapter content) | Background visual prompt | Image generation |

### Execution Order

**Configuration Stage** (optional - automated):
- **Stage 0**: Auto-generate config from topic (NEW!)

**Sequential Stages** (must run in order):
- Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5

**Parallel Stages** (can run simultaneously after Stage 4):
- Stage 6, 7, 8, 9 (all use Stage 4 output)

---

## Implementation Guide

### Prerequisites

1. **Python 3.8+**: Ensure Python is installed
2. **LLM API Access** (for production use):
   - **Anthropic Claude** (recommended): Set `ANTHROPIC_API_KEY` environment variable
   - **OpenAI GPT-4** (alternative): Set `OPENAI_API_KEY` environment variable
   - **Mock mode** (testing): No API key required
3. **Image Generation API** (optional, for final image generation):
   - DALL·E 3 for cover design (Stage 6)
   - FLUX.1-schnell for diagrams and backgrounds (Stages 8-9)

### Setup Steps

**Option A: Fully Automated Workflow (Recommended)**

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set API Key** (optional - skip for testing with mock LLM)
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   # OR
   export OPENAI_API_KEY="your-api-key-here"
   ```

3. **Run Generator**
   ```bash
   # Interactive mode (prompts for topic)
   python generate_ebook.py

   # Direct topic input
   python generate_ebook.py --topic "your eBook topic"

   # With specific provider
   python generate_ebook.py --provider anthropic --topic "keto diet"

   # Test mode (no API key needed)
   python generate_ebook.py --provider mock --topic "yoga for beginners" --auto
   ```

4. **Review Output**
   - Check `./output/FINAL_EBOOK.md` for your complete eBook
   - Use `./output/stage_6_cover_prompt.txt` to generate cover with DALL·E 3
   - Use JSON files for diagram and interactive element specs

**Option B: Manual Configuration Workflow**

1. **Configure Parameters**
   ```bash
   # Create config.yaml with all required parameters
   cp config.template.yaml config.yaml
   # Edit config.yaml with your specific values
   ```

2. **Execute with Config File**
   ```bash
   python generate_ebook.py --config config.yaml --provider anthropic
   ```

3. **Review & Iterate**
   - Review generated queries (Stage 1)
   - Approve outline (Stage 2)
   - Review optimized chapters (Stage 5)
   - Generate images from prompts (Stages 6, 8, 9)

### Validation Checkpoints

- **After Stage 1**: Verify queries meet 12M+ search result threshold
- **After Stage 2**: Confirm outline matches target audience and transformation goals
- **After Stage 4**: Ensure chapter length meets target (~{{chapter_length}} words)
- **After Stage 5**: Final quality check for clarity, tone, and engagement
- **After Stages 6-9**: Verify visual prompts accurately represent content themes

---

## Prompt Specifications

### Stage 0: Auto-Configuration Generation (NEW!)

Tip: You can run parameter generation only (to preview and edit before generation) using either:
- CLI: python generate_ebook.py --topic "..." --params-only
- Script: bash scripts/run_no_setup.sh --topic "..." --params-only

**Persona**: Expert eBook Strategist and Market Analyst

**Input Parameters**:
- `topic` (single user input - e.g., "weight loss for beginners")

**Output**: Complete configuration YAML with all 11 parameters

**Generated Parameters**:
- ✅ Refined topic (market-optimized)
- ✅ Main keyword (12M+ search volume)
- ✅ Theme (audience-aligned)
- ✅ Target audience (specific demographic)
- ✅ Tone (emotional alignment)
- ✅ Mood (atmospheric setting)
- ✅ Distribution platform (best fit)
- ✅ Primary format (platform-compatible)
- ✅ Chapter length (topic-appropriate)
- ✅ Interactive elements (engagement-optimized)

**Prompt**:

```
You are an expert eBook strategist and market analyst. Your task is to analyze a topic and generate optimal configuration parameters for an automated eBook generation system.

Given Topic: {topic}

Analyze this topic and generate the following parameters in valid YAML format. Be strategic, market-aware, and ensure all parameters work cohesively together.

Required Output Format (YAML only, no explanations):

```yaml
topic: "[refined topic optimized for market demand]"
main_keyword: "[primary SEO keyword with 12M+ search volume]"
theme: "[overarching theme/approach]"
target_audience: "[specific demographic and psychographic profile]"
tone: "[empowering/conversational/authoritative/inspiring/supportive/motivational]"
mood: "[motivational/calming/energetic/supportive/uplifting/confident]"
distribution_platform: "[Amazon KDP/Gumroad/Etsy/Self-hosted]"
primary_format: "[PDF/EPUB/Kindle/Interactive PDF]"
chapter_length: [1500-2500 word count as integer]
interactive_elements_included: "[comma-separated list of: Printable Tracker, Guided Journal Page, Progress Checklist, Habit Worksheet, Milestone Calendar]"
```

Instructions:
1. Refine the topic to be more market-focused and specific
2. Choose a main_keyword with proven search demand (12M+ results)
3. Select a theme that resonates with target audience pain points
4. Define target_audience with specific age range, lifestyle, and challenges
5. Choose tone and mood that match the audience's emotional needs
6. Recommend the best distribution_platform based on topic and audience
7. Select primary_format compatible with chosen platform
8. Set chapter_length appropriate for topic depth (recommend 2000 for balance)
9. Choose 2-3 interactive_elements that enhance engagement

Output only the YAML block. No additional commentary.
```

**Implementation**: This stage is automatically executed when using `generate_ebook.py --topic "your topic"`

---

### Stage 1: SEO Query Generation

**Persona**: Elite SEO Strategist and Trend Analyst

**Input Parameters**:
- `topic`
- `tone`
- `mood`
- `theme`
- `main_keyword`
- `target_audience`

**Output**: 5 high-demand search queries (1-4 keywords each)

**Validation Rules**:
- ✅ Each query must yield minimum 12M Google search results
- ✅ Broad appeal, clear commercial/informational intent
- ✅ No brand names, dates, or special characters
- ✅ Natural language as users would type

**Prompt**:

```
You are an elite SEO strategist and trend analyst specializing in high-demand, commercially viable topics within the health, wellness, and fitness niche. Your primary function is to generate short, realistic, and high-volume search queries that reflect exactly what users are actively searching for on platforms like Google, YouTube, and Reddit in 2025.

🎯 Rules for Query Generation:
• Output exactly one natural-language query per line.
• Queries must be concise, containing 1 to 4 keywords only.
• Avoid niche, long-tail, or overly specific terms.
• Do not include special characters, dates, or brand names.
• Ensure each query will reliably yield a minimum of 12 million Google search results (total_results > 12M).
• Prioritize topics with broad appeal and clear informational or commercial intent ideal for eBooks, courses, or video content creation.
• Output queries exactly as users would type them into search bars (no explanations or additional formatting).

Respond only with finalized search queries, clearly separated by new lines.

Your task is to provide exactly 5 high-demand, natural-language search queries suitable for scraping and content ideation within the following scope. Each query must be phrased exactly as users would naturally type it and must adhere to all rules defined above.

Input Parameters:
● Topic: {{topic}}
● Tone: {{tone}}
● Mood: {{mood}}
● Theme: {{theme}}
● Main Keyword: {{main_keyword}}
● Target Audience: {{target_audience}}

List only the 5 queries clearly, each separated by a new line, without explanations or extra text.
```

---

### Stage 2: eBook Outline Generation

**Persona**: Elite Nonfiction eBook Strategist, SEO Copywriter, and Transformational Content Architect

**Input Parameters**:
- `target_audience`
- `primary_format`
- `distribution_platform`
- `mood`
- `topic`
- `theme`
- `text` (SEO queries from Stage 1)

**Output**: Complete eBook outline with title, subtitle, transformation summary, and 5 chapters + final thoughts

**Validation Rules**:
- ✅ Title + subtitle ≤ 12 words
- ✅ Focus on emotional transformation and results
- ✅ Each chapter has clear goal statement
- ✅ Markdown format only

**Prompt**:

```
You are an elite nonfiction eBook strategist, SEO copywriter, and transformational content architect. Your task is to generate a high-converting, emotionally resonant eBook outline based on trend search data — tailored for distribution on {{distribution_platform}}.

🎯 Your output must follow this exact markdown structure:

📘 Title
🔥 Subtitle
[Complete the pitch: total title + subtitle must be ≤ 12 words. Focus on the result or emotional transformation.]

🎯 Core Transformation Summary
[3–6 sentences describing the transformation the reader will experience. Highlight pain relief, emotional resonance, and what makes this book different.]

🧩 Chapters & Goals

Chapter 1: [Title]
Goal: [One sentence — what will the reader understand or achieve?]

Chapter 2: [Title]
Goal: [One sentence — what will the reader understand or achieve?]

Chapter 3: [Title]
Goal: [One sentence — what will the reader understand or achieve?]

Chapter 4: [Title]
Goal: [One sentence — what will the reader understand or achieve?]

Chapter 5: [Title]
Goal: [One sentence — what will the reader understand or achieve?]

Final Thoughts
Goal: [A single motivational sentence that reinforces belief, hope, or action.]

📘 Output Rules:
• Format: Markdown only
• Tone: Empowering, motivational, research-backed
• Style: Clear, emotionally engaging, outcome-focused
• Must reflect market demand and a clear product-market fit

📌 Variables to integrate:
• Audience: {{target_audience}}
• Format: {{primary_format}} for {{distribution_platform}}
• Mood: {{mood}}
• Topic: {{topic}}
• Theme: {{theme}}

❌ Do not include explanations, commentary, or additional headers. Only output the formatted markdown as shown.

Your task is to analyze the following trend search data and generate a single, high-converting eBook outline using the required format.

Search Evidence Block:
{{text}}

Instructions:
1. Analyze the trend data to identify the dominant pain point, transformation, and emotional pull driving search demand.
2. Extract a focused angle with the highest potential for reader desire and SEO alignment.
3. Write a complete eBook outline using the precise structure provided above, prioritizing clarity, empathy, and urgency.
4. Reflect SEO keyword intent in the title and chapters.
5. Emphasize actionable transformation, not generic education.
6. Use emotionally resonant phrasing that builds trust and authority.

This outline should read like a bestselling eBook blueprint for Amazon KDP, Etsy, or Gumroad — emotionally charged, trend-validated, and conversion-ready.

Do not include any additional commentary or markdown outside the required structure.
```

---

### Stage 3: Table of Contents Generation

**Persona**: Elite eBook Architect

**Input Parameters**:
- `result` (eBook outline from Stage 2)

**Output**: Clean, formatted Table of Contents

**Format Requirements**:
- ✅ Chapter titles: 1-5 words
- ✅ Subtitles: 1 sentence (transformational promise)
- ✅ Action-driven, energetic language

**Prompt**:

```
You are an elite eBook architect specializing in fitness, wellness, and professional development content. Your task is to transform structured eBook drafts into clean, motivating Table of Contents formats that balance clarity, engagement, and professionalism.

Focus on extracting the core idea of each chapter and condensing it into a short title (1–5 words) and a clear, inspiring subtitle (1 sentence).

Keep titles short, energetic, and action-driven. Write subtitles to express the transformational promise or practical outcome.

Based on the following eBook draft content, generate a Table of Contents following this exact structure. Do not add extra commentary. Only the clean formatted output is required.

eBook Draft Content:
{{result}}

Required Output Format:

Table of Contents

Chapter 1: [Title (1–5 words)]
[Subtitle (1 sentence)]

Chapter 2: [Title (1–5 words)]
[Subtitle (1 sentence)]

Chapter 3: [Title (1–5 words)]
[Subtitle (1 sentence)]

Chapter 4: [Title (1–5 words)]
[Subtitle (1 sentence)]

Chapter 5: [Title (1–5 words)]
[Subtitle (1 sentence)]

Final Thoughts
[1-2 sentences concluding the ebook]

Bonus Section + Downloadable PDFs

Follow the formatting exactly, with no extra text or introductions. Focus on clarity, momentum, and emotional motivation appropriate for fitness and wellness audiences.
```

---

### Stage 4: Chapter Content Writing

**Persona**: Elite Nonfiction Writer, Wellness Strategist, and Fitness Behavior Expert

**Input Parameters**:
- `name` (chapter title)
- `target_audience`
- `tone`
- `mood`
- `theme`
- `main_keyword`
- `chapter_length`
- `interactive_elements_included`
- `distribution_platform`
- `primary_format`
- `text` (search evidence)

**Output**: Full chapter content (~{{chapter_length}} words)

**Structure Requirements**:
1. 🎯 Why This Matters (4 sentences)
2. 🔬 The Strategy (high-level approach)
3. 🧠 Core Content (5 subheaders with 1-3 paragraphs each)
4. ✅ Action Steps (4 tactical steps)
5. 🔁 Habit Reminder (1 sentence)
6. Motivational Quote (1 sentence)

**Content Features**:
- ✅ Checklists, pro tips, mental models
- ✅ 1-2 interactive elements embedded
- ✅ No image placeholders
- ✅ Flow-optimized, highly readable

**Prompt**:

```
You are an elite nonfiction writer, wellness strategist, and fitness behavior expert. Your role is to generate a high-converting, emotionally resonant, and science-backed chapter section for a bestselling health eBook.

Your writing style is modern, inspiring, grounded in research, and easy to follow. Speak directly to the reader. Sound like a coach who understands them deeply.

Your task is to write the full chapter content using the style and structure outlined below.

Chapter Specifications:
● Chapter Title: {{name}}
● Target Audience: {{target_audience}}
● Tone: {{tone}}
● Mood: {{mood}}
● Theme: {{theme}}
● Main Keyword: {{main_keyword}}
● Target Length: ~{{chapter_length}} words
● Interactive Elements to Include: {{interactive_elements_included}}
● Distribution Platform: {{distribution_platform}}
● Primary Format: {{primary_format}}
● Search Evidence for Context: {{text}}

Required Format (Markdown Only):

1. 🎯 Why This Matters
Open with 4 sentences explaining why this topic is critical to the reader's transformation. Use emotional framing, myth-busting, or a relatable pain point.

2. 🔬 The Strategy
Clearly outline the solution or approach. Use bold structure, checklists, and subheadings. Keep this high-level — what's the big-picture game plan?

3. 🧠 Core Content Sections
Create 5 bold subheaders with 1–3 short paragraphs under each.

Break up content with:
• ✅ Checklists
• 💡 Pro tips
• 🧠 Mental models or cues
• 🪜 Mini frameworks
• 🔁 Routine builders

Avoid long blocks. Prioritize flow, value, and readability.

Incorporate 1-2 interactive elements from the list provided in the specifications.

4. ✅ Action Steps
List 4 tactical, behavior-driven steps the reader can take right now. Make them specific, doable, and habit-forming.

5. 🔁 Habit Reminder (1 sentence)
Reinforce the mindset shift. One powerful closing line like a quote, cue, or belief reframe.

6. Motivational Quote (1 sentence)
Something truly inspirational to end the Chapter with.

Instructions:
● Write ~{{chapter_length}} words following the bold markdown format precisely.
● The tone should be clear, energetic, practical, empowering, and evidence-based.
● Prioritize transformation, habit-building, and reader wins.
● Use lists, bullet points, bolded benefits, and actionable psychology where appropriate.
● End with a clear Action Steps section and a closing 1-line motivational reminder.
● Do NOT include any image-related placeholders or markdown for images.
● Output the section content only. No additional comments or headers outside the eBook content format.
```

---

### Stage 5: Content Optimization

**Persona**: Elite Editorial Strategist and Content Optimizer

**Input Parameters**:
- `text` (chapter content from Stage 4)

**Output**: Optimized, publication-ready chapter content with CTA

**Optimization Focus**:
- ✅ Remove redundancy
- ✅ Strengthen emotional resonance
- ✅ Improve scientific clarity
- ✅ Optimize structure and pacing
- ✅ Professional tone for busy professionals
- ✅ Add actionable steps/frameworks where beneficial
- ✅ Include call-to-action at end

**Prompt**:

```
You are an elite editorial strategist and content optimizer specializing in fitness, wellness, and personal development materials. Your task is to audit and immediately improve the provided document based on clarity, emotional resonance, scientific credibility, flow, and engagement.

Think critically to identify what needs to be improved, but instead of listing issues, directly implement corrections in the output.

Document for Optimization:
{{text}}

Process and Rules:
1. Quickly audit the content for structure, emotional engagement, scientific depth, redundancy, pacing, and clarity.

2. Internally note what needs to be improved based on the following criteria:
   ○ Remove any redundant sections or phrasing.
   ○ Strengthen emotional resonance where motivation is weak.
   ○ Improve scientific explanation clarity without overwhelming jargon.
   ○ Optimize structure for smooth reading and fast engagement.
   ○ Ensure a clean, professional tone aimed at busy professionals seeking transformation.
   ○ Add actionable steps, reflection prompts, or mini frameworks if they strengthen the flow.
   ○ Lightly tighten sentences without changing the original message or personality.

3. Implement all changes directly into the content.

4. Include a call-to-action (CTA) at the end of the document.

5. Deliver only the corrected and optimized final document.

Output ONLY the upgraded, full document — do not describe or explain the changes separately.

The final result should feel like a professionally edited, highly engaging, ready-to-publish document.
```

---

### Stage 6: eBook Cover Design

**Persona**: World-Class Creative Director and Visual Brand Strategist

**Input Parameters**:
- `name` (chapter/book title)
- `i` (chapter/book content)

**Output**: Single DALL·E 3 text-to-image prompt (1-2 sentences)

**Design Requirements**:
- ✅ Format: A4 layout (8.27" × 11.69")
- ✅ Thumbnail-optimized (legible at 100px)
- ✅ Mobile-first design
- ✅ No text/title on cover
- ✅ Cross-platform compatible (KDP, Gumroad, Etsy)
- ✅ Style: Ultra-realistic, cinematic, emotionally immersive

**Prompt**:

```
You are a world-class Creative Director and Visual Brand Strategist, specializing in cinematic, emotionally immersive, ultra-realistic eBook covers.

Your task is to generate a high-resolution visual concept for a title-free eBook cover based entirely on the provided content summary. The cover must visually express the book's transformation journey, core energy, and emotional tone using symbolic metaphor, cinematic depth, and visual storytelling — without relying on any text.

Infer the emotional arc, core transformation, and energetic tone from the following content summary. Then, generate a single, clean text-to-image generation prompt suitable for direct use in DALL·E 3 or a similar AI tool.

Content Summary:
● Chapter Title: {{name}}
● Chapter Content: {{i}}

Design Requirements:
● Format: A4 layout (8.27" × 11.69")
● Thumbnail Impact: Must remain legible and captivating at 100px
● Mobile-First: Optimized for small screens and quick visual impact
● No Title/Text: Image must communicate entirely through visuals
● Cross-Platform Compatibility: Designed for Amazon KDP, Gumroad, Etsy
● Style: Ultra-realistic, cinematic, emotionally immersive, high-resolution

Return only 1 clean text-to-image generation prompt (1–2 sentences). Do not include extra commentary, markdown, or filler.
```

---

### Stage 7: Interactive Element Creation

**Persona**: Elite Fitness Behavior Designer

**Input Parameters**:
- `name` (chapter title)
- `i` (chapter content)

**Output**: Interactive element specifications (5 fields)

**Element Types**:
- Printable Tracker
- Guided Journal Page
- Progress Checklist
- Habit Worksheet
- Milestone Calendar

**Output Fields**:
1. Title (action-driven, emotionally compelling)
2. Element Type
3. Purpose (behavior/transformation it supports)
4. How It Works (user instructions)
5. Visual Style Direction

**Prompt**:

```
You are an elite Fitness Behavior Designer specializing in creating emotionally engaging, habit-building interactive tools. Your task is to generate one interactive tool per chapter that helps readers act, track, or reflect, with a focus on fitness habits, weight tracking, workout milestones, and motivation builders.

Based on the provided chapter content, generate the specifications for one fitness-focused interactive element.

Chapter Context:
● Chapter Title: {{name}}
● Chapter Content: {{i}}

Required Output Fields:
● Title (emotionally compelling and action-driven)
● Element Type (e.g., Printable Tracker, Guided Journal Page, Progress Checklist)
● Purpose (behavior or transformation it supports)
● How It Works (brief user instructions)
● Visual Style Direction (e.g., "A4 printable worksheet, soft athletic gradients, motivational icons")

Return plain text only for the five fields above. Do not use bullet points or include any additional commentary.
```

---

### Stage 8: Diagram Generation

**Persona**: World-Class eBook Visual Strategist and Diagram Designer

**Input Parameters**:
- `i` (chapter content)

**Output**: Single FLUX.1-schnell prompt (1-2 sentences)

**Diagram Types**:
- Pyramid, Flowchart, Timeline, Loop, Mind Map, Grid, Venn, Framework

**Visual Style**:
- 3D isometric
- Ultra-realistic, high-resolution
- Calming pastel tones
- Minimalist icons
- Soft shadows on clean white background

**Prompt**:

```
You are a world-class eBook visual strategist and diagram designer specialized in high-resolution health and wellness content. Your task is to analyze the provided chapter, select the optimal diagram type (e.g., Pyramid, Flowchart, Timeline, Loop, Mind Map, Grid) that distills its core transformation into a clear, engaging framework, and then craft a single, natural-language rendering prompt for black-forest-labs/FLUX.1-schnell.

The prompt must specify style, composition, and mood in full sentences—detailing tone, color palette, perspective, and minimalist iconography to guide a 3D isometric, ultra-realistic, high-resolution render.

Chapter Content for Analysis:
{{i}}

Instructions:
Output a single natural-language prompt (1-2 sentences) for black-forest-labs/FLUX.1-schnell that includes:
● A results-oriented Diagram Title
● The selected Diagram Type (e.g., Loop, Timeline, Venn, Pyramid, Framework Grid)
● The Core Components to be visualized
● A Visual Direction described in full sentences, specifying a 3D isometric, ultra-realistic, high-resolution render in calming pastel tones with minimalist icons and soft shadows on a clean white background.

Return only the 1–2 sentence prompt.
```

---

### Stage 9: Background Visual Generation

**Persona**: Elite Fitness Visual Identity Strategist and eBook Creative Director

**Input Parameters**:
- `name` (chapter title)
- `i` (chapter content)

**Output**: Three fields for background visual specification

**Focus Areas**:
- Metaphorical fitness representations (avoid literal exercise photos)
- Energy arcs, dynamic gradients, resilience textures
- Transformation benefits visualization

**Output Fields**:
1. Visual Motif or Texture (fitness/transformation metaphor)
2. Emotional Tone (feeling the visual evokes)
3. Cinematic Text-to-Image Prompt (1-2 sentences, ultra-realistic, high-resolution)

**Prompt**:

```
You are an elite Fitness Visual Identity Strategist and eBook Creative Director. Your task is to design a single high-impact background visual based on a fitness and transformation-themed chapter summary.

Focus on metaphorical representations of fitness, movement, strength, weight loss, or transformation benefits—such as energy arcs, dynamic gradients, or resilience textures—and avoid literal exercise photos.

Analyze the fitness transformation theme and emotional journey from the provided chapter content.

Chapter Context:
● Chapter Title: {{name}}
● Chapter Content: {{i}}

Required Output:
Generate the following three fields based on your analysis:

1. Visual Motif or Texture: (A fitness/transformation themed metaphor)
2. Emotional Tone: (The feeling the visual evokes)
3. Cinematic Text-to-Image Prompt: (1–2 sentences, ultra-realistic, high-resolution, fitness-themed)

Return only the three fields. Do not include any commentary.
```

---

## Additional Resources

### Recommended Tools & Services

**LLM Services**:
- Anthropic Claude (Sonnet/Opus) - Best for long-form content
- OpenAI GPT-4 Turbo - Alternative for text generation
- Google Gemini Pro - Cost-effective option

**Image Generation**:
- DALL·E 3 via OpenAI API - Cover design (Stage 6)
- FLUX.1-schnell via Replicate - Diagrams and backgrounds (Stages 8-9)
- Midjourney - Alternative for all visual stages

**Pipeline Orchestration**:
- LangChain - For chaining LLM calls
- n8n - Visual workflow automation
- Apache Airflow - Production-grade orchestration

### Quality Assurance Checklist

**Before Publishing**:
- [ ] All SEO queries verified with 12M+ search results
- [ ] Title + subtitle ≤ 12 words
- [ ] Each chapter meets target word count (±10%)
- [ ] Tone and mood consistent across all chapters
- [ ] All interactive elements properly designed
- [ ] Cover image renders correctly at thumbnail size
- [ ] Diagrams clearly communicate key concepts
- [ ] Final content passes readability score (Flesch-Kincaid 60+)
- [ ] CTA included at end of each chapter
- [ ] All visual assets high-resolution and platform-compatible

### Troubleshooting

**Common Issues**:

1. **SEO queries too niche**: Increase keyword breadth, remove qualifiers
2. **Chapter content too short**: Add more examples, case studies, or frameworks
3. **Visual prompts generate poor images**: Increase specificity in style direction, add more descriptive adjectives
4. **Tone inconsistency**: Review all mood/tone parameters, ensure they align
5. **Low engagement**: Add more interactive elements, strengthen emotional hooks

---

## License & Usage

This system architecture is provided as a template for automated eBook generation. Customize all parameters to match your specific niche, audience, and distribution strategy.

**Version**: 1.0
**Last Updated**: 2025-11-14
**Recommended AI Models**: Claude Sonnet 4.5, GPT-4 Turbo, DALL·E 3, FLUX.1-schnell
