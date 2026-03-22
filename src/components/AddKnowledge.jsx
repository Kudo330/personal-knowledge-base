import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { saveKnowledge } from '../lib/storage.js';
import { sanitizeKnowledge, validateKnowledge } from '../lib/validation.js';
import { PRESET_CATEGORIES } from '../lib/schema.js';

const initialFormData = {
  title: '',
  content: '',
  category: '',
  tags: [],
  source: '',
  sourceUrl: '',
  isFavorite: false,
  priority: 0
};

const AddKnowledge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    const nextTag = tagInput.trim();
    if (!nextTag || formData.tags.includes(nextTag)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, nextTag]
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validation = validateKnowledge(formData);
    if (!validation.isValid) {
      const nextErrors = validation.errors.reduce((accumulator, error) => {
        const field = error.split(' ')[0];
        accumulator[field] = error.replace(`${field} `, '');
        return accumulator;
      }, {});
      setErrors(nextErrors);
      return;
    }

    try {
      const now = new Date().toISOString();
      const sanitizedData = sanitizeKnowledge(formData);
      saveKnowledge({
        ...sanitizedData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      });

      toast.success('知识已保存');
      navigate('/');
    } catch (error) {
      console.error('保存知识失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-5 w-5" />
              返回首页
            </Link>
            <h1 className="text-xl font-medium text-foreground">添加知识</h1>
          </div>
          <button
            type="submit"
            form="add-knowledge-form"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
          >
            <Save className="mr-2 h-4 w-4" />
            保存
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <form id="add-knowledge-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
            <div className="mb-6">
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
                标题
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring ${
                  errors.title ? 'border-red-300' : 'border-input'
                }`}
                placeholder="请输入知识标题"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="mb-2 block text-sm font-medium text-foreground">
                内容
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={8}
                className={`w-full resize-y rounded-lg border px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring ${
                  errors.content ? 'border-red-300' : 'border-input'
                }`}
                placeholder="请输入知识内容"
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-foreground">
                分类
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring"
              >
                <option value="">选择分类</option>
                {PRESET_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-foreground">标签</label>
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary hover:text-primary/80"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 rounded-lg border border-input px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring"
                  placeholder="输入标签后按回车或点击添加"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-lg bg-secondary px-4 py-2.5 text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  添加
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="source" className="mb-2 block text-sm font-medium text-foreground">
                来源
              </label>
              <input
                id="source"
                name="source"
                type="text"
                value={formData.source}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-input px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring"
                placeholder="如：书名、网站名、课程名"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="sourceUrl" className="mb-2 block text-sm font-medium text-foreground">
                来源链接
              </label>
              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                className={`w-full rounded-lg border px-3 py-2.5 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring ${
                  errors.sourceUrl ? 'border-red-300' : 'border-input'
                }`}
                placeholder="https://example.com"
              />
              {errors.sourceUrl && <p className="mt-1 text-sm text-red-600">{errors.sourceUrl}</p>}
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFavorite"
                checked={formData.isFavorite}
                onChange={handleInputChange}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-foreground">保存后加入收藏</span>
            </label>
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddKnowledge;
