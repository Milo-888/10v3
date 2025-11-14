import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronRight,
  Hash,
  Target,
  Layers
} from 'lucide-react';

interface OutlineItem {
  id: string;
  title: string;
  level: number;
  keywords: string[];
  isExpanded: boolean;
  children: OutlineItem[];
}

const OutlineBuilder: React.FC = () => {
  const [outline, setOutline] = useState<OutlineItem[]>([
    {
      id: '1',
      title: 'Introduction to Digital Marketing',
      level: 1,
      keywords: ['digital marketing', 'introduction', 'overview'],
      isExpanded: true,
      children: [
        {
          id: '1-1',
          title: 'What is Digital Marketing?',
          level: 2,
          keywords: ['definition', 'basics'],
          isExpanded: false,
          children: [],
        },
        {
          id: '1-2',
          title: 'Why Digital Marketing Matters',
          level: 2,
          keywords: ['importance', 'benefits'],
          isExpanded: false,
          children: [],
        },
      ],
    },
    {
      id: '2',
      title: 'SEO Fundamentals',
      level: 1,
      keywords: ['SEO', 'search engine optimization', 'rankings'],
      isExpanded: true,
      children: [
        {
          id: '2-1',
          title: 'Keyword Research',
          level: 2,
          keywords: ['keywords', 'research', 'tools'],
          isExpanded: false,
          children: [],
        },
        {
          id: '2-2',
          title: 'On-Page Optimization',
          level: 2,
          keywords: ['on-page', 'optimization', 'content'],
          isExpanded: false,
          children: [],
        },
      ],
    },
    {
      id: '3',
      title: 'Social Media Strategy',
      level: 1,
      keywords: ['social media', 'strategy', 'platforms'],
      isExpanded: false,
      children: [],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const toggleExpanded = (id: string) => {
    const updateItem = (items: OutlineItem[]): OutlineItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        return { ...item, children: updateItem(item.children) };
      });
    };
    setOutline(updateItem(outline));
  };

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = () => {
    const updateItem = (items: OutlineItem[]): OutlineItem[] => {
      return items.map(item => {
        if (item.id === editingId) {
          return { ...item, title: editTitle };
        }
        return { ...item, children: updateItem(item.children) };
      });
    };
    setOutline(updateItem(outline));
    setEditingId(null);
    setEditTitle('');
  };

  const addNewItem = (parentId?: string) => {
    const newItem: OutlineItem = {
      id: Date.now().toString(),
      title: 'New Section',
      level: parentId ? 2 : 1,
      keywords: [],
      isExpanded: false,
      children: [],
    };

    if (parentId) {
      const updateItem = (items: OutlineItem[]): OutlineItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            return { 
              ...item, 
              children: [...item.children, newItem],
              isExpanded: true 
            };
          }
          return { ...item, children: updateItem(item.children) };
        });
      };
      setOutline(updateItem(outline));
    } else {
      setOutline([...outline, newItem]);
    }
  };

  const deleteItem = (id: string) => {
    const removeItem = (items: OutlineItem[]): OutlineItem[] => {
      return items.filter(item => item.id !== id).map(item => ({
        ...item,
        children: removeItem(item.children)
      }));
    };
    setOutline(removeItem(outline));
  };

  const getHeadingIcon = (level: number) => {
    return <Hash className={`h-4 w-4 ${level === 1 ? 'text-indigo-600' : 'text-blue-500'}`} />;
  };

  const renderOutlineItem = (item: OutlineItem, depth: number = 0) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border border-slate-200 rounded-lg bg-white ${depth > 0 ? 'ml-6 mt-2' : 'mb-4'}`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
            
            {item.children.length > 0 && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
              >
                {item.isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-slate-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                )}
              </button>
            )}

            {getHeadingIcon(item.level)}

            {editingId === item.id ? (
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-2 py-1 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  autoFocus
                />
                <button
                  onClick={saveEdit}
                  className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-1">
                <h3 className={`font-medium ${item.level === 1 ? 'text-slate-900' : 'text-slate-700'}`}>
                  {item.title}
                </h3>
                {item.keywords.length > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Target className="h-3 w-3 text-slate-400" />
                    <div className="flex flex-wrap gap-1">
                      {item.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => startEditing(item.id, item.title)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => addNewItem(item.id)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => deleteItem(item.id)}
              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {item.isExpanded && item.children.length > 0 && (
        <div className="px-4 pb-4">
          {item.children.map(child => renderOutlineItem(child, depth + 1))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center">
            <Layers className="h-6 w-6 text-indigo-600 mr-2" />
            eBook Outline & Structure
          </h2>
          <button
            onClick={() => addNewItem()}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Physics-Based Organization</h3>
          <p className="text-sm text-blue-700">
            Drag and drop sections to reorganize your eBook structure. The system automatically 
            optimizes keyword placement and maintains proper heading hierarchy (H1 → H2 → H3).
          </p>
        </div>

        <Reorder.Group axis="y" values={outline} onReorder={setOutline}>
          {outline.map(item => (
            <Reorder.Item key={item.id} value={item}>
              {renderOutlineItem(item)}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
};

export default OutlineBuilder;