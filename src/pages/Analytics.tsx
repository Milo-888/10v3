import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Analytics & Performance Tracking</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Track content performance, reader engagement metrics, and optimization suggestions.
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total eBooks</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">24</div>
              <div className="text-sm text-green-600 mt-1">+12% from last month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Readers</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">1,247</div>
              <div className="text-sm text-green-600 mt-1">+8% from last month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">$12,847</div>
              <div className="text-sm text-green-600 mt-1">+15% from last month</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. Rating</span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">4.8</div>
              <div className="text-sm text-green-600 mt-1">+0.2 from last month</div>
            </motion.div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <LineChart className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Reader Engagement Over Time</h3>
              </div>
              <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-slate-400" />
                <span className="ml-2 text-slate-500 dark:text-slate-400">Chart visualization</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center space-x-2 mb-4">
                <PieChart className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Content Performance by Category</h3>
              </div>
              <div className="h-64 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <PieChart className="h-12 w-12 text-slate-400" />
                <span className="ml-2 text-slate-500 dark:text-slate-400">Chart visualization</span>
              </div>
            </motion.div>
          </div>

          {/* Conversion Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Activity className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Conversion Funnel Analysis</h3>
            </div>

            <div className="space-y-4">
              {[
                { stage: 'Visitors', count: 10000, percentage: 100, color: 'bg-slate-200' },
                { stage: 'Downloads', count: 2500, percentage: 25, color: 'bg-blue-200' },
                { stage: 'Readers', count: 1800, percentage: 18, color: 'bg-indigo-200' },
                { stage: 'Conversions', count: 450, percentage: 4.5, color: 'bg-green-200' },
              ].map((item) => (
                <div key={item.stage} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">{item.stage}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`h-4 rounded ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Performing Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4">Top Performing eBooks</h3>
            
            <div className="space-y-4">
              {[
                { title: 'Digital Marketing Mastery', readers: 342, rating: 4.9, revenue: 2847 },
                { title: 'SEO Strategies 2025', readers: 298, rating: 4.8, revenue: 2156 },
                { title: 'Content Marketing Guide', readers: 267, rating: 4.7, revenue: 1894 },
                { title: 'Social Media Automation', readers: 234, rating: 4.6, revenue: 1657 },
              ].map((book, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{book.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                        <span>{book.readers} readers</span>
                        <span>★ {book.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-slate-900 dark:text-slate-100">${book.revenue}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;