import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Hash, 
  Target, 
  BookOpen,
  Shield,
  TrendingUp
} from 'lucide-react';

interface ValidationCheck {
  id: string;
  category: string;
  name: string;
  status: 'pass' | 'fail' | 'warning';
  current: number | string;
  target: number | string;
  description: string;
}

const QualityValidation: React.FC = () => {
  const validationChecks: ValidationCheck[] = [
    {
      id: '1',
      category: 'Content Structure',
      name: 'Total Word Count',
      status: 'pass',
      current: 15420,
      target: '12000-20000',
      description: 'Optimal length for comprehensive eBook'
    },
    {
      id: '2',
      category: 'Content Structure',
      name: 'Chapter Count',
      status: 'pass',
      current: 8,
      target: '6-12',
      description: 'Balanced chapter distribution'
    },
    {
      id: '3',
      category: 'SEO Optimization',
      name: 'Primary Keyword Density',
      status: 'warning',
      current: '3.2%',
      target: '1-2%',
      description: 'Slightly high keyword density detected'
    },
    {
      id: '4',
      category: 'SEO Optimization',
      name: 'Secondary Keywords',
      status: 'pass',
      current: 12,
      target: '8-15',
      description: 'Good variety of related keywords'
    },
    {
      id: '5',
      category: 'Heading Structure',
      name: 'H1 Tags',
      status: 'pass',
      current: 8,
      target: '6-12',
      description: 'One H1 per chapter'
    },
    {
      id: '6',
      category: 'Heading Structure',
      name: 'H2 Tags',
      status: 'pass',
      current: 24,
      target: '15-30',
      description: 'Proper subsection hierarchy'
    },
    {
      id: '7',
      category: 'Amazon KDP',
      name: 'Content Guidelines',
      status: 'pass',
      current: 'Compliant',
      target: 'Compliant',
      description: 'Meets Amazon publishing standards'
    },
    {
      id: '8',
      category: 'Amazon KDP',
      name: 'Formatting Standards',
      status: 'fail',
      current: 'Issues Found',
      target: 'Compliant',
      description: 'Table of contents formatting needs adjustment'
    },
    {
      id: '9',
      category: 'Readability',
      name: 'Flesch Reading Score',
      status: 'pass',
      current: 68,
      target: '60-70',
      description: 'Standard reading level achieved'
    },
    {
      id: '10',
      category: 'Readability',
      name: 'Average Sentence Length',
      status: 'warning',
      current: 22,
      target: '15-20',
      description: 'Consider shorter sentences for better readability'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Content Structure':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      case 'SEO Optimization':
        return <Target className="h-5 w-5 text-blue-600" />;
      case 'Heading Structure':
        return <Hash className="h-5 w-5 text-purple-600" />;
      case 'Amazon KDP':
        return <Shield className="h-5 w-5 text-green-600" />;
      case 'Readability':
        return <TrendingUp className="h-5 w-5 text-orange-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-slate-600" />;
    }
  };

  const groupedChecks = validationChecks.reduce((acc, check) => {
    if (!acc[check.category]) {
      acc[check.category] = [];
    }
    acc[check.category].push(check);
    return acc;
  }, {} as Record<string, ValidationCheck[]>);

  const totalChecks = validationChecks.length;
  const passedChecks = validationChecks.filter(check => check.status === 'pass').length;
  const failedChecks = validationChecks.filter(check => check.status === 'fail').length;
  const warningChecks = validationChecks.filter(check => check.status === 'warning').length;
  const overallScore = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            Quality Validation & Compliance
          </h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Run Full Validation
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{overallScore}%</div>
            <div className="text-sm text-slate-600">Overall Score</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{passedChecks}</div>
            <div className="text-sm text-slate-600">Passed</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{warningChecks}</div>
            <div className="text-sm text-slate-600">Warnings</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{failedChecks}</div>
            <div className="text-sm text-slate-600">Failed</div>
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <motion.div
            className="bg-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${overallScore}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Validation Categories */}
      <div className="space-y-6">
        {Object.entries(groupedChecks).map(([category, checks], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-lg font-medium text-slate-900">{category}</h3>
            </div>

            <div className="space-y-3">
              {checks.map((check, index) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <div className="font-medium text-slate-900">{check.name}</div>
                      <div className="text-sm text-slate-600">{check.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Current</div>
                      <div className="font-medium">{check.current}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Target</div>
                      <div className="font-medium">{check.target}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(check.status)}`}>
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <h3 className="text-lg font-medium text-slate-900 mb-4">Recommended Actions</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <div className="font-medium text-red-800">Fix Table of Contents Formatting</div>
              <div className="text-sm text-red-700">Update TOC structure to meet Amazon KDP standards</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800">Reduce Keyword Density</div>
              <div className="text-sm text-yellow-700">Lower primary keyword usage from 3.2% to 1-2%</div>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-800">Improve Sentence Length</div>
              <div className="text-sm text-yellow-700">Break down longer sentences to improve readability</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QualityValidation;