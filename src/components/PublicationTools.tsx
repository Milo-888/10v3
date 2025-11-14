import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Upload, 
  FileText, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Cloud,
  Share2,
  Settings,
  Eye
} from 'lucide-react';

interface PublicationFormat {
  id: string;
  name: string;
  format: string;
  status: 'ready' | 'processing' | 'error';
  size: string;
  lastGenerated: string;
}

const PublicationTools: React.FC = () => {
  const [formats] = useState<PublicationFormat[]>([
    {
      id: '1',
      name: 'EPUB eBook',
      format: 'epub',
      status: 'ready',
      size: '2.4 MB',
      lastGenerated: '2 hours ago'
    },
    {
      id: '2',
      name: 'PDF Document',
      format: 'pdf',
      status: 'ready',
      size: '3.1 MB',
      lastGenerated: '2 hours ago'
    },
    {
      id: '3',
      name: 'Kindle Format (MOBI)',
      format: 'mobi',
      status: 'processing',
      size: '2.2 MB',
      lastGenerated: 'Processing...'
    },
    {
      id: '4',
      name: 'Word Document',
      format: 'docx',
      status: 'ready',
      size: '1.8 MB',
      lastGenerated: '3 hours ago'
    }
  ]);

  const [distributionPlatforms] = useState([
    {
      id: '1',
      name: 'Amazon KDP',
      status: 'compatible',
      requirements: 'EPUB, PDF formats ready'
    },
    {
      id: '2',
      name: 'Apple Books',
      status: 'compatible',
      requirements: 'EPUB format ready'
    },
    {
      id: '3',
      name: 'Google Play Books',
      status: 'compatible',
      requirements: 'EPUB format ready'
    },
    {
      id: '4',
      name: 'Barnes & Noble',
      status: 'review-needed',
      requirements: 'Metadata optimization required'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
      case 'compatible':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'error':
      case 'review-needed':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'epub':
        return <BookOpen className="h-6 w-6 text-indigo-600" />;
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'mobi':
        return <BookOpen className="h-6 w-6 text-orange-600" />;
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Publication Formats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Download className="h-6 w-6 text-indigo-600 mr-2" />
            Publication Formats
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Generate All Formats
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format, index) => (
            <motion.div
              key={format.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getFormatIcon(format.format)}
                  <div>
                    <h3 className="font-medium text-slate-900">{format.name}</h3>
                    <p className="text-sm text-slate-600">{format.format.toUpperCase()}</p>
                  </div>
                </div>
                {getStatusIcon(format.status)}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                <span>Size: {format.size}</span>
                <span>{format.lastGenerated}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  disabled={format.status !== 'ready'}
                  className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Download className="h-4 w-4 inline mr-1" />
                  Download
                </button>
                <button className="px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Cloud Storage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Cloud className="h-6 w-6 text-indigo-600 mr-2" />
            Cloud Storage & Backup
          </h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4 inline mr-2" />
            Upload to Cloud
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Google Drive</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">Last sync: 1 hour ago</p>
            <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Sync Now
            </button>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-slate-500" />
              <span className="font-medium">Dropbox</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">Not connected</p>
            <button className="w-full px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50 transition-colors">
              Connect
            </button>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Cloud className="h-5 w-5 text-green-500" />
              <span className="font-medium">OneDrive</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">Last sync: 30 min ago</p>
            <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              Sync Now
            </button>
          </div>
        </div>
      </motion.div>

      {/* Distribution Platforms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Share2 className="h-6 w-6 text-indigo-600 mr-2" />
            Distribution Platform Compatibility
          </h2>
        </div>

        <div className="space-y-4">
          {distributionPlatforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(platform.status)}
                <div>
                  <h3 className="font-medium text-slate-900">{platform.name}</h3>
                  <p className="text-sm text-slate-600">{platform.requirements}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {platform.status === 'compatible' ? (
                  <button className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                    Ready to Publish
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors">
                    Review Required
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Export Options</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Complete eBook Package</h3>
            <p className="text-sm text-slate-600 mb-3">
              All formats, cover design, and metadata in a single ZIP file
            </p>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
              <Download className="h-4 w-4 inline mr-2" />
              Download Package
            </button>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Source Files</h3>
            <p className="text-sm text-slate-600 mb-3">
              Raw content, outline, and project files for future editing
            </p>
            <button className="w-full px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors">
              <Download className="h-4 w-4 inline mr-2" />
              Download Sources
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicationTools;