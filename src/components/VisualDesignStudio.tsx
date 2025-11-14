import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Image, 
  Download, 
  Upload, 
  Eye, 
  Settings,
  FileImage,
  Layers,
  Wand2
} from 'lucide-react';

interface DesignElement {
  id: string;
  type: 'cover' | 'diagram' | 'background' | 'interactive';
  name: string;
  status: 'generating' | 'ready' | 'error';
  preview: string;
  prompt?: string;
}

const VisualDesignStudio: React.FC = () => {
  const [elements] = useState<DesignElement[]>([
    {
      id: '1',
      type: 'cover',
      name: 'eBook Cover Design',
      status: 'ready',
      preview: 'https://via.placeholder.com/300x400',
      prompt: 'Ultra-realistic cinematic eBook cover showing transformation journey with symbolic metaphor'
    },
    {
      id: '2',
      type: 'diagram',
      name: 'Habit Loop Framework',
      status: 'ready',
      preview: 'https://via.placeholder.com/400x300',
      prompt: '3D isometric diagram of habit formation loop in calming pastel tones'
    },
    {
      id: '3',
      type: 'background',
      name: 'Chapter Background',
      status: 'generating',
      preview: 'https://via.placeholder.com/400x200',
      prompt: 'Metaphorical fitness transformation texture with energy arcs and resilience patterns'
    },
    {
      id: '4',
      type: 'interactive',
      name: 'Progress Tracker',
      status: 'ready',
      preview: 'https://via.placeholder.com/300x200',
      prompt: 'A4 printable worksheet with motivational icons and soft athletic gradients'
    }
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cover':
        return <Image className="h-5 w-5 text-purple-600" />;
      case 'diagram':
        return <FileImage className="h-5 w-5 text-blue-600" />;
      case 'background':
        return <Layers className="h-5 w-5 text-green-600" />;
      case 'interactive':
        return <Wand2 className="h-5 w-5 text-orange-600" />;
      default:
        return <Image className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Palette className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-slate-900">Visual Design Studio</h2>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <Upload className="h-4 w-4 inline mr-2" />
            Upload Custom Assets
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">4</div>
            <div className="text-sm text-slate-600">Design Elements</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-slate-600">Ready</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-sm text-slate-600">Generating</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-600">0</div>
            <div className="text-sm text-slate-600">Errors</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">AI-Powered Design Generation</h3>
          <p className="text-sm text-blue-700">
            Automated cover design, diagram generation, and interactive elements using DALL·E 3 and 
            specialized visual models. All designs are optimized for A4 format and cross-platform compatibility.
          </p>
        </div>
      </motion.div>

      {/* Design Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {elements.map((element, index) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(element.type)}
                <div>
                  <h3 className="font-medium text-slate-900">{element.name}</h3>
                  <p className="text-sm text-slate-600 capitalize">{element.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(element.status)}`}>
                {element.status.toUpperCase()}
              </span>
            </div>

            <div className="mb-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                {element.status === 'generating' ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    <p className="text-sm text-slate-600">Generating...</p>
                  </div>
                ) : (
                  <Image className="h-12 w-12 text-slate-400" />
                )}
              </div>
              {element.prompt && (
                <p className="text-xs text-slate-600 italic">"{element.prompt}"</p>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => { if (element.status === 'ready') window.open(element.preview, '_blank'); }}
                disabled={element.status !== 'ready'}
                className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Eye className="h-4 w-4 inline mr-1" />
                Preview
              </button>
              <button
                onClick={() => {
                  if (element.status !== 'ready') return;
                  const a = document.createElement('a');
                  a.href = element.preview;
                  a.download = `${element.name.replace(/\s+/g,'_').toLowerCase()}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                disabled={element.status !== 'ready'}
                className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4 inline mr-1" />
                Download
              </button>
              <button className="px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Design Templates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <h3 className="text-lg font-medium text-slate-900 mb-4">Design Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
              <Palette className="h-8 w-8 text-indigo-600" />
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Modern Minimalist</h4>
            <p className="text-sm text-slate-600">Clean typography with subtle gradients</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg mb-3 flex items-center justify-center">
              <Layers className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Nature Inspired</h4>
            <p className="text-sm text-slate-600">Organic shapes with calming colors</p>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 flex items-center justify-center">
              <Wand2 className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="font-medium text-slate-900 mb-1">Bold & Dynamic</h4>
            <p className="text-sm text-slate-600">High-energy designs with strong contrasts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VisualDesignStudio;