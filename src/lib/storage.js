import { DEFAULT_KNOWLEDGE_ITEM, STORAGE_KEYS } from './schema.js';

export const getAllKnowledge = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_ITEMS);
    const items = raw ? JSON.parse(raw) : [];
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('获取知识数据失败:', error);
    return [];
  }
};

export const getKnowledgeById = (id) => {
  return getAllKnowledge().find((item) => item.id === id) || null;
};

export const saveKnowledge = (knowledge) => {
  try {
    const items = getAllKnowledge();
    const existingIndex = items.findIndex((item) => item.id === knowledge.id);
    const now = new Date().toISOString();

    const newItem = {
      ...DEFAULT_KNOWLEDGE_ITEM,
      ...knowledge,
      id: knowledge.id || generateId(),
      createdAt: knowledge.createdAt || now,
      updatedAt: now
    };

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...newItem,
        createdAt: items[existingIndex].createdAt || newItem.createdAt
      };
    } else {
      items.push(newItem);
    }

    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_ITEMS, JSON.stringify(items));
    return newItem;
  } catch (error) {
    console.error('保存知识数据失败:', error);
    throw error;
  }
};

export const deleteKnowledge = (id) => {
  try {
    const items = getAllKnowledge();
    const filteredItems = items.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_ITEMS, JSON.stringify(filteredItems));
    return true;
  } catch (error) {
    console.error('删除知识数据失败:', error);
    throw error;
  }
};

export const searchKnowledge = (query, filters = {}) => {
  try {
    let results = getAllKnowledge();

    if (query && query.trim()) {
      const searchTerm = query.toLowerCase().trim();
      results = results.filter((item) => {
        return (
          item.title?.toLowerCase().includes(searchTerm) ||
          item.content?.toLowerCase().includes(searchTerm) ||
          item.summary?.toLowerCase().includes(searchTerm) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      });
    }

    if (filters.category) {
      results = results.filter((item) => item.category === filters.category);
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((item) =>
        item.tags?.some((tag) => filters.tags.includes(tag))
      );
    }

    if (typeof filters.isFavorite === 'boolean') {
      results = results.filter((item) => item.isFavorite === filters.isFavorite);
    }

    if (typeof filters.isArchived === 'boolean') {
      results = results.filter((item) => item.isArchived === filters.isArchived);
    }

    return results;
  } catch (error) {
    console.error('搜索知识数据失败:', error);
    return [];
  }
};

export const getStatistics = () => {
  try {
    const items = getAllKnowledge();
    const categoryStats = {};
    const tagStats = {};

    items.forEach((item) => {
      if (item.category) {
        categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
      }

      if (Array.isArray(item.tags)) {
        item.tags.forEach((tag) => {
          tagStats[tag] = (tagStats[tag] || 0) + 1;
        });
      }
    });

    return {
      totalCount: items.length,
      favoriteCount: items.filter((item) => item.isFavorite).length,
      archivedCount: items.filter((item) => item.isArchived).length,
      categoryStats,
      tagStats,
      recentItems: [...items]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    };
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      totalCount: 0,
      favoriteCount: 0,
      archivedCount: 0,
      categoryStats: {},
      tagStats: {},
      recentItems: []
    };
  }
};

export const exportData = () => {
  return JSON.stringify(
    {
      knowledge: getAllKnowledge(),
      exportTime: new Date().toISOString(),
      version: '1.0'
    },
    null,
    2
  );
};

export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    if (!data.knowledge || !Array.isArray(data.knowledge)) {
      throw new Error('数据格式不正确');
    }

    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_ITEMS, JSON.stringify(data.knowledge));
    return true;
  } catch (error) {
    console.error('导入数据失败:', error);
    throw error;
  }
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
};

export const initializeSampleData = () => {
  const existingData = getAllKnowledge();
  if (existingData.length > 0) {
    return;
  }

  const now = Date.now();
  const sampleData = [
    {
      id: generateId(),
      title: 'React Hooks 最佳实践',
      content: 'useState 用于管理状态，useEffect 用于处理副作用。保持 Hook 调用顺序稳定，不要在条件判断中调用 Hook。',
      summary: 'React Hooks 的核心规则和常见实践。',
      category: 'skill',
      tags: ['React', 'JavaScript', '前端'],
      source: 'React 官方文档',
      isFavorite: true,
      createdAt: new Date(now - 86400000).toISOString(),
      updatedAt: new Date(now - 86400000).toISOString()
    },
    {
      id: generateId(),
      title: '番茄工作法学习笔记',
      content: '一个番茄钟通常是 25 分钟专注工作加 5 分钟休息。连续完成多个番茄钟后安排更长休息。',
      summary: '番茄工作法的基本原则。',
      category: 'study',
      tags: ['时间管理', '效率提升'],
      source: '《番茄工作法图解》',
      isFavorite: false,
      createdAt: new Date(now - 172800000).toISOString(),
      updatedAt: new Date(now - 172800000).toISOString()
    }
  ];

  localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_ITEMS, JSON.stringify(sampleData));
};
