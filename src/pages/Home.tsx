import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TopicInputForm from '../components/TopicInputForm';
import ContentGenerationDashboard from '../components/ContentGenerationDashboard';
import OutlineBuilder from '../components/OutlineBuilder';
import QualityValidation from '../components/QualityValidation';
import PublicationTools from '../components/PublicationTools';
import MarketResearchDashboard from '../components/MarketResearchDashboard';
import VisualDesignStudio from '../components/VisualDesignStudio';
import { 
  BookOpen, 
  Zap, 
  Target, 
  Shield, 
  Download,
  ArrowRight,
  BarChart3,
  Palette,
} from 'lucide-react';

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTopicSubmit = (_data?: any) => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setActiveSection('content-generation');
    }, 2000);
  };


  const sections = [
    { id: 'overview', name: 'Overview', icon: BookOpen },
    { id: 'market-research', name: 'Market Research', icon: BarChart3 },
    { id: 'topic-input', name: 'Topic Input', icon: Zap },
    { id: 'content-generation', name: 'Content Generation', icon: Target },
    { id: 'outline-builder', name: 'Outline Builder', icon: Target },
    { id: 'visual-design', name: 'Visual Design', icon: Palette },
    { id: 'quality-validation', name: 'Quality Check', icon: Shield },
    { id: 'publication', name: 'Publication', icon: Download },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'market-research':
        return <MarketResearchDashboard />;
      case 'topic-input':
        return <TopicInputForm onSubmit={handleTopicSubmit} isLoading={isGenerating} />;
      case 'content-generation':
        return <ContentGenerationDashboard />;
      case 'outline-builder':
        return <OutlineBuilder />;
      case 'visual-design':
        return <VisualDesignStudio />;
      case 'quality-validation':
        return <QualityValidation />;
      case 'publication':
        return <PublicationTools />;
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Create Professional eBooks with
                <span className="text-indigo-600"> AI-Powered Automation</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Transform your ideas into publication-ready eBooks through our comprehensive automated workflow system with multi-agent content generation and quality validation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setActiveSection('market-research')}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Start Research
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button onClick={() => setActiveSection('content-generation')} className="px-8 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  View Demo
                </button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <BarChart3 className="h-8 w-8 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Market Research</h3>
                </div>
                <p className="text-slate-600">
                  Real-time trend analysis, keyword research, and competitive intelligence with automated search query generation and market gap identification.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Multi-Agent Generation</h3>
                </div>
                <p className="text-slate-600">
                  Specialized writing agents for introductions, chapters, final thoughts, and bonus sections with brand guideline integration.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Palette className="h-8 w-8 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Visual Design Studio</h3>
                </div>
                <p className="text-slate-600">
                  Automated cover design, interior layout templates, diagram generation, and interactive element creation.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="h-8 w-8 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Content Architecture</h3>
                </div>
                <p className="text-slate-600">
                  Interactive outline generation with physics-based metaphor integration, chapter structuring, and transformation arc design.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Quality Assurance</h3>
                </div>
                <p className="text-slate-600">
                  Content validation, SEO optimization, readability scoring, and professional formatting checks.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-slate-200"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Download className="h-8 w-8 text-red-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Publication Hub</h3>
                </div>
                <p className="text-slate-600">
                  Multi-format export (EPUB, PDF, print), platform-specific optimization, and metadata management.
                </p>
              </motion.div>
            </div>

            {/* Workflow Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
                Nine-Stage Automated Workflow
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { stage: '1-3', title: 'Research & Planning', desc: 'SEO queries, outline, table of contents' },
                  { stage: '4-5', title: 'Content Creation', desc: 'Chapter writing and optimization' },
                  { stage: '6-9', title: 'Design & Polish', desc: 'Visuals, interactive elements, backgrounds' },
                ].map((item, index) => (
                  <div key={item.stage} className="text-center">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {item.stage}
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                    {index < 2 && (
                      <ArrowRight className="h-5 w-5 text-slate-400 mx-auto mt-4 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-indigo-600 text-white rounded-lg p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">10,000+</div>
                  <div className="text-indigo-200">eBooks Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-indigo-200">Quality Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-indigo-200">AI Generation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">50+</div>
                  <div className="text-indigo-200">Languages</div>
                </div>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{section.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Section Content */}
        {renderActiveSection()}
      </main>

      <Footer />
    </div>
  );
};

export default Home;