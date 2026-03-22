import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CalendarClock, EyeOff, Sparkles } from 'lucide-react';
import { format, isToday, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getAllKnowledge } from '../lib/storage.js';
import KnowledgeCard from '../components/KnowledgeCard.jsx';

const Review = () => {
  const knowledge = useMemo(() => getAllKnowledge(), []);

  const recentlyAdded = useMemo(() => {
    return [...knowledge]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [knowledge]);

  const reviewLater = useMemo(() => {
    return knowledge
      .filter((item) => item.reviewAt)
      .sort((a, b) => new Date(a.reviewAt) - new Date(b.reviewAt))
      .slice(0, 4);
  }, [knowledge]);

  const dueToday = useMemo(() => {
    return knowledge
      .filter((item) => item.reviewAt && isToday(new Date(item.reviewAt)))
      .sort((a, b) => new Date(a.reviewAt) - new Date(b.reviewAt))
      .slice(0, 4);
  }, [knowledge]);

  const notRecentlyViewed = useMemo(() => {
    const threeDaysAgo = subDays(new Date(), 3);
    return knowledge
      .filter((item) => {
        if (!item.lastReviewedAt) {
          return true;
        }
        return new Date(item.lastReviewedAt) < threeDaysAgo;
      })
      .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
      .slice(0, 4);
  }, [knowledge]);

  const totalReviewCandidates = new Set([
    ...reviewLater.map((item) => item.id),
    ...dueToday.map((item) => item.id),
    ...notRecentlyViewed.map((item) => item.id)
  ]).size;

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
            <h1 className="text-xl font-medium text-foreground">今日回顾</h1>
          </div>
          <Link
            to="/knowledge"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow"
          >
            查看知识库
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-[1.8rem] border border-border/60 bg-white/70 p-7 shadow-[0_20px_60px_rgba(117,126,145,0.10)] backdrop-blur-md">
          <p className="kb-eyebrow mb-3">Review hub</p>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h2 className="kb-cn-display-lg mb-4 text-[2.4rem] text-slate-950">让知识重新回到你的注意力里</h2>
              <p className="kb-cn-body max-w-2xl text-[1rem] leading-8 text-slate-600">
                “今日回顾”把最值得再看一眼的知识集中起来。它不依赖复杂记忆算法，只提供一个简单、可演示、能体现产品价值的复习入口。
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl bg-slate-900/[0.04] p-5">
                <p className="kb-eyebrow mb-2">Today</p>
                <p className="font-display mb-0 text-5xl leading-none text-slate-950">{dueToday.length}</p>
                <p className="mt-2 text-sm text-slate-500">今日待回顾</p>
              </div>
              <div className="rounded-2xl bg-slate-900/[0.04] p-5">
                <p className="kb-eyebrow mb-2">Queue</p>
                <p className="font-display mb-0 text-5xl leading-none text-slate-950">{totalReviewCandidates}</p>
                <p className="mt-2 text-sm text-slate-500">候选条目</p>
              </div>
              <div className="rounded-2xl bg-slate-900/[0.04] p-5">
                <p className="kb-eyebrow mb-2">Date</p>
                <p className="mb-0 text-lg text-slate-950">{format(new Date(), 'MM月dd日', { locale: zhCN })}</p>
                <p className="mt-2 text-sm text-slate-500">当前日期</p>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-10">
          <section>
            <div className="mb-5 flex items-center gap-3">
              <CalendarClock className="h-5 w-5 text-primary" />
              <div>
                <h3 className="kb-cn-display-lg mb-1 text-[2rem] text-slate-950">今日待回顾</h3>
                <p className="text-sm text-slate-500">用户手动设置了回顾时间，且今天需要再看一眼的知识</p>
              </div>
            </div>
            {dueToday.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {dueToday.map((item) => (
                  <KnowledgeCard key={item.id} knowledge={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-slate-500">
                今天还没有明确标记的回顾条目。
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="kb-cn-display-lg mb-1 text-[2rem] text-slate-950">最近添加</h3>
                <p className="text-sm text-slate-500">新近沉淀的知识，最适合进行第一次回顾</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {recentlyAdded.map((item) => (
                <KnowledgeCard key={item.id} knowledge={item} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3">
              <EyeOff className="h-5 w-5 text-primary" />
              <div>
                <h3 className="kb-cn-display-lg mb-1 text-[2rem] text-slate-950">最近未查看</h3>
                <p className="text-sm text-slate-500">缺少回顾记录或最近几天没有被重新打开的知识</p>
              </div>
            </div>
            {notRecentlyViewed.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {notRecentlyViewed.map((item) => (
                  <KnowledgeCard key={item.id} knowledge={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-slate-500">
                当前所有知识都在最近查看过。
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div>
                <h3 className="kb-cn-display-lg mb-1 text-[2rem] text-slate-950">稍后回顾</h3>
                <p className="text-sm text-slate-500">已经设置回顾时间，但还没到期的条目</p>
              </div>
            </div>
            {reviewLater.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {reviewLater.map((item) => (
                  <KnowledgeCard key={item.id} knowledge={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white/60 p-6 text-slate-500">
                还没有安排“稍后回顾”的知识条目。
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Review;
