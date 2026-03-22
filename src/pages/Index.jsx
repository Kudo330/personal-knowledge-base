import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  Star,
  Tag,
  TrendingUp
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { getAllKnowledge, getStatistics, initializeSampleData, saveKnowledge } from '../lib/storage.js';
import KnowledgeCard from '../components/KnowledgeCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import StatsCard from '../components/StatsCard.jsx';
import { sanitizeKnowledge, validateKnowledge } from '../lib/validation.js';

const initialQuickAddData = {
  title: '',
  content: '',
  category: '',
  tags: []
};

const navigationItems = [
  { label: 'Knowledge', to: '/knowledge' },
  { label: 'Review', to: '/review' },
  { label: 'Add', to: '/add' },
];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddData, setQuickAddData] = useState(initialQuickAddData);
  const [tagInput, setTagInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeSampleData();
    setRefreshKey((prev) => prev + 1);
  }, []);

  const knowledge = useMemo(() => getAllKnowledge(), [refreshKey]);
  const stats = useMemo(() => getStatistics(), [refreshKey]);

  const filteredKnowledge = useMemo(() => {
    const keyword = searchQuery.toLowerCase();
    return knowledge.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(keyword))
      );
    });
  }, [knowledge, searchQuery]);

  const recentKnowledge = useMemo(() => {
    return [...knowledge]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  }, [knowledge]);

  const recentlyReviewed = useMemo(() => {
    return [...knowledge]
      .filter((item) => item.isFavorite)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3);
  }, [knowledge]);

  const highlightedKnowledge = recentKnowledge[0] || null;
  const categoryButtons = Object.entries(stats.categoryStats);

  const handleQuickAdd = (event) => {
    event.preventDefault();

    const validation = validateKnowledge(quickAddData);
    if (!validation.isValid) {
      toast.error('请先填写标题和内容');
      return;
    }

    const now = new Date().toISOString();
    const nextKnowledge = sanitizeKnowledge(quickAddData);

    saveKnowledge({
      ...nextKnowledge,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now
    });

    setQuickAddData(initialQuickAddData);
    setTagInput('');
    setShowQuickAdd(false);
    setRefreshKey((prev) => prev + 1);
    toast.success('知识已保存');
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || quickAddData.tags.includes(nextTag)) {
      return;
    }

    setQuickAddData((prev) => ({
      ...prev,
      tags: [...prev.tags, nextTag]
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuickAddData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleSearchSubmit = (keyword) => {
    const nextKeyword = keyword.trim();

    if (!nextKeyword) {
      navigate('/knowledge');
      return;
    }

    navigate(`/knowledge?search=${encodeURIComponent(nextKeyword)}`);
  };

  return (
    <div className="kb-shell min-h-screen bg-background text-foreground">
      <div className="kb-orb kb-orb-left" />
      <div className="kb-orb kb-orb-right" />
      <div className="kb-grid" />

      <header className="sticky top-0 z-20 border-b border-white/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-white/50 shadow-[0_10px_30px_rgba(255,255,255,0.35)]">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="kb-eyebrow mb-1">Personal archive</p>
              <h1 className="kb-cn-display-lg mb-0 text-[1.65rem] text-slate-950 sm:text-[1.95rem]">
                个人知识库
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-8 lg:flex">
            {navigationItems.map((item) => (
              <Link key={item.to} to={item.to} className="kb-toplink">
                {item.label}
              </Link>
            ))}
            <Link to="/knowledge" className="kb-toplink">
              Enter
            </Link>
          </div>

          <Link to="/add" className="kb-hero-button">
            <Plus className="h-4 w-4" />
            新建知识
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 lg:px-10 lg:pt-14">
        <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 px-6 py-8 shadow-[0_30px_80px_rgba(116,124,143,0.12)] backdrop-blur-md sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="kb-particles" />
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10 max-w-2xl">
              <p className="kb-eyebrow mb-4">VOL. 01 / DIGITAL MEMORY</p>
              <h2 className="kb-cn-display-xl mb-6 text-[1.8rem] text-slate-950 sm:text-[2.2rem] lg:text-[2.85rem] xl:text-[3.1rem]">
                让知识被清晰地整理与呈现
              </h2>
              <p className="kb-cn-body max-w-xl text-[0.98rem] leading-8 text-slate-600 sm:text-[1.05rem]">
                用更克制、更现代的方式归档你的想法、读书笔记和工作片段。搜索、收藏、分类与新增保持原有功能，视觉上改为展览画册式布局。
              </p>

              <div className="mt-8 max-w-2xl">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索标题、内容或标签" />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/knowledge" className="kb-hero-button">
                  浏览全部
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd((prev) => !prev)}
                  className="kb-muted-button"
                >
                  <Sparkles className="h-4 w-4" />
                  快速记录
                </button>
              </div>
            </div>

            <div className="relative z-10">
              <div className="kb-feature-frame mx-auto max-w-[30rem]">
                <div className="kb-feature-panel">
                  <div className="kb-feature-copy">
                    <p className="kb-eyebrow text-white/70">Curated focus</p>
                    <h3 className="kb-cn-display-lg mb-3 text-[2rem] text-white sm:text-[2.2rem]">
                      {highlightedKnowledge?.title || '知识在这里形成新的秩序'}
                    </h3>
                    <p
                      className="kb-cn-body mb-0 text-[0.92rem] leading-7"
                      style={{ color: 'rgba(226, 232, 240, 0.68)' }}
                    >
                      {highlightedKnowledge?.content?.slice(0, 140) || '建立统一的收藏、回顾与新增入口，让内容层次更清楚。'}
                    </p>
                  </div>
                  <div className="kb-feature-meta">
                    <span>{stats.totalCount} Items</span>
                    <span>{stats.favoriteCount} Favorites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mb-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="总知识数" value={stats.totalCount} icon={<BookOpen className="h-5 w-5" />} tone="ink" />
          <StatsCard title="收藏条目" value={stats.favoriteCount} icon={<Star className="h-5 w-5" />} tone="gold" />
          <StatsCard title="归档条目" value={stats.archivedCount} icon={<Archive className="h-5 w-5" />} tone="slate" />
          <StatsCard title="分类数量" value={categoryButtons.length} icon={<Tag className="h-5 w-5" />} tone="blue" />
        </div>

        <section className="mb-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="kb-panel overflow-hidden">
            <button
              onClick={() => setShowQuickAdd((prev) => !prev)}
              className="flex w-full items-center justify-between border-b border-slate-200/70 px-6 py-5 text-left"
            >
              <div>
                <p className="kb-eyebrow mb-2">Compose</p>
                <h2 className="kb-cn-display-lg mb-0 text-[2rem] text-slate-950">快速添加知识</h2>
              </div>
              {showQuickAdd ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
            </button>

            {showQuickAdd && (
              <div className="px-6 py-6">
                <form onSubmit={handleQuickAdd} className="space-y-4">
                  <input
                    type="text"
                    value={quickAddData.title}
                    onChange={(event) => setQuickAddData((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="标题"
                    className="kb-input"
                  />
                  <textarea
                    value={quickAddData.content}
                    onChange={(event) => setQuickAddData((prev) => ({ ...prev, content: event.target.value }))}
                    placeholder="记录这条知识的核心内容"
                    rows={5}
                    className="kb-input min-h-[9rem] resize-none"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="输入标签后回车"
                      className="kb-input flex-1"
                    />
                    <button type="button" onClick={handleAddTag} className="kb-muted-button whitespace-nowrap">
                      添加标签
                    </button>
                  </div>

                  {quickAddData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {quickAddData.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary"
                        >
                          {tag} ×
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button type="submit" className="kb-hero-button">
                      保存条目
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="kb-panel px-6 py-6">
            <p className="kb-eyebrow mb-3">Atlas</p>
            <h2 className="kb-cn-display-lg mb-5 text-[2rem] text-slate-950">分类视图</h2>
            <div className="flex flex-wrap gap-3">
              {categoryButtons.length > 0 ? (
                categoryButtons.map(([category, count]) => (
                  <button
                    key={category}
                    className="rounded-full border border-slate-200 bg-white/60 px-4 py-2 text-sm tracking-[0.12em] text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {category.toUpperCase()} / {count}
                  </button>
                ))
              ) : (
                <p className="mb-0 text-slate-500">还没有分类数据，先添加一条知识。</p>
              )}
            </div>
          </div>
        </section>

        {recentlyReviewed.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-end justify-between gap-6">
              <div>
                <p className="kb-eyebrow mb-2">Highlights</p>
                <h2 className="kb-cn-display-lg mb-0 text-[2.35rem] text-slate-950">最近回顾</h2>
              </div>
              <Link to="/knowledge" className="kb-inline-link">
                查看全部
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {recentlyReviewed.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <p className="kb-eyebrow mb-2">Latest additions</p>
              <h2 className="kb-cn-display-lg mb-0 text-[2.35rem] text-slate-950">最近添加</h2>
            </div>
            <Link to="/knowledge" className="kb-inline-link">
              进入知识库
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentKnowledge.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentKnowledge.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
            </div>
          ) : (
            <div className="kb-panel px-8 py-16 text-center">
              <BookOpen className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="kb-cn-display-lg mb-3 text-[2.2rem] text-slate-950">这里还没有展品</h3>
              <p className="kb-cn-body mx-auto max-w-md text-slate-600">先创建你的第一条知识记录，页面会自动形成新的陈列结构。</p>
            </div>
          )}
        </section>

        {searchQuery && (
          <section>
            <div className="mb-6">
              <p className="kb-eyebrow mb-2">Search results</p>
              <h2 className="kb-cn-display-lg mb-0 text-[2.35rem] text-slate-950">
                搜索结果 ({filteredKnowledge.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredKnowledge.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
