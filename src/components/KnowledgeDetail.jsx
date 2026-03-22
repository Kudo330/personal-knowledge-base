import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowLeft, Calendar, ExternalLink, Star, Tag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { deleteKnowledge, getKnowledgeById, saveKnowledge } from '../lib/storage.js';
import { PRESET_CATEGORIES } from '../lib/schema.js';

const KnowledgeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [knowledge, setKnowledge] = useState(() => getKnowledgeById(id));

  const category = useMemo(() => {
    return PRESET_CATEGORIES.find((item) => item.id === knowledge?.category) || null;
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
            <h1 className="text-xl font-medium text-foreground">知识详情</h1>
          </div>
          <div className="flex items-center space-x-3">
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

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-border/50 bg-card shadow-sm">
          <div className="border-b border-border/50 p-6">
            <div className="mb-4 flex items-start justify-between">
              <h1 className="flex-1 text-2xl font-medium text-foreground">{knowledge.title}</h1>
              <div className="ml-4 flex items-center space-x-2">
                {knowledge.isFavorite && <Star className="h-5 w-5 fill-current text-yellow-500" />}
                {knowledge.isArchived && <Archive className="h-5 w-5 text-muted-foreground" />}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  创建于 {format(new Date(knowledge.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  更新于 {format(new Date(knowledge.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="prose mb-6 max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                {knowledge.content}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {category && (
                <span
                  className="rounded-full px-3 py-1 text-sm font-medium text-white"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name}
                </span>
              )}
              {knowledge.tags?.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            {knowledge.source && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">来源</h3>
                <div className="flex items-center text-muted-foreground">
                  <ExternalLink className="mr-2 h-4 w-4" />
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
        </div>
      </main>
    </div>
  );
};

export default KnowledgeDetail;
