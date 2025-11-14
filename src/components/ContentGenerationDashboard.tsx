import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Play, 
  Pause, 
  RotateCcw,
  BookOpen,
  Edit3,
  Eye,
  Search,
  FileImage,
  Layers,
  BarChart3,
  Image,
  Palette
} from 'lucide-react';

interface ContentSection {
  id: string;
  title: string;
  agent: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress: number;
  wordCount: number;
  targetWords: number;
  quality: number;
  stage: number;
}

const ContentGenerationDashboard: React.FC = () => {
  const [sections] = useState<ContentSection[]>([
    {
      id: '1',
      title: 'SEO Query Generation',
      agent: 'SEO Strategist',
      status: 'completed',
      progress: 100,
      wordCount: 5,
      targetWords: 5,
      quality: 95,
      stage: 1,
    },
    {
      id: '2',
      title: 'eBook Outline Generation',
      agent: 'Content Architect',
      status: 'completed',
      progress: 100,
      wordCount: 150,
      targetWords: 150,
      quality: 92,
      stage: 2,
    },
    {
      id: '3',
      title: 'Table of Contents Generation',
      agent: 'eBook Architect',
      status: 'completed',
      progress: 100,
      wordCount: 80,
      targetWords: 80,
      quality: 90,
      stage: 3,
    },
    {
      id: '4',
      title: 'Chapter Content Writing',
      agent: 'Nonfiction Writer',
      status: 'in-progress',
      progress: 65,
      wordCount: 4800,
      targetWords: 7500,
      quality: 88,
      stage: 4,
    },
    {
      id: '5',
      title: 'Content Optimization',
      agent: 'Editorial Strategist',
      status: 'pending',
      progress: 0,
      wordCount: 0,
      targetWords: 7500,
      quality: 0,
      stage: 5,
    },
    {
      id: '6',
      title: 'eBook Cover Design',
      agent: 'Creative Director',
      status: 'pending',
      progress: 0,
      wordCount: 0,
      targetWords: 0,
      quality: 0,
      stage: 6,
    },
    {
      id: '7',
      title: 'Interactive Element Creation',
      agent: 'Behavior Designer',
      status: 'pending',
      progress: 0,
      wordCount: 0,
      targetWords: 0,
      quality: 0,
      stage: 7,
    },
    {
      id: '8',
      title: 'Diagram Generation',
      agent: 'Visual Strategist',
      status: 'pending',
      progress: 0,
      wordCount: 0,
      targetWords: 0,
      quality: 0,
      stage: 8,
    },
    {
      id: '9',
      title: 'Background Visual Generation',
      agent: 'Visual Identity Strategist',
      status: 'pending',
      progress: 0,
      wordCount: 0,
      targetWords: 0,
      quality: 0,
      stage: 9,
    },
  ]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStageIcon = (stage: number) => {
    switch (stage) {
      case 1:
        return <Search className="h-5 w-5 text-indigo-600" />;
      case 2:
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 3:
        return <BookOpen className="h-5 w-5 text-purple-600" />;
      case 4:
        return <Edit3 className="h-5 w-5 text-green-600" />;
      case 5:
        return <BarChart3 className="h-5 w-5 text-orange-600" />;
      case 6:
        return <Palette className="h-5 w-5 text-pink-600" />;
      case 7:
        return <Layers className="h-5 w-5 text-red-600" />;
      case 8:
        return <FileImage className="h-5 w-5 text-teal-600" />;
      case 9:
        return <Image className="h-5 w-5 text-cyan-600" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const totalProgress = sections.reduce((acc, section) => acc + section.progress, 0) / sections.length;
  const totalWords = sections.reduce((acc, section) => acc + section.wordCount, 0);
  const targetWords = sections.reduce((acc, section) => acc + section.targetWords, 0);

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <BookOpen className="h-6 w-6 text-indigo-600 mr-2" />
            Nine-Stage Automated Content Generation
          </h2>
          <div className="flex space-x-2">
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <Play className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <Pause className="h-4 w-4" />
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{Math.round(totalProgress)}%</div>
            <div className="text-sm text-slate-600">Overall Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalWords.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Words Generated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-600">{targetWords.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Target Words</div>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <motion.div
            className="bg-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="mt-4 text-sm text-slate-600">
          <p>Following the nine-stage automated workflow with specialized AI agents for each phase.</p>
        </div>
      </motion.div>

      {/* Content Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-500">Stage {section.stage}</span>
                  {getStageIcon(section.stage)}
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{section.title}</h3>
                  <p className="text-sm text-slate-600">Agent: {section.agent}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(section.status)}`}>
                  {section.status.replace('-', ' ').toUpperCase()}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-sm text-slate-600">Progress</div>
                <div className="font-medium">{section.progress}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Word Count</div>
                <div className="font-medium">{section.wordCount.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Target</div>
                <div className="font-medium">{section.targetWords > 0 ? section.targetWords.toLocaleString() : 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-600">Quality Score</div>
                <div className="font-medium">{section.quality > 0 ? `${section.quality}%` : 'N/A'}</div>
              </div>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${
                  section.status === 'completed' ? 'bg-green-500' :
                  section.status === 'in-progress' ? 'bg-blue-500' :
                  section.status === 'error' ? 'bg-red-500' : 'bg-slate-300'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${section.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentGenerationDashboard;