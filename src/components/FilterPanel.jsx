import React from 'react';
import { Star, Archive, X } from 'lucide-react';
import { getAllKnowledge } from '../lib/storage.js';

const FilterPanel = ({
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showArchivedOnly,
  setShowArchivedOnly
}) => {
  const knowledge = getAllKnowledge();

  // 获取所有分类
  const categories = [...new Set(knowledge.map(item => item.category).filter(Boolean))];

  // 获取所有标签
  const allTags = [...new Set(knowledge.flatMap(item => item.tags || []))];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setShowFavoritesOnly(false);
    setShowArchivedOnly(false);
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-medium text-foreground">筛选条件</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
        >
          <X className="h-4 w-4 mr-1" />
          清除全部
        </button>
      </div>

      <div className="space-y-6">
        {/* 分类筛选 */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">分类</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
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

        {/* 标签筛选 */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
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

        {/* 状态筛选 */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">状态</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <Star className="h-4 w-4 ml-2 mr-1 text-yellow-500" />
              <span className="text-sm text-foreground">仅显示收藏</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showArchivedOnly}
                onChange={(e) => setShowArchivedOnly(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <Archive className="h-4 w-4 ml-2 mr-1 text-muted-foreground" />
              <span className="text-sm text-foreground">仅显示归档</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
