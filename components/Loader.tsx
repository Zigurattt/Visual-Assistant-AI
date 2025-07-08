import React from 'react';

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => (
  <div className="absolute inset-0 bg-slate-50 bg-opacity-80 dark:bg-black dark:bg-opacity-80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-4 border-slate-400 dark:border-slate-500 border-t-cyan-400 rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-200">{text}</p>
  </div>
);

export default Loader;