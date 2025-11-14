export type GeneratedParameters = {
  topic: string;
  tone: string;
  mood: string;
  theme: string;
  mainKeyword: string;
  targetAudience: string;
  keywords: string;
  painPoints: string;
  seoQueries: string[];
};

export type StartJobResponse = {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
};
