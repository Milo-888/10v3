import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Templates: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">eBook Templates</h1>
          <p className="text-lg text-slate-600 mb-8">
            Ask Meku to generate content for this page.
          </p>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            <p className="text-slate-500">Coming soon...</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;