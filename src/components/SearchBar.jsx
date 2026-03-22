import React from 'react';
import { Search, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ value, onChange, onSubmit, placeholder = '搜索...' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    if (typeof onSubmit === 'function') {
      onSubmit(value);
      return;
    }

    const keyword = value.trim();
    if (location.pathname === '/knowledge') {
      if (keyword) {
        navigate(`/knowledge?search=${encodeURIComponent(keyword)}`);
      } else {
        navigate('/knowledge');
      }
      return;
    }

    if (keyword) {
      navigate(`/knowledge?search=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/knowledge');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleSubmit}
        aria-label="搜索"
        className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-900/5 hover:text-slate-700"
      >
        <Search className="h-5 w-5" />
      </button>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        className="h-14 w-full rounded-full border border-white/70 bg-white/70 pl-14 pr-14 text-sm tracking-[0.06em] text-slate-700 shadow-[0_18px_40px_rgba(117,126,145,0.10)] outline-none backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-primary/40 focus:bg-white focus:ring-2 focus:ring-primary/10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-900/5 hover:text-slate-700"
          aria-label="清空搜索"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
