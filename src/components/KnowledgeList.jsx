import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowLeft, Filter, Grid, List, Plus, Star, X } from 'lucide-react';
import { getAllKnowledge } from '../lib/storage.js';
import KnowledgeCard from './KnowledgeCard.jsx';
import SearchBar from './SearchBar.jsx';

const KnowledgeList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const knowledge = useMemo(() => getAllKnowledge(), []);

  const categories = useMemo(() => {
    return [...new Set(knowledge.map((item) => item.category).filter(Boolean))];
  }, [knowledge]);

  const allTags = useMemo(() => {
    return [...new Set(knowledge.flatMap((item) => item.tags || []))];
  }, [knowledge]);

  const filteredAndSortedKnowledge = useMemo(() => {
    const filtered = knowledge.filter((item) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.content.toLowerCase().includes(keyword) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(keyword));

      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => item.tags?.includes(tag));
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;
      const matchesActive = !showActiveOnly || !item.isArchived;

      return matchesSearch && matchesCategory && matchesTags && matchesFavorites && matchesActive;
    });

    filtered.sort((a, b) => {
      const timeA = new Date(a[sortBy]).getTime();
      const timeB = new Date(b[sortBy]).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return filtered;
  }, [knowledge, searchQuery, selectedCategory, selectedTags, showFavoritesOnly, showActiveOnly, sortBy, sortOrder]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setShowActiveOnly(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-5 w-5" />
              返回首页
            </Link>
            <h1 className="text-xl font-medium text-foreground">知识库</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center rounded-lg border border-border px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </button>
            <div className="flex items-center rounded-lg border border-border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Link
              to="/add"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              添加知识
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="搜索知识库..." />
        </div>

        {showFilters && (
          <div className="mb-6 rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-medium text-foreground">筛选条件</h3>
              <button
                onClick={clearAllFilters}
                className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="mr-1 h-4 w-4" />
                清除全部
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="mb-3 text-sm font-medium text-foreground">分类</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium text-foreground">标签</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-medium text-foreground">状态</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(event) => setShowFavoritesOnly(event.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <Star className="ml-2 mr-1 h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-foreground">仅显示收藏</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showActiveOnly}
                      onChange={(event) => setShowActiveOnly(event.target.checked)}
                      className="rounded border-input text-primary focus:ring-primary"
                    />
                    <Archive className="ml-2 mr-1 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">仅显示未归档</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            共找到 <span className="font-medium text-foreground">{filteredAndSortedKnowledge.length}</span> 条知识
          </p>

          <div className="flex items-center">
            <label className="mr-2 text-sm text-muted-foreground">排序:</label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded border border-input bg-background px-2 py-1 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-ring"
            >
              <option value="updatedAt">按更新时间</option>
              <option value="createdAt">按创建时间</option>
            </select>
            <button
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="ml-2 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              title={sortOrder === 'desc' ? '降序' : '升序'}
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        {filteredAndSortedKnowledge.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}
          >
            {filteredAndSortedKnowledge.map((item) => (
              <KnowledgeCard key={item.id} knowledge={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card py-16 text-center shadow-sm">
            <p className="mb-4 text-muted-foreground">没有找到匹配的知识条目</p>
            <Link
              to="/add"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              添加知识
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default KnowledgeList;
