#!/usr/bin/env python3
"""
LLM Client Wrapper
Provides unified interface for different LLM providers (Anthropic, OpenAI, etc.)
"""

import os
from typing import Optional, Dict, Any
from abc import ABC, abstractmethod


class LLMClient(ABC):
    """Abstract base class for LLM clients"""

    @abstractmethod
    def generate(self, prompt: str, **kwargs) -> str:
        """Generate text from prompt"""
        pass

    def stream_generate(self, prompt: str, on_delta=None, **kwargs) -> str:
        """Default streaming behavior: fallback to non-stream generate.
        Calls on_delta once with full text if provided. Returns full text.
        """
        text = self.generate(prompt, **kwargs)
        if on_delta:
            on_delta(text)
        return text


class AnthropicClient(LLMClient):
    """Anthropic Claude client"""

    def __init__(self, api_key: Optional[str] = None, model: str = "claude-sonnet-4.5"):
        self.api_key = api_key or os.getenv('ANTHROPIC_API_KEY')
        self.model = model

        if not self.api_key:
            raise ValueError("Anthropic API key not provided. Set ANTHROPIC_API_KEY environment variable.")

        try:
            import anthropic
            self.client = anthropic.Anthropic(api_key=self.api_key)
        except ImportError:
            raise ImportError("Please install anthropic: pip install anthropic")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Generate text using Claude"""
        try:
            message = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            return message.content[0].text
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Stream tokens using Anthropic Messages streaming."""
        full = []
        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                for event in stream:
                    delta = getattr(event, 'delta', None)
                    # anthropic python SDK streams content_block_delta events
                    if delta and hasattr(delta, 'text') and delta.text:
                        full.append(delta.text)
                        if on_delta:
                            on_delta(delta.text)
            return ''.join(full)
        except Exception:
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class OpenAIClient(LLMClient):
    """OpenAI GPT client"""

    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4-turbo"):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        self.model = model

        if not self.api_key:
            raise ValueError("OpenAI API key not provided. Set OPENAI_API_KEY environment variable.")

        try:
            import openai
            self.client = openai.OpenAI(api_key=self.api_key)
        except ImportError:
            raise ImportError("Please install openai: pip install openai")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Generate text using GPT"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Stream tokens using OpenAI-compatible streaming."""
        full = []
        try:
            with self.client.chat.completions.stream(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            ) as stream:
                for event in stream:
                    # openai>=1.0 stream events
                    delta = getattr(event, 'delta', None)
                    if delta and delta.content:
                        full.append(delta.content)
                        if on_delta:
                            on_delta(delta.content)
                final = ''.join(full)
                return final
        except Exception as e:
            # Fallback to non-stream if streaming unsupported
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class MockClient(LLMClient):
    """Mock client for testing without API calls"""

    def generate(self, prompt: str, **kwargs) -> str:
        """Generate mock response"""
        if "configuration" in prompt.lower() or "strategist" in prompt.lower() or "Given Topic:" in prompt:
            # Extract topic from prompt if possible
            topic = "wellness"
            if "Given Topic:" in prompt:
                try:
                    topic = prompt.split("Given Topic:")[1].split("\n")[0].strip()
                except:
                    pass

            return f"""```yaml
topic: "{topic}"
main_keyword: "{topic.split()[0] if topic else 'wellness'}"
theme: "science-backed transformation"
target_audience: "busy professionals aged 30-50"
tone: "empowering"
mood: "motivational"
distribution_platform: "Amazon KDP"
primary_format: "Kindle"
chapter_length: 2000
interactive_elements_included: "Printable Tracker, Progress Checklist, Habit Worksheet"
```"""

        elif "SEO" in prompt or "queries" in prompt.lower():
            return """weight loss
weight loss tips
how to lose weight
weight loss diet
weight loss for beginners"""

        elif "outline" in prompt.lower() or "eBook" in prompt:
            return """# Transform Your Body: The Science of Sustainable Weight Loss

## Core Transformation Summary
This book guides busy professionals through evidence-based weight loss strategies that fit into hectic schedules. You'll discover sustainable approaches that prioritize health over quick fixes, combining nutrition science with behavioral psychology.

## Chapters & Goals

Chapter 1: Understanding Your Metabolism
Goal: Learn how your body processes food and burns calories.

Chapter 2: Nutrition Fundamentals
Goal: Master the basics of macronutrients and meal planning.

Chapter 3: Exercise Essentials
Goal: Design a workout routine that fits your lifestyle.

Chapter 4: Building Lasting Habits
Goal: Create sustainable behaviors for long-term success.

Chapter 5: Overcoming Plateaus
Goal: Navigate challenges and maintain momentum.

Final Thoughts
Goal: Embrace your transformation journey with confidence and knowledge."""

        elif "Table of Contents" in prompt:
            return """# Table of Contents

Chapter 1: Metabolic Mastery
Unlock the science of how your body burns energy

Chapter 2: Nutrition Blueprint
Build a sustainable eating plan for life

Chapter 3: Movement Matters
Find exercises you'll actually enjoy

Chapter 4: Habit Formation
Turn intentions into automatic behaviors

Chapter 5: Plateau Breakthrough
Push through barriers and stay consistent

Final Thoughts
Your journey starts now"""

        else:
            return f"Mock response for: {prompt[:100]}..."


class GeminiClient(LLMClient):
    """Google Gemini client"""
    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-1.5-pro"):
        self.api_key = api_key or os.getenv('GOOGLE_API_KEY') or os.getenv('GEMINI_API_KEY')
        self.model = model
        if not self.api_key:
            raise ValueError("Gemini API key not provided. Set GOOGLE_API_KEY or GEMINI_API_KEY.")
        try:
            import google.generativeai as genai
            genai.configure(api_key=self.api_key)
            self.client = genai
        except ImportError:
            raise ImportError("Please install google-generativeai: pip install google-generativeai")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        try:
            model = self.client.GenerativeModel(self.model)
            resp = model.generate_content(prompt, generation_config={"temperature": temperature, "max_output_tokens": max_tokens})
            return getattr(resp, 'text', '') or (resp.candidates[0].content.parts[0].text if resp.candidates else '')
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Gemini streaming via generate_content with streaming flag (best-effort)."""
        try:
            model = self.client.GenerativeModel(self.model)
            stream = model.generate_content(prompt, generation_config={"temperature": temperature, "max_output_tokens": max_tokens}, stream=True)
            full = []
            for chunk in stream:
                # chunk.text for SDK >= 0.7
                delta = getattr(chunk, 'text', None)
                if delta:
                    full.append(delta)
                    if on_delta:
                        on_delta(delta)
            return ''.join(full)
        except Exception:
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class OpenRouterClient(LLMClient):
    """OpenRouter client (OpenAI-compatible API)"""
    def __init__(self, api_key: Optional[str] = None, model: str = "gpt-4o-mini"):
        self.api_key = api_key or os.getenv('OPENROUTER_API_KEY')
        self.model = model
        if not self.api_key:
            raise ValueError("OpenRouter API key not provided. Set OPENROUTER_API_KEY.")
        try:
            import openai
            self.client = openai.OpenAI(api_key=self.api_key, base_url="https://openrouter.ai/api/v1")
        except ImportError:
            raise ImportError("Please install openai: pip install openai")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenRouter API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Stream via OpenAI-compatible OpenRouter."""
        full = []
        try:
            with self.client.chat.completions.stream(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            ) as stream:
                for event in stream:
                    delta = getattr(event, 'delta', None)
                    if delta and delta.content:
                        full.append(delta.content)
                        if on_delta:
                            on_delta(delta.content)
            return ''.join(full)
        except Exception:
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class GroqClient(LLMClient):
    """Groq client"""
    def __init__(self, api_key: Optional[str] = None, model: str = "llama-3.1-70b-versatile"):
        self.api_key = api_key or os.getenv('GROQ_API_KEY')
        self.model = model
        if not self.api_key:
            raise ValueError("Groq API key not provided. Set GROQ_API_KEY.")
        try:
            from groq import Groq
            self.client = Groq(api_key=self.api_key)
        except ImportError:
            raise ImportError("Please install groq: pip install groq")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        """Stream tokens for Groq chat.completions if supported."""
        full = []
        try:
            with self.client.chat.completions.stream(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            ) as stream:
                for event in stream:
                    delta = getattr(event, 'delta', None)
                    if delta and delta.content:
                        full.append(delta.content)
                        if on_delta:
                            on_delta(delta.content)
            return ''.join(full)
        except Exception:
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class CustomClient(LLMClient):
    """Custom OpenAI-compatible endpoint using base URL and API key"""
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.getenv('CUSTOM_LLM_API_KEY')
        self.base_url = os.getenv('CUSTOM_LLM_BASE_URL')
        self.model = model or os.getenv('CUSTOM_LLM_MODEL', 'gpt-4o-mini')
        if not self.api_key or not self.base_url:
            raise ValueError("Custom provider requires CUSTOM_LLM_BASE_URL and CUSTOM_LLM_API_KEY env vars.")
        try:
            import openai
            self.client = openai.OpenAI(api_key=self.api_key, base_url=self.base_url.rstrip('/'))
        except ImportError:
            raise ImportError("Please install openai: pip install openai")

    def generate(self, prompt: str, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling Custom LLM API: {e}")
            raise

    def stream_generate(self, prompt: str, on_delta=None, max_tokens: int = 4096, temperature: float = 1.0, **kwargs) -> str:
        full = []
        try:
            with self.client.chat.completions.stream(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=temperature
            ) as stream:
                for event in stream:
                    delta = getattr(event, 'delta', None)
                    if delta and delta.content:
                        full.append(delta.content)
                        if on_delta:
                            on_delta(delta.content)
            return ''.join(full)
        except Exception:
            return super().stream_generate(prompt, on_delta=on_delta, max_tokens=max_tokens, temperature=temperature, **kwargs)


class ImageClient:
    """Client for image generation"""

    def __init__(self, provider: str = "dalle", api_key: Optional[str] = None):
        self.provider = provider
        self.api_key = api_key

        if provider == "dalle":
            self.api_key = self.api_key or os.getenv('OPENAI_API_KEY')
            if self.api_key:
                try:
                    import openai
                    self.client = openai.OpenAI(api_key=self.api_key)
                except ImportError:
                    raise ImportError("Please install openai: pip install openai")
        elif provider == "flux":
            self.api_key = self.api_key or os.getenv('REPLICATE_API_KEY')

    def generate_image(self, prompt: str, **kwargs) -> str:
        """Generate image from prompt"""
        if self.provider == "dalle" and hasattr(self, 'client'):
            try:
                response = self.client.images.generate(
                    model="dall-e-3",
                    prompt=prompt,
                    size="1024x1792",  # A4-ish ratio
                    quality="hd",
                    n=1
                )
                return response.data[0].url
            except Exception as e:
                print(f"Error generating image: {e}")
                return f"[Image generation failed: {e}]"
        else:
            return f"[Mock image URL for: {prompt[:50]}...]"


def create_llm_client(provider: str = "anthropic", api_key: Optional[str] = None, model: Optional[str] = None) -> LLMClient:
    """Factory function to create appropriate LLM client"""

    if provider == "anthropic":
        model = model or "claude-sonnet-4.5"
        try:
            return AnthropicClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize Anthropic client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    elif provider == "openai":
        model = model or "gpt-4-turbo"
        try:
            return OpenAIClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize OpenAI client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    elif provider == "mock":
        return MockClient()

    elif provider == "gemini":
        model = model or "gemini-1.5-pro"
        try:
            return GeminiClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize Gemini client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    elif provider == "openrouter":
        model = model or "gpt-4o-mini"
        try:
            return OpenRouterClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize OpenRouter client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    elif provider == "groq":
        model = model or "llama-3.1-70b-versatile"
        try:
            return GroqClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize Groq client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    elif provider == "custom":
        try:
            return CustomClient(api_key=api_key, model=model)
        except (ValueError, ImportError) as e:
            print(f"Warning: Could not initialize Custom client: {e}")
            print("Falling back to MockClient for testing")
            return MockClient()

    else:
        raise ValueError(f"Unknown provider: {provider}. Choose 'anthropic', 'openai', 'gemini', 'openrouter', 'groq', 'custom', or 'mock'")


def create_image_client(provider: str = "dalle", api_key: Optional[str] = None) -> ImageClient:
    """Factory function to create image generation client"""
    return ImageClient(provider=provider, api_key=api_key)
