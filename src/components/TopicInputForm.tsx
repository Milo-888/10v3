import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Target, Users, AlertCircle, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const topicSchema = z.object({
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  tone: z.string().min(3, 'Tone is required'),
  mood: z.string().min(3, 'Mood is required'),
  theme: z.string().min(3, 'Theme is required'),
  mainKeyword: z.string().min(3, 'Main keyword is required'),
  targetAudience: z.string().min(3, 'Target audience is required'),
  keywords: z.string().min(3, 'Keywords are required'),
  painPoints: z.string().min(10, 'Pain points must be at least 10 characters'),
  seoQueries: z.array(z.string()).optional(),
});

type TopicFormData = z.infer<typeof topicSchema>;


interface TopicInputFormProps {
  onSubmit: (data: TopicFormData) => Promise<void> | void;
  isLoading?: boolean;
}

const TopicInputForm: React.FC<TopicInputFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
      getValues,
  } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
  });

  const watchedTopic = watch('topic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoQueries, setSeoQueries] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [newSeoQuery, setNewSeoQuery] = useState('');

  const generateParameters = async () => {
    if (!watchedTopic || watchedTopic.length < 5) return;

    setIsGenerating(true);
    try {
      const api = await import('../api/client');
      const data = await api.generateParameters(watchedTopic);

      setSeoQueries(data.seoQueries || []);
      const { seoQueries: _omit, topic, ...generatedData } = data;
      // Ensure topic stays as the user's current input
      if (!watch('topic')) setValue('topic', topic);

      const partial = generatedData as Partial<TopicFormData>;
      (Object.keys(partial) as Array<keyof TopicFormData>).forEach((key) => {
        const val = partial[key];
        if (typeof val !== 'undefined') setValue(key, val);
      });
    } catch (err) {
      console.error('Failed to generate parameters', err);
      // Optionally: surface a toast via a callback prop or a global toaster
    } finally {
      setIsGenerating(false);
    }
  };

  const hasTopic = watchedTopic && watchedTopic.length >= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-slate-900">eBook Topic & Market Research</h2>
      </div>

      <form onSubmit={handleSubmit((data) => {
          // include seoQueries in submit payload
          (data as any).seoQueries = seoQueries;
          setShowPreview(true);
          // do not call onSubmit yet; wait for user confirmation from preview
        })} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">
            eBook Topic
          </label>
          <input
            {...register('topic')}
            type="text"
            id="topic"
            placeholder="Enter your eBook topic (e.g., Digital Marketing for Small Businesses)"
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.topic && (
            <div className="mt-1 flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.topic.message}</span>
            </div>
          )}
        </div>

        {hasTopic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center justify-center"
          >
            <button
              type="button"
              onClick={generateParameters}
              disabled={isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                isGenerating
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              <Zap className={`h-5 w-5 ${isGenerating ? 'animate-pulse' : ''}`} />
              <span>{isGenerating ? 'Analyzing Market...' : 'Generate with AI'}</span>
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-2">
              Tone
            </label>
            <input
              {...register('tone')}
              type="text"
              id="tone"
              placeholder="e.g., Empowering, motivational"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.tone && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.tone.message}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-slate-700 mb-2">
              Mood
            </label>
            <input
              {...register('mood')}
              type="text"
              id="mood"
              placeholder="e.g., Inspiring, research-backed"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.mood && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.mood.message}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-2">
              Theme
            </label>
            <input
              {...register('theme')}
              type="text"
              id="theme"
              placeholder="e.g., Transformation, growth"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.theme && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.theme.message}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="mainKeyword" className="block text-sm font-medium text-slate-700 mb-2">
              Main Keyword
            </label>
            <input
              {...register('mainKeyword')}
              type="text"
              id="mainKeyword"
              placeholder="e.g., digital-marketing"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.mainKeyword && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.mainKeyword.message}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-slate-700 mb-2">
              <Users className="inline h-4 w-4 mr-1" />
              Target Audience
            </label>
            <input
              {...register('targetAudience')}
              type="text"
              id="targetAudience"
              placeholder="e.g., Small business owners, entrepreneurs"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.targetAudience && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.targetAudience.message}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Keywords
            </label>
            <input
              {...register('keywords')}
              type="text"
              id="keywords"
              placeholder="e.g., SEO, social media, content marketing"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.keywords && (
              <div className="mt-1 flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{errors.keywords.message}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="painPoints" className="block text-sm font-medium text-slate-700 mb-2">
            Pain Points & Challenges
          </label>
          <textarea
            {...register('painPoints')}
            id="painPoints"
            rows={4}
            placeholder="Describe the main challenges your target audience faces that this eBook will address..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.painPoints && (
            <div className="mt-1 flex items-center space-x-1 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.painPoints.message}</span>
            </div>
          )}
        </div>

        {(seoQueries.length > 0 || showPreview) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-50 border border-blue-200 rounded-md p-4"
          >
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-800">Generated SEO Queries</h3>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
                {seoQueries.map((_, index) => (
                  <li key={index} className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-3 w-3" />
                      <input
                        type="text"
                        value={seoQueries[index]}
                        onChange={(e) => {
                          const next = [...seoQueries];
                          next[index] = e.target.value;
                          setSeoQueries(next);
                        }}
                        className="bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 text-xs"
                      onClick={() => setSeoQueries(seoQueries.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
                <li className="flex items-center space-x-2 pt-2">
                  <TrendingUp className="h-3 w-3" />
                  <input
                    type="text"
                    value={newSeoQuery}
                    placeholder="Add another query"
                    onChange={(e) => setNewSeoQuery(e.target.value)}
                    className="bg-transparent border-b border-blue-300 focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    className="text-blue-700 hover:text-blue-900 text-xs"
                    onClick={() => {
                      if (newSeoQuery.trim()) {
                        setSeoQueries([...seoQueries, newSeoQuery.trim()]);
                        setNewSeoQuery('');
                      }
                    }}
                  >
                    Add
                  </button>
                </li>
              
            </ul>
          </motion.div>
        )}

        {watchedTopic && watchedTopic.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-green-50 border border-green-200 rounded-md p-4"
          >
            <h3 className="text-sm font-medium text-green-800 mb-2">AI-Generated Suggestions</h3>
            <p className="text-sm text-green-700">
              Based on your topic "{watchedTopic}", we've analyzed market trends and generated 
              optimized parameters for maximum eBook success. The nine-stage automated workflow 
              will now create your complete eBook using specialized AI agents.
            </p>
          </motion.div>
        )}

        {!showPreview ? (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generating eBook Parameters...' : 'Review Parameters'}
          </button>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="w-full md:w-1/2 bg-slate-200 text-slate-800 py-2 px-4 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Back & Edit
            </button>
            <button
              type="button"
              onClick={() => {
                const current = getValues();
                (current as any).seoQueries = seoQueries;
                onSubmit(current as any);
              }}
              disabled={isLoading}
              className="w-full md:w-1/2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Starting…' : 'Confirm & Start Generation'}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default TopicInputForm;