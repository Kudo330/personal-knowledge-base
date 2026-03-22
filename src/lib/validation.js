import { PRESET_CATEGORIES } from './schema.js';

export const validateKnowledge = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push('title 标题不能为空');
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('content 内容不能为空');
  }

  if (data.title && data.title.trim().length > 200) {
    errors.push('title 标题长度不能超过 200 个字符');
  }

  if (data.summary && data.summary.trim().length > 500) {
    errors.push('summary 摘要长度不能超过 500 个字符');
  }

  if (data.category && !isValidCategory(data.category)) {
    errors.push('category 分类不存在');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('tags 标签必须是数组');
  }

  if (data.sourceUrl && !isValidUrl(data.sourceUrl)) {
    errors.push('sourceUrl 来源链接格式不正确');
  }

  if (data.priority !== undefined && data.priority !== null) {
    const priority = Number(data.priority);
    if (Number.isNaN(priority) || priority < 0 || priority > 5) {
      errors.push('priority 优先级必须在 0 到 5 之间');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const isValidCategory = (category) => {
  return PRESET_CATEGORIES.some((item) => item.id === category);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeKnowledge = (data) => {
  return {
    ...data,
    title: data.title?.trim() || '',
    content: data.content?.trim() || '',
    summary: data.summary?.trim() || '',
    category: data.category?.trim() || '',
    tags: Array.isArray(data.tags)
      ? data.tags.map((tag) => tag.trim()).filter(Boolean)
      : [],
    source: data.source?.trim() || '',
    sourceUrl: data.sourceUrl?.trim() || '',
    isFavorite: Boolean(data.isFavorite),
    isArchived: Boolean(data.isArchived),
    priority: Math.max(0, Math.min(5, Number.parseInt(data.priority, 10) || 0))
  };
};

export const generateAISummary = (content) => {
  if (!content) {
    return '';
  }

  const sentences = content
    .split(/[。！？\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return '';
  }

  const summary = `${sentences.slice(0, 3).join('。')}。`;
  return summary.length > 500 ? `${summary.slice(0, 497)}...` : summary;
};

export const extractKeywords = (content) => {
  if (!content) {
    return [];
  }

  const commonWords = [
    '的', '了', '和', '是', '在', '有', '我', '你', '他', '她', '它',
    '这', '那', '就', '也', '都', '要', '会', '能', '可以', '可能',
    '应该', '一定', '必须', '需要'
  ];

  const words = content.match(/[\u4e00-\u9fa5a-zA-Z0-9]+/g) || [];
  const wordCount = {};

  words.forEach((word) => {
    if (word.length > 1 && !commonWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  return Object.entries(wordCount)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([word]) => word);
};
