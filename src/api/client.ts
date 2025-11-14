import type { GeneratedParameters, StartJobResponse } from './types';

const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;
const USE_MOCKS = (import.meta.env.VITE_USE_MOCKS as string | undefined)?.toLowerCase() === 'true' || !API_BASE;

async function http<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function generateParameters(topic: string): Promise<GeneratedParameters> {
  if (USE_MOCKS) {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 1200));
    const lower = topic.toLowerCase();
    return {
      topic,
      tone: 'Empowering and motivational',
      mood: 'Inspiring and research-backed',
      theme: 'Transformation and growth',
      mainKeyword: lower.replace(/\s+/g, '-'),
      targetAudience: `Small business owners and entrepreneurs interested in ${lower}`,
      keywords: `${lower}, business growth, marketing strategies, digital tools, success tips`,
      painPoints: `Struggling to understand ${lower} basics, lack of time to implement strategies, difficulty measuring results, competition from larger companies, budget constraints for marketing tools.`,
      seoQueries: [
        `${lower} tips`,
        `best ${lower} strategies`,
        `${lower} guide`,
        `${lower} for beginners`,
        `${lower} success stories`,
      ],
    };
  }

  return http<GeneratedParameters>('/generate-parameters', {
    body: JSON.stringify({ topic }),
  });
}

export async function startEbookJob(params: Omit<GeneratedParameters, 'seoQueries'>): Promise<StartJobResponse> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 800));
    return { jobId: `job_${Math.random().toString(36).slice(2, 10)}`, status: 'queued' };
  }
  return http<StartJobResponse>('/start-ebook-job', {
    body: JSON.stringify(params),
  });
}
