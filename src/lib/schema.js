export const KnowledgeSchema = {
  id: {
    type: 'string',
    required: true,
    description: '唯一标识符，使用 UUID'
  },
  title: {
    type: 'string',
    required: true,
    description: '知识标题，最长 200 个字符'
  },
  content: {
    type: 'text',
    required: true,
    description: '知识正文内容'
  },
  summary: {
    type: 'text',
    required: false,
    description: '内容摘要，最长 500 个字符'
  },
  category: {
    type: 'string',
    required: false,
    description: '知识分类'
  },
  tags: {
    type: 'array',
    required: false,
    description: '标签列表'
  },
  source: {
    type: 'string',
    required: false,
    description: '知识来源'
  },
  sourceUrl: {
    type: 'string',
    required: false,
    description: '来源链接'
  },
  isFavorite: {
    type: 'boolean',
    required: false,
    default: false,
    description: '是否收藏'
  },
  isArchived: {
    type: 'boolean',
    required: false,
    default: false,
    description: '是否归档'
  },
  createdAt: {
    type: 'datetime',
    required: true,
    description: '创建时间'
  },
  updatedAt: {
    type: 'datetime',
    required: true,
    description: '更新时间'
  },
  reviewAt: {
    type: 'datetime',
    required: false,
    description: '下次复习时间'
  },
  lastReviewedAt: {
    type: 'datetime',
    required: false,
    description: '最近复习时间'
  },
  aiSummary: {
    type: 'text',
    required: false,
    description: 'AI 摘要'
  },
  aiKeywords: {
    type: 'array',
    required: false,
    description: 'AI 关键词'
  },
  contentType: {
    type: 'enum',
    required: false,
    default: 'text',
    description: '内容类型'
  },
  priority: {
    type: 'number',
    required: false,
    default: 0,
    description: '优先级，范围 0 到 5'
  }
};

export const PRESET_CATEGORIES = [
  { id: 'study', name: '学习笔记', color: '#3B82F6' },
  { id: 'work', name: '工作要点', color: '#10B981' },
  { id: 'reading', name: '读书心得', color: '#F59E0B' },
  { id: 'skill', name: '技能提升', color: '#8B5CF6' },
  { id: 'inspiration', name: '灵感创意', color: '#EF4444' }
];

export const STORAGE_KEYS = {
  KNOWLEDGE_ITEMS: 'knowledge_items',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  SETTINGS: 'app_settings'
};

export const DEFAULT_KNOWLEDGE_ITEM = {
  id: '',
  title: '',
  content: '',
  summary: '',
  category: '',
  tags: [],
  source: '',
  sourceUrl: '',
  isFavorite: false,
  isArchived: false,
  createdAt: '',
  updatedAt: '',
  reviewAt: null,
  lastReviewedAt: null,
  aiSummary: '',
  aiKeywords: [],
  contentType: 'text',
  priority: 0
};
