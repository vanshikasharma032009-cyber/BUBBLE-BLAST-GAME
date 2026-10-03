import { ArrowLeft } from 'lucide-react';

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className="absolute top-4 left-4 z-50 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 shadow-lg transition-all active:scale-95"
      aria-label="Back"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}
