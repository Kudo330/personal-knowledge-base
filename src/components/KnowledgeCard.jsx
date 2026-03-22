import React from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowUpRight, Calendar, ExternalLink, Star } from 'lucide-react';
import { format } from 'date-fns';
import { PRESET_CATEGORIES } from '../lib/schema.js';

const getCategoryMeta = (categoryId) => {
  return PRESET_CATEGORIES.find((item) => item.id === categoryId) || null;
};

const KnowledgeCard = ({ knowledge }) => {
  const category = getCategoryMeta(knowledge.category);
  const contentPreview =
    knowledge.content.length > 120 ? `${knowledge.content.slice(0, 120)}...` : knowledge.content;

  return (
    <article className="kb-card group">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-600">
                {category.name}
              </span>
            )}
            {knowledge.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-900/5 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-slate-500"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="kb-cn-display-lg mb-0 text-[2rem] text-slate-950 transition-colors group-hover:text-primary">
            {knowledge.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2 pt-1">
          {knowledge.isFavorite && <Star className="h-4 w-4 fill-current text-amber-500" />}
          {knowledge.isArchived && <Archive className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      <p className="kb-cn-body mb-6 text-[0.95rem] leading-7 text-slate-600">{contentPreview}</p>

      <div className="mt-auto space-y-4">
        {knowledge.source && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ExternalLink className="h-4 w-4" />
            <span className="truncate">{knowledge.source}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs uppercase tracking-[0.14em] text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(knowledge.createdAt), 'MM.dd')}</span>
          </div>
          <Link
            to={`/knowledge/${knowledge.id}`}
            className="inline-flex items-center gap-2 text-slate-700 transition-colors hover:text-primary"
          >
            查看
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default KnowledgeCard;
