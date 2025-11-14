import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicInputForm from '../components/TopicInputForm';
import { startEbookJob } from '../api/client';

const Create: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [jobId, setJobId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(data: any) {
    setIsSubmitting(true);
    setError(null);
    try {
      const { seoQueries, ...params } = data;
      const res = await startEbookJob(params);
      setJobId(res.jobId);
    } catch (e: any) {
      setError(e?.message || 'Failed to start generation job');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New eBook</h1>
          <p className="text-lg text-slate-600">Enter a topic, let AI auto-generate parameters, review and edit, then generate your eBook.</p>
        </div>

        {!jobId ? (
          <TopicInputForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Generation Started</h2>
            <p className="text-slate-600 mb-6">Your job has been queued. Job ID:</p>
            <code className="px-3 py-1 bg-slate-100 text-slate-800 rounded">{jobId}</code>
            <p className="text-slate-600 mt-6">You can navigate to the Library page to see status and results when complete.</p>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Create;
