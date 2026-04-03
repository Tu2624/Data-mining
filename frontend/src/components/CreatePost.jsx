import React, { useState, useEffect } from 'react';
import { Image, MapPin, Send, Plus, X } from 'lucide-react';
import client from '../api/client';
import useStore from '../store/useStore';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: 'Hà Nội, Việt Nam',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    client.get('/categories').then(res => {
      setCategories(res.data);
      if (res.data.length > 0) {
        setForm(prev => ({ ...prev, categoryId: res.data[0].id }));
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim()) return;

    setLoading(true);
    try {
      await client.post('/posts', {
        ...form,
        title: form.title || form.description.substring(0, 30) + '...'
      });
      setForm({
        title: '',
        description: '',
        price: '',
        location: 'Hà Nội, Việt Nam',
        categoryId: categories.length > 0 ? categories[0].id : '',
        imageUrl: ''
      });
      setIsExpanded(false);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      alert(error.response?.data?.error || 'Lỗi khi đăng bài');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-3xl p-4 shadow-soft ring-1 ring-black/5 mb-6 transition-all duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden border-2 border-white shadow-sm shrink-0">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </div>
        
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 text-left px-5 py-3 rounded-2xl transition-colors font-medium text-sm"
          >
            {user.username} ơi, bạn đang nghĩ gì thế? Thử thêm #hashtag nhé!
          </button>
        ) : (
          <div className="flex-1 flex justify-between items-center">
            <span className="font-bold text-gray-900">Tạo bài viết mới</span>
            <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <textarea
            autoFocus
            rows="3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Mô tả món ăn hoặc cảm xúc của bạn... #Phở #Ngon"
            className="w-full bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus:border-primary-200 outline-none font-medium placeholder:text-gray-400 resize-none transition-all"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Link hình ảnh (Unsplash...)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full bg-gray-50 rounded-xl pl-10 pr-3 py-2 text-sm border-2 border-transparent focus:border-primary-100 outline-none"
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Vị trí..."
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-gray-50 rounded-xl pl-10 pr-3 py-2 text-sm border-2 border-transparent focus:border-primary-100 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-gray-600 outline-none border-2 border-transparent focus:border-primary-100"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            
            <div className="flex-1"></div>

            <button
              type="submit"
              disabled={loading || !form.description.trim()}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary-200 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? 'Đang đăng...' : (
                <>
                  <Send size={18} /> Đăng bài
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreatePost;
