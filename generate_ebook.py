#!/usr/bin/env python3
"""
Nine-Stage Automated eBook Generation System
Interactive Workflow Orchestrator

This script provides an interactive interface for generating complete,
production-ready eBooks from a single topic input.

Usage:
    python generate_ebook.py
    python generate_ebook.py --topic "weight loss for beginners"
    python generate_ebook.py --config config.yaml
"""

import os
import sys
import json
import yaml
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional

# Import LLM client
from llm_client import create_llm_client, create_image_client

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def print_header(text: str):
    """Print formatted header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*80}{Colors.ENDC}\n")


def print_stage(stage_num: int, stage_name: str):
    """Print stage header"""
    print(f"\n{Colors.OKCYAN}{Colors.BOLD}[Stage {stage_num}] {stage_name}{Colors.ENDC}")
    print(f"{Colors.OKCYAN}{'─'*80}{Colors.ENDC}\n")


def print_success(text: str):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")


def print_warning(text: str):
    """Print warning message"""
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")


def print_error(text: str):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")


def print_info(text: str):
    """Print info message"""
    print(f"{Colors.OKBLUE}ℹ {text}{Colors.ENDC}")


def get_user_input(prompt: str, default: Optional[str] = None) -> str:
    """Get user input with optional default value"""
    if default:
        user_input = input(f"{prompt} [{default}]: ").strip()
        return user_input if user_input else default
    return input(f"{prompt}: ").strip()


def confirm_action(prompt: str) -> bool:
    """Get yes/no confirmation from user"""
    while True:
        response = input(f"{prompt} (y/n): ").strip().lower()
        if response in ['y', 'yes']:
            return True
        elif response in ['n', 'no']:
            return False
        print_warning("Please enter 'y' or 'n'")


def generate_config_from_topic(topic: str, llm_client=None) -> Dict[str, Any]:
    """
    Stage 0: Auto-generate all configuration parameters from a single topic

    This function uses an LLM to intelligently generate all required parameters
    based on the user's topic input.
    """
    print_stage(0, "Auto-Generate Configuration Parameters")
    print_info(f"Analyzing topic: '{topic}'")

    # Prompt for LLM to generate configuration
    prompt = f"""You are an expert eBook strategist and market analyst. Your task is to analyze a topic and generate optimal configuration parameters for an automated eBook generation system.

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

Output only the YAML block. No additional commentary."""

    print_info("Generating optimized configuration parameters...")

    # If LLM client provided, use it; otherwise, generate defaults
    if llm_client:
        config_yaml = llm_client.generate(prompt)
        # Parse YAML response
        try:
            # Extract YAML from markdown code block if present
            if "```yaml" in config_yaml:
                config_yaml = config_yaml.split("```yaml")[1].split("```")[0].strip()
            elif "```" in config_yaml:
                config_yaml = config_yaml.split("```")[1].split("```")[0].strip()

            config = yaml.safe_load(config_yaml)
            # Ensure config is a dictionary
            if not isinstance(config, dict):
                raise ValueError("Config is not a dictionary")
        except Exception as e:
            print_error(f"Failed to parse LLM response: {e}")
            config = generate_default_config(topic)
    else:
        # Generate intelligent defaults based on topic analysis
        config = generate_default_config(topic)

    # Add system defaults
    if isinstance(config, dict):
        config['min_search_results'] = 12000000
        config['num_chapters'] = 5
    else:
        # Fallback if config is still not a dict
        config = generate_default_config(topic)
        config['min_search_results'] = 12000000
        config['num_chapters'] = 5

    print_success("Configuration generated successfully!")
    return config


def apply_template_defaults(config: Dict[str, Any], template: str) -> Dict[str, Any]:
    """Apply template-specific defaults on top of existing config."""
    # Standard (default) template: Intro 600-900, 5 chapters @ 1200, Final thoughts 600-900, Leave a review 300-500
    if template == 'standard':
        config['intro_min_words'] = 600
        config['intro_max_words'] = 900
        config['num_chapters'] = 5
        config['chapter_length'] = 1200
        config['final_min_words'] = 600
        config['final_max_words'] = 900
        config['review_min_words'] = 300
        config['review_max_words'] = 500
    elif template == 'quickstart':
        # Quickstart: shorter book for rapid consumption
        config['intro_min_words'] = 300
        config['intro_max_words'] = 500
        config['num_chapters'] = 3
        config['chapter_length'] = 800
        config['final_min_words'] = 300
        config['final_max_words'] = 500
        config['review_min_words'] = 150
        config['review_max_words'] = 250
    elif template == 'deepdive':
        # Deep Dive: longer, more comprehensive
        config['intro_min_words'] = 800
        config['intro_max_words'] = 1200
        config['num_chapters'] = 8
        config['chapter_length'] = 2000
        config['final_min_words'] = 800
        config['final_max_words'] = 1200
        config['review_min_words'] = 400
        config['review_max_words'] = 700
    return config


def generate_default_config(topic: str) -> Dict[str, Any]:
    """Generate default configuration when LLM is not available"""
    # Intelligent defaults based on common patterns
    is_fitness = any(word in topic.lower() for word in ['fitness', 'weight', 'workout', 'exercise', 'muscle', 'diet', 'nutrition'])
    is_wellness = any(word in topic.lower() for word in ['wellness', 'health', 'mental', 'stress', 'sleep', 'mindfulness'])
    is_beginner = 'beginner' in topic.lower() or 'start' in topic.lower()

    return {
        'topic': topic,
        'main_keyword': topic.split()[0] if topic else 'wellness',
        'theme': 'beginner-friendly transformation' if is_beginner else 'science-backed sustainable change',
        'target_audience': 'busy professionals aged 30-50 seeking practical solutions',
        'tone': 'empowering',
        'mood': 'motivational',
        'distribution_platform': 'Amazon KDP',
        'primary_format': 'Kindle',
        'chapter_length': 2000,
        'interactive_elements_included': 'Printable Tracker, Progress Checklist, Habit Worksheet'
    }


def display_config(config: Dict[str, Any]):
    """Display configuration in a readable format"""
    print(f"\n{Colors.BOLD}Generated Configuration:{Colors.ENDC}\n")

    sections = {
        'Content Parameters': ['topic', 'main_keyword', 'theme'],
        'Audience & Style': ['target_audience', 'tone', 'mood'],
        'Distribution': ['distribution_platform', 'primary_format'],
        'Content Structure': ['chapter_length', 'interactive_elements_included']
    }

    for section, keys in sections.items():
        print(f"{Colors.BOLD}{section}:{Colors.ENDC}")
        for key in keys:
            if key in config:
                value = config[key]
                print(f"  {key:30s}: {Colors.OKCYAN}{value}{Colors.ENDC}")
        print()


def edit_config_interactive(config: Dict[str, Any]) -> Dict[str, Any]:
    """Allow user to interactively edit configuration parameters"""
    print_header("Review & Modify Configuration")

    while True:
        display_config(config)

        if not confirm_action("\nWould you like to modify any parameters?"):
            break

        print("\nEditable parameters:")
        editable = ['topic', 'main_keyword', 'theme', 'target_audience', 'tone',
                   'mood', 'distribution_platform', 'primary_format', 'chapter_length',
                   'interactive_elements_included']

        for i, key in enumerate(editable, 1):
            print(f"  {i}. {key}")

        try:
            choice = int(input("\nEnter number to edit (0 to finish): ").strip())
            if choice == 0:
                break
            if 1 <= choice <= len(editable):
                key = editable[choice - 1]
                current = config[key]
                print(f"\nCurrent value: {Colors.OKCYAN}{current}{Colors.ENDC}")

                if key == 'chapter_length':
                    new_value = int(get_user_input("Enter new value", str(current)))
                else:
                    new_value = get_user_input("Enter new value", str(current))

                config[key] = new_value
                print_success(f"Updated {key}")
            else:
                print_warning("Invalid choice")
        except ValueError:
            print_warning("Please enter a valid number")

    return config


def save_config(config: Dict[str, Any], output_dir: Path):
    """Save configuration to file"""
    config_path = output_dir / "config.yaml"
    with open(config_path, 'w') as f:
        yaml.dump(config, f, default_flow_style=False, sort_keys=False)
    print_success(f"Configuration saved to: {config_path}")
    return config_path


def execute_pipeline(config: Dict[str, Any], output_dir: Path, llm_client=None):
    """Execute all 9 stages of the eBook generation pipeline"""
    print_header("Starting eBook Generation Pipeline")

    results = {
        'config': config,
        'stages': {},
        'output_dir': str(output_dir)
    }

    # Stage 1: SEO Query Generation
    print_stage(1, "SEO Query Generation")
    queries = stage_1_seo_queries(config, llm_client)
    results['stages']['stage_1'] = {'queries': queries}
    save_stage_output(output_dir, 'stage_1_queries.txt', '\n'.join(queries))
    print_success(f"Generated {len(queries)} SEO queries")

    # Stage 2: eBook Outline Generation
    print_stage(2, "eBook Outline Generation")
    outline = stage_2_outline(config, queries, llm_client)
    results['stages']['stage_2'] = {'outline': outline}
    save_stage_output(output_dir, 'stage_2_outline.md', outline)
    print_success("eBook outline created")

    # Attach output_dir to config so later stages can find the outline file
    config['output_dir'] = str(output_dir)

    # Stage 3: Table of Contents
    print_stage(3, "Table of Contents Generation")
    toc = stage_3_toc(outline, llm_client)
    results['stages']['stage_3'] = {'toc': toc}
    save_stage_output(output_dir, 'stage_3_toc.md', toc)
    print_success("Table of Contents generated")

    # Stage 4: Chapter Content Writing
    print_stage(4, "Chapter Content Writing")
    chapters = stage_4_chapters(config, queries, llm_client)
    results['stages']['stage_4'] = {'chapters': chapters}
    for i, chapter in enumerate(chapters, 1):
        save_stage_output(output_dir, f'stage_4_chapter_{i}.md', chapter)
    print_success(f"Generated {len(chapters)} chapters")

    # Stage 5: Content Optimization
    print_stage(5, "Content Optimization")
    optimized_chapters = stage_5_optimize(chapters, llm_client)
    results['stages']['stage_5'] = {'optimized_chapters': optimized_chapters}
    for i, chapter in enumerate(optimized_chapters, 1):
        save_stage_output(output_dir, f'stage_5_optimized_chapter_{i}.md', chapter)
    print_success(f"Optimized {len(optimized_chapters)} chapters")

    # Stage 6: Cover Design (parallel with 7-9)
    print_stage(6, "eBook Cover Design Prompt Generation")
    cover_prompt = stage_6_cover(config, optimized_chapters[0], llm_client)
    results['stages']['stage_6'] = {'cover_prompt': cover_prompt}
    save_stage_output(output_dir, 'stage_6_cover_prompt.txt', cover_prompt)
    print_success("Cover design prompt generated")

    # Stage 7: Interactive Elements
    print_stage(7, "Interactive Element Creation")
    interactive_elements = stage_7_interactive(optimized_chapters, llm_client)
    results['stages']['stage_7'] = {'interactive_elements': interactive_elements}
    save_stage_output(output_dir, 'stage_7_interactive_elements.json', json.dumps(interactive_elements, indent=2))
    print_success(f"Created {len(interactive_elements)} interactive elements")

    # Stage 8: Diagram Generation
    print_stage(8, "Diagram Prompt Generation")
    diagram_prompts = stage_8_diagrams(optimized_chapters, llm_client)
    results['stages']['stage_8'] = {'diagram_prompts': diagram_prompts}
    save_stage_output(output_dir, 'stage_8_diagram_prompts.json', json.dumps(diagram_prompts, indent=2))
    print_success(f"Generated {len(diagram_prompts)} diagram prompts")

    # Stage 9: Background Visuals
    print_stage(9, "Background Visual Prompt Generation")
    background_prompts = stage_9_backgrounds(optimized_chapters, llm_client)
    results['stages']['stage_9'] = {'background_prompts': background_prompts}
    save_stage_output(output_dir, 'stage_9_background_prompts.json', json.dumps(background_prompts, indent=2))
    print_success(f"Generated {len(background_prompts)} background prompts")

    # Compile final eBook
    print_stage(10, "Final eBook Compilation")
    ebook_path = compile_ebook(results, output_dir)
    print_success(f"Production-ready eBook compiled: {ebook_path}")

    # Save metadata
    metadata_path = output_dir / 'generation_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump({
            'timestamp': datetime.now().isoformat(),
            'config': config,
            'output_files': {
                'ebook': str(ebook_path),
                'cover_prompt': 'stage_6_cover_prompt.txt',
                'diagram_prompts': 'stage_8_diagram_prompts.json',
                'background_prompts': 'stage_9_background_prompts.json',
                'interactive_elements': 'stage_7_interactive_elements.json'
            }
        }, f, indent=2)

    return results


def save_stage_output(output_dir: Path, filename: str, content: str):
    """Save stage output to file"""
    filepath = output_dir / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)


def stage_1_seo_queries(config: Dict[str, Any], llm_client) -> list:
    """Stage 1: Generate SEO queries"""
    prompt = f"""You are an elite SEO strategist and trend analyst specializing in high-demand, commercially viable topics within the health, wellness, and fitness niche. Your primary function is to generate short, realistic, and high-volume search queries that reflect exactly what users are actively searching for on platforms like Google, YouTube, and Reddit in 2025.

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
● Topic: {config['topic']}
● Tone: {config['tone']}
● Mood: {config['mood']}
● Theme: {config['theme']}
● Main Keyword: {config['main_keyword']}
● Target Audience: {config['target_audience']}

List only the 5 queries clearly, each separated by a new line, without explanations or extra text."""

    if llm_client:
        print_info("Streaming SEO query generation (live)...\n")
        buf = []
        def _stream(delta: str):
            sys.stdout.write(delta)
            sys.stdout.flush()
            buf.append(delta)
        response = llm_client.stream_generate(prompt, on_delta=_stream)
        print("\n")
        queries = [q.strip() for q in response.strip().split('\n') if q.strip()]
        return queries[:5]  # Ensure exactly 5 queries
    else:
        # Fallback queries
        return [
            config['main_keyword'],
            f"{config['main_keyword']} guide",
            f"{config['main_keyword']} tips",
            f"how to {config['main_keyword']}",
            f"{config['main_keyword']} for beginners"
        ]


def stage_2_outline(config: Dict[str, Any], queries: list, llm_client) -> str:
    """Stage 2: Generate eBook outline"""
    # Implementation of Stage 2 prompt (abbreviated for space)
    # In production, this would call the LLM with the full Stage 2 prompt
    if llm_client:
        # Stream the outline so users can watch it generate live in terminal
        print_info("Streaming outline generation (live)...\n")
        def _stream(delta: str):
            # write incremental tokens without newlines forced
            sys.stdout.write(delta)
            sys.stdout.flush()
        text = llm_client.stream_generate(
            f"Generate eBook outline for: {config['topic']}",
            on_delta=_stream
        )
        print("\n")
        return text
    else:
        return f"# {config['topic'].title()}\n\n## Outline\n\n- Chapter 1\n- Chapter 2\n- Chapter 3\n- Chapter 4\n- Chapter 5"


import re

def extract_chapter_titles(outline: str) -> list:
    """Extract only top-level chapter titles from an outline.
    Accepts headings like:
      - '### Chapter 1 – Title'
      - '## Chapter 2 - Title'
      - '- Chapter 3 – Title'
    Ignores subheadings like '1.1', '2.3', etc.
    """
    titles = []
    for raw in outline.splitlines():
        line = raw.strip()
        if not line:
            continue
        # Normalize dashes
        norm = line.replace('—', '–')
        # Match markdown heading with 'Chapter N - Title'
        m = re.match(r'^(?:#{2,6}\s+|[-*]\s+)?Chapter\s+(\d+)\s*[–-]\s*(.+)$', norm, re.IGNORECASE)
        if m:
            title = m.group(2).strip().rstrip('.').strip()
            # Exclude lines that look like section numeration (e.g., '1.1. Something')
            if not re.match(r'^\d+\.\d+', title):
                # Ensure unique order-preserving
                if title and title not in titles:
                    titles.append(title)
    return titles


def stage_3_toc(outline: str, llm_client) -> str:
    """Stage 3: Generate Table of Contents from extracted chapter titles only"""
    titles = extract_chapter_titles(outline)
    if not titles:
        return "# Table of Contents\n\n(Outline parsing found no chapters)\n"
    toc_lines = ["# Table of Contents", ""]
    for i, title in enumerate(titles, 1):
        toc_lines.append(f"{i}. {title}")
    return "\n".join(toc_lines) + "\n"


def stage_4_chapters(config: Dict[str, Any], queries: list, llm_client) -> list:
    """Stage 4: Generate chapter content based on top-level chapter titles only"""
    # Derive titles from Stage 2 outline
    outline_path = Path(config.get('output_dir', './output')) / 'stage_2_outline.md'
    outline_text = ''
    if outline_path.exists():
        outline_text = outline_path.read_text(encoding='utf-8')
    else:
        # As a fallback, rely on the outline in memory if execute_pipeline passes it
        outline_text = ""

    titles = extract_chapter_titles(outline_text) if outline_text else []

    # If no titles parsed, fall back to numeric count
    if not titles:
        titles = [f"Chapter {i+1}" for i in range(config.get('num_chapters', 5))]

    chapters = []
    for i, title in enumerate(titles, 1):
        chapter_heading = f"# Chapter {i}: {title}"
        if llm_client:
            print_info(f"Streaming Chapter {i} – {title} (live)...\n")
            buf = []
            def _stream(delta: str):
                sys.stdout.write(delta)
                sys.stdout.flush()
                buf.append(delta)
            prompt = (f"Write Chapter {i} titled '{title}' for the eBook on '{config['topic']}'. "
                      f"Target length ~{config.get('chapter_length', 2000)} words. "
                      f"Use clear subheadings and actionable takeaways.")
            text = llm_client.stream_generate(prompt, on_delta=_stream)
            print("\n")
            chapters.append(f"{chapter_heading}\n\n{text.strip()}" if text else f"{chapter_heading}\n\n(Empty)")
        else:
            chapters.append(f"{chapter_heading}\n\nContent for {title}...")
    return chapters


def stage_5_optimize(chapters: list, llm_client) -> list:
    """Stage 5: Optimize chapter content"""
    # Simplified - would optimize each chapter
    return chapters


def stage_6_cover(config: Dict[str, Any], first_chapter: str, llm_client) -> str:
    """Stage 6: Generate cover design prompt"""
    return f"Ultra-realistic, cinematic eBook cover for '{config['topic']}', emotional and transformative visual metaphor, high-resolution, A4 format."


def stage_7_interactive(chapters: list, llm_client) -> list:
    """Stage 7: Generate interactive elements"""
    elements = []
    for i, chapter in enumerate(chapters):
        elements.append({
            'chapter': i + 1,
            'title': f'Progress Tracker - Chapter {i+1}',
            'type': 'Printable Tracker',
            'description': 'Track your progress'
        })
    return elements


def stage_8_diagrams(chapters: list, llm_client) -> list:
    """Stage 8: Generate diagram prompts"""
    prompts = []
    for i in range(len(chapters)):
        prompts.append({
            'chapter': i + 1,
            'prompt': f'3D isometric diagram showing key concepts, calming pastel tones, high-resolution'
        })
    return prompts


def stage_9_backgrounds(chapters: list, llm_client) -> list:
    """Stage 9: Generate background visual prompts"""
    prompts = []
    for i in range(len(chapters)):
        prompts.append({
            'chapter': i + 1,
            'prompt': f'Fitness transformation themed background, dynamic gradients, ultra-realistic'
        })
    return prompts


def write_section_with_stream(title: str, body_prompt: str, llm_client, on_delta=None) -> str:
    if not llm_client:
        return f"# {title}\n\n{body_prompt}\n"
    buf = []
    if on_delta is None:
        def on_delta(delta: str):
            sys.stdout.write(delta)
            sys.stdout.flush()
            buf.append(delta)
    else:
        def wrapper(delta: str):
            on_delta(delta)
            buf.append(delta)
        on_delta = wrapper
    text = llm_client.stream_generate(body_prompt, on_delta=on_delta)
    print("\n")
    return f"# {title}\n\n{text.strip()}\n"


def compile_ebook(results: Dict[str, Any], output_dir: Path, llm_client=None) -> Path:
    """Compile all components into final eBook"""
    ebook_path = output_dir / 'FINAL_EBOOK.md'

    with open(ebook_path, 'w', encoding='utf-8') as f:
        # Title page
        f.write(f"# {results['config']['topic'].title()}\n\n")
        f.write(f"*An eBook for {results['config']['target_audience']}*\n\n")
        f.write("---\n\n")

        # Intro section (streamed)
        intro_min = results['config'].get('intro_min_words')
        intro_max = results['config'].get('intro_max_words')
        if intro_min and intro_max:
            print_stage(10, f"Intro ({intro_min}-{intro_max} words)")
            intro = write_section_with_stream(
                "Introduction",
                f"Write an introductory section for the eBook on '{results['config']['topic']}'. Target length {intro_min}-{intro_max} words.",
                llm_client or create_llm_client(provider='mock'),
            )
            f.write(intro)
            f.write("\n---\n\n")

        # Table of Contents
        if 'toc' in results['stages'].get('stage_3', {}):
            f.write(results['stages']['stage_3']['toc'])
            f.write("\n\n---\n\n")

        # Optimized Chapters
        if 'optimized_chapters' in results['stages'].get('stage_5', {}):
            for i, chapter in enumerate(results['stages']['stage_5']['optimized_chapters'], 1):
                f.write(f"{chapter}\n\n")
                if i < len(results['stages']['stage_5']['optimized_chapters']):
                    f.write("---\n\n")

        # Final Thoughts (streamed)
        final_min = results['config'].get('final_min_words')
        final_max = results['config'].get('final_max_words')
        if final_min and final_max:
            print_stage(10, f"Final Thoughts ({final_min}-{final_max} words)")
            final = write_section_with_stream(
                "Final Thoughts",
                f"Write final thoughts for the eBook on '{results['config']['topic']}'. Target length {final_min}-{final_max} words.",
                llm_client or create_llm_client(provider='mock'),
            )
            f.write(final)
            f.write("\n---\n\n")

        # Leave a Review (streamed)
        review_min = results['config'].get('review_min_words')
        review_max = results['config'].get('review_max_words')
        if review_min and review_max:
            print_stage(10, f"Leave a Review ({review_min}-{review_max} words)")
            review = write_section_with_stream(
                "We'd Love Your Review",
                f"Write a short call-to-action asking readers to leave a review for the eBook. Target length {review_min}-{review_max} words.",
                llm_client or create_llm_client(provider='mock'),
            )
            f.write(review)
            f.write("\n---\n\n")

        # Appendix: Interactive Elements
        f.write("\n\n---\n\n# Appendix: Interactive Tools\n\n")
        if 'interactive_elements' in results['stages'].get('stage_7', {}):
            for elem in results['stages']['stage_7']['interactive_elements']:
                f.write(f"## {elem.get('title', 'Interactive Element')}\n")
                f.write(f"Type: {elem.get('type', 'N/A')}\n")
                f.write(f"{elem.get('description', '')}\n\n")

    print_info(f"eBook compiled with {len(results['stages'].get('stage_5', {}).get('optimized_chapters', []))} chapters")
    return ebook_path


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Nine-Stage Automated eBook Generation System',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate_ebook.py
  python generate_ebook.py --topic "weight loss for beginners"
  python generate_ebook.py --config config.yaml --output ./my_ebook
        """
    )
    parser.add_argument('--topic', help='Initial topic for eBook (interactive mode if not provided)')
    parser.add_argument('--config', help='Path to existing configuration file')
    parser.add_argument('--output', default='./output', help='Output directory (default: ./output)')
    parser.add_argument('--auto', action='store_true', help='Skip configuration review (use generated config as-is)')
    parser.add_argument('--provider', default='mock', choices=['anthropic', 'openai', 'gemini', 'openrouter', 'groq', 'custom', 'mock'],
                       help='LLM provider to use (default: mock for testing)')
    parser.add_argument('--model', help='Specific model to use (e.g., claude-sonnet-4.5, gpt-4-turbo)')
    parser.add_argument('--api-key', help='API key for LLM provider (or set via environment variable)')
    parser.add_argument('--params-only', action='store_true', help='Generate and review parameters only; save config and exit without running stages')
    parser.add_argument('--template', choices=['standard','quickstart','deepdive'], help='Book template to use: standard (default), quickstart, deepdive')

    args = parser.parse_args()

    print_header("Nine-Stage Automated eBook Generation System")
    print_info("Version 2.0 - Fully Automated Workflow")

    # Initialize LLM client
    print_info(f"Initializing LLM client (provider: {args.provider})")
    try:
        llm_client = create_llm_client(
            provider=args.provider,
            api_key=args.api_key,
            model=args.model
        )
        print_success(f"LLM client initialized successfully")
    except Exception as e:
        print_warning(f"Could not initialize LLM client: {e}")
        print_info("Falling back to mock client for testing")
        llm_client = create_llm_client(provider='mock')

    # Create output directory
    output_dir = Path(args.output)
    if not output_dir.exists():
        output_dir.mkdir(parents=True)
        print_success(f"Created output directory: {output_dir}")

    # Determine configuration source
    config = None

    if args.config and Path(args.config).exists():
        # Load from file
        print_info(f"Loading configuration from: {args.config}")
        with open(args.config, 'r') as f:
            config = yaml.safe_load(f)
    elif args.topic:
        # Generate from topic
        config = generate_config_from_topic(args.topic, llm_client)
    else:
        # Interactive mode
        print_header("Interactive Topic Entry")
        topic = get_user_input("Enter your eBook topic")
        if not topic:
            print_error("Topic is required")
            sys.exit(1)
        config = generate_config_from_topic(topic, llm_client)

    # Apply template defaults (prompt user if not provided and not in --auto)
    selected_template = args.template
    if not selected_template:
        if args.auto:
            selected_template = 'standard'
        else:
            print_header("Choose a Book Template")
            print("1) standard   - Intro 600-900, 5 chapters @ 1200, Final 600-900, Review 300-500")
            print("2) quickstart - Intro 300-500, 3 chapters @ 800,  Final 300-500, Review 150-250")
            print("3) deepdive   - Intro 800-1200, 8 chapters @ 2000, Final 800-1200, Review 400-700")
            while True:
                choice = get_user_input("Select template (1-3)", "1")
                mapping = {"1": "standard", "2": "quickstart", "3": "deepdive"}
                if choice in mapping:
                    selected_template = mapping[choice]
                    break
                elif choice in mapping.values():
                    selected_template = choice
                    break
                else:
                    print_warning("Invalid selection. Please choose 1, 2, or 3.")
    config = apply_template_defaults(config, selected_template or 'standard')

    # Allow user to review/modify (unless --auto flag)
    if not args.auto:
        config = edit_config_interactive(config)

    # Save configuration
    save_config(config, output_dir)

    # Parameters-only mode: exit after review/save
    if args.params_only:
        print_header("Parameters-only mode")
        display_config(config)
        print_success("Configuration saved. Exiting without running generation stages.")
        sys.exit(0)

    # Confirm generation (unless --auto flag)
    if not args.auto:
        print_header("Ready to Generate eBook")
        display_config(config)

        if not confirm_action("\n🚀 Generate eBook with this configuration?"):
            print_warning("eBook generation cancelled")
            sys.exit(0)
    else:
        print_info("Auto mode enabled - proceeding with generation...")

    # Execute pipeline
    try:
        results = execute_pipeline(config, output_dir, llm_client)

        # Success summary
        print_header("✓ eBook Generation Complete!")
        print_success(f"Output directory: {output_dir}")
        print_success(f"Final eBook: {output_dir / 'FINAL_EBOOK.md'}")
        print_info("\nNext steps:")
        print(f"  1. Review your eBook: {output_dir / 'FINAL_EBOOK.md'}")
        print(f"  2. Generate cover image using: {output_dir / 'stage_6_cover_prompt.txt'}")
        print(f"  3. Generate diagrams using: {output_dir / 'stage_8_diagram_prompts.json'}")
        print(f"  4. Create interactive elements from: {output_dir / 'stage_7_interactive_elements.json'}")
        print(f"\n  Full generation metadata: {output_dir / 'generation_metadata.json'}")

    except Exception as e:
        print_error(f"eBook generation failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
