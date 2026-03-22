import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Archive,
  ArrowLeft,
  Calendar,
  Edit3,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Star,
  Tag,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { deleteKnowledge, getKnowledgeById, saveKnowledge } from '../lib/storage.js';
import { PRESET_CATEGORIES } from '../lib/schema.js';

const buildFallbackSummary = (knowledge) => {
  if (knowledge.aiSummary) {
    return knowledge.aiSummary;
  }

  if (knowledge.summary) {
    return knowledge.summary;
  }

  const sentences = String(knowledge.content || '')
    .split(/[。！？\n]/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return '当前条目还没有 AI 总结。MVP 阶段可在保存后调用大模型自动生成摘要、建议分类和标签。';
  }

  return `${sentences.slice(0, 2).join('。')}。`;
};

const buildKeyPoints = (knowledge) => {
  const points = [];

  if (knowledge.category) {
    points.push(`分类已归入 ${knowledge.category}`);
  }

  if (knowledge.tags?.length) {
    points.push(`包含 ${knowledge.tags.length} 个标签，便于后续检索`);
  }

  if (knowledge.reviewAt) {
    points.push(`已设置回顾时间 ${format(new Date(knowledge.reviewAt), 'yyyy年MM月dd日', { locale: zhCN })}`);
  }

  if (knowledge.source) {
    points.push(`来源记录为 ${knowledge.source}`);
  }

  if (points.length === 0) {
    points.push('建议后续补充来源、标签和回顾时间，增强知识复用效率');
  }

  return points.slice(0, 4);
};

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState(() => getKnowledgeById(id));

  const category = useMemo(() => {
    return PRESET_CATEGORIES.find((item) => item.id === knowledge?.category) || null;
  }, [knowledge]);

  const aiSummary = useMemo(() => {
    if (!knowledge) {
      return '';
    }
    return buildFallbackSummary(knowledge);
  }, [knowledge]);

  const keyPoints = useMemo(() => {
    if (!knowledge) {
      return [];
    }
    return buildKeyPoints(knowledge);
  }, [knowledge]);

  if (!knowledge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-medium text-foreground">知识条目不存在</h1>
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const updateKnowledge = (patch, successMessage) => {
    const nextKnowledge = saveKnowledge({
      ...knowledge,
      ...patch
    });
    setKnowledge(nextKnowledge);
    toast.success(successMessage);
  };

  const handleToggleFavorite = () => {
    updateKnowledge(
      { isFavorite: !knowledge.isFavorite },
      knowledge.isFavorite ? '已取消收藏' : '已加入收藏'
    );
  };

  const handleToggleArchive = () => {
    updateKnowledge(
      { isArchived: !knowledge.isArchived },
      knowledge.isArchived ? '已取消归档' : '已归档'
    );
  };

  const handleDelete = () => {
    if (!window.confirm('确定要删除这条知识吗？此操作无法恢复。')) {
      return;
    }

    deleteKnowledge(knowledge.id);
    toast.success('知识已删除');
    navigate('/');
  };

  const handleEditEntry = () => {
    toast('MVP 版本先保留查看能力，编辑入口可在下一步接成表单页。', {
      icon: '✎'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              to="/"
              className="mr-4 flex items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="mr-1 h-5 w-5" />
              返回首页
            </Link>
            <h1 className="text-xl font-medium text-foreground">知识详情</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEditEntry}
              className="inline-flex items-center rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              编辑入口
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`rounded-lg p-2 transition-colors ${
                knowledge.isFavorite
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              title={knowledge.isFavorite ? '取消收藏' : '加入收藏'}
            >
              <Star className={`h-5 w-5 ${knowledge.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleToggleArchive}
              className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
              title={knowledge.isArchived ? '取消归档' : '归档'}
            >
              <Archive className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
              title="删除"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <section className="rounded-[1.8rem] border border-border/60 bg-white/70 shadow-[0_20px_60px_rgba(117,126,145,0.10)] backdrop-blur-md">
            <div className="border-b border-border/60 p-7">
              <div className="mb-5 flex items-start justify-between gap-6">
                <div>
                  <p className="kb-eyebrow mb-2">Knowledge entry</p>
                  <h1 className="kb-cn-display-lg mb-0 text-[2.4rem] text-slate-950">
                    {knowledge.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  {knowledge.isFavorite && <Star className="h-5 w-5 fill-current text-yellow-500" />}
                  {knowledge.isArchived && <Archive className="h-5 w-5 text-slate-400" />}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>创建于 {format(new Date(knowledge.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>更新于 {format(new Date(knowledge.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
                </div>
                {knowledge.reviewAt && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>回顾时间 {format(new Date(knowledge.reviewAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8 p-7">
              <div>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">正文</h2>
                <div className="kb-cn-body whitespace-pre-wrap text-[1rem] leading-8 text-slate-700">
                  {knowledge.content}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="mb-0 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">元信息</h2>
                <div className="flex flex-wrap gap-3">
                  {category && (
                    <span
                      className="rounded-full px-4 py-2 text-sm font-medium text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.name}
                    </span>
                  )}
                  {knowledge.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                    >
                      <Tag className="mr-2 h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {knowledge.source && (
                <div className="rounded-2xl bg-slate-900/[0.035] p-5">
                  <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">来源</h2>
                  <div className="flex flex-wrap items-center gap-2 text-slate-600">
                    <ExternalLink className="h-4 w-4" />
                    <span>{knowledge.source}</span>
                    {knowledge.sourceUrl && (
                      <a
                        href={knowledge.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-primary underline transition-colors hover:text-primary/80"
                      >
                        查看原文
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.8rem] border border-border/60 bg-[#4f6bad]/95 p-6 text-white shadow-[0_25px_70px_rgba(53,81,136,0.25)]">
              <div className="mb-4 flex items-center gap-2 text-white/75">
                <Sparkles className="h-4 w-4" />
                <p className="kb-eyebrow text-white/75">AI summary</p>
              </div>
              <h2 className="kb-cn-display-lg mb-4 text-[1.9rem] text-white">AI 总结区</h2>
              <p className="kb-cn-body text-[0.96rem] leading-7 text-white/84">{aiSummary}</p>
            </section>

            <section className="rounded-[1.8rem] border border-border/60 bg-white/70 p-6 shadow-[0_20px_60px_rgba(117,126,145,0.10)] backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-slate-500">
                <Lightbulb className="h-4 w-4" />
                <p className="kb-eyebrow mb-0">Key points</p>
              </div>
              <h2 className="kb-cn-display-lg mb-4 text-[1.8rem] text-slate-950">关键信息</h2>
              <ul className="space-y-3">
                {keyPoints.map((point) => (
                  <li
                    key={point}
                    className="kb-cn-body rounded-2xl bg-slate-900/[0.035] px-4 py-3 text-[0.94rem] leading-7 text-slate-600"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[1.8rem] border border-dashed border-primary/25 bg-primary/[0.04] p-6">
              <p className="kb-eyebrow mb-3 text-primary/70">MVP scope</p>
              <h2 className="kb-cn-display-lg mb-3 text-[1.65rem] text-slate-950">当前功能范围</h2>
              <div className="space-y-2 text-sm leading-7 text-slate-600">
                <p>已支持查看完整正文、来源、分类、标签、创建时间、收藏、归档和删除。</p>
                <p>编辑入口已预留，下一步可接入表单页或侧边抽屉。</p>
                <p>AI 总结区已就位，适合后续接入自动摘要、自动标签和回顾问题生成。</p>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeDetail;
