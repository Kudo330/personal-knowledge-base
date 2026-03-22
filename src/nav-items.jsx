import { HomeIcon, BookOpenIcon, PlusIcon } from 'lucide-react';
import Index from './pages/Index.jsx';
import KnowledgeList from './components/KnowledgeList.jsx';
import AddKnowledge from './components/AddKnowledge.jsx';
import KnowledgeDetail from './components/KnowledgeDetail.jsx';

export const navItems = [
  {
    title: '首页',
    to: '/',
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />
  },
  {
    title: '知识库',
    to: '/knowledge',
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <KnowledgeList />
  },
  {
    title: '添加知识',
    to: '/add',
    icon: <PlusIcon className="h-4 w-4" />,
    page: <AddKnowledge />
  }
];

export const routes = [
  { path: '/', element: <Index /> },
  { path: '/knowledge', element: <KnowledgeList /> },
  { path: '/knowledge/:id', element: <KnowledgeDetail /> },
  { path: '/add', element: <AddKnowledge /> }
];
