import React from 'react';
import { BookOpen, Twitter, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold">eBookCraft</span>
            </div>
            <p className="text-slate-300 mb-4 max-w-md">
              Create, manage, and publish professional eBooks with our comprehensive automated workflow system.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/templates" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
              <li><a href="/templates" className="text-slate-300 hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Status</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2025 eBookCraft. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm mt-2 sm:mt-0">
            Built with ❤️ by <a rel="nofollow" target="_blank" href="https://meku.dev" className="text-indigo-400 hover:text-indigo-300 transition-colors">Meku.dev</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;