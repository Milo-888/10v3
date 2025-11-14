import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Search, 
  Users, 
  DollarSign,
  Target,
  Globe,
  Calendar
} from 'lucide-react';

interface TrendData {
  query: string;
  volume: number;
  growth: number;
  competition: 'low' | 'medium' | 'high';
}

interface MarketData {
  marketSize: string;
  growth: string;
  keyDrivers: string[];
  fastestRegion: string;
}

const MarketResearchDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [trends] = useState<TrendData[]>([
    { query: 'digital marketing tips', volume: 12500, growth: 15, competition: 'medium' },
    { query: 'SEO strategies 2025', volume: 8900, growth: 22, competition: 'high' },
    { query: 'social media marketing', volume: 18500, growth: 8, competition: 'high' },
    { query: 'content marketing guide', volume: 7200, growth: 18, competition: 'medium' },
    { query: 'email marketing automation', volume: 5600, growth: 25, competition: 'low' },
  ]);

  const [marketData] = useState<MarketData>({
    marketSize: '$48.4B - $50.42B',
    growth: '5.5% - 7.9% CAGR',
    keyDrivers: ['Digital Learning Platforms', 'AI-Driven Coaching', 'Mobile Apps', 'Virtual Coaching'],
    fastestRegion: 'Asia-Pacific'
  });

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-900">Market Research & Validation Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Market Size (2024)</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{marketData.marketSize}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Growth Rate</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{marketData.growth}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Fastest Region</span>
            </div>
            <div className="text-xl font-bold text-slate-900">{marketData.fastestRegion}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-slate-600">Books Segment CAGR</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">6.1%</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-slate-900 mb-3">Key Market Drivers</h3>
          <div className="flex flex-wrap gap-2">
            {marketData.keyDrivers.map((driver, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
              >
                {driver}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Trend Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Search className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-900">Real-time Trend Analysis</h2>
        </div>

        <div className="space-y-4">
          {trends.map((trend, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="font-medium text-slate-900">"{trend.query}"</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-slate-600">
                      <Users className="inline h-4 w-4 mr-1" />
                      {trend.volume.toLocaleString()} searches/month
                    </span>
                    <span className="text-sm text-green-600">
                      <TrendingUp className="inline h-4 w-4 mr-1" />
                      +{trend.growth}% growth
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCompetitionColor(trend.competition)}`}>
                  {trend.competition.toUpperCase()} competition
                </span>
                <button onClick={() => navigate('/analytics')} className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors">
                  Analyze
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Competitive Intelligence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-slate-200 p-6"
      >
        <div className="flex items-center space-x-2 mb-6">
          <Target className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-slate-900">Competitive Intelligence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Top Performing Books</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• "Atomic Habits" - 4.8★ (15M+ copies)</li>
              <li>• "Outlive" - 4.7★ (500K+ copies)</li>
              <li>• "Thinner Leaner Stronger" - 4.6★ (100K+ copies)</li>
            </ul>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Market Gaps Identified</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Actionable visual guides</li>
              <li>• AI-integrated coaching</li>
              <li>• Multi-path personalization</li>
            </ul>
          </div>

          <div className="p-4 border border-slate-200 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-2">Success Patterns</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Science-backed content</li>
              <li>• Framework-driven structure</li>
              <li>• Ecosystem integration</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MarketResearchDashboard;