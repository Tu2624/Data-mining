import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Filter, Search as SearchIcon } from 'lucide-react';
import client from '../api/client';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';
import useStore from '../store/useStore';

const Home = () => {
  const { user } = useStore();
  const [posts, setPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recoLoading, setRecoLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    if (user) fetchRecommendations();
  }, [user]);

    const fetchData = async (search = searchTerm) => {
    setLoading(true);
    try {
      const params = {
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(search && { q: search }),
        sort: sortBy
      };
      
      const resPosts = await client.get('/posts', { params });
      setPosts(resPosts.data);

      // Fetch Categories riêng lẻ
      try {
        const resCats = await client.get('/categories');
        setCategories(resCats.data);
      } catch (catError) {
        console.warn('Could not fetch categories:', catError);
        // Fallback categories if API fails
        setCategories([
          { id: 1, name: 'Phở' },
          { id: 2, name: 'Bún chả' },
          { id: 3, name: 'Cơm tấm' },
          { id: 4, name: 'Bánh mì' }
        ]);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    setRecoLoading(true);
    try {
      const res = await client.get('/recommendations');
      setRecommendations(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRecoLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[300px] rounded-3xl overflow-hidden bg-primary-500 shadow-premium flex items-center px-12">
        <div className="z-10 text-white max-w-lg">
          <h1 className="text-5xl font-black mb-4 leading-tight">Khám phá món ngon quanh bạn</h1>
          <p className="text-white/80 font-medium text-lg mb-8">Hệ thống AI thông minh đề xuất hương vị phù hợp nhất với gu của riêng bạn.</p>
          
          <div className="relative max-w-md group">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-500 group-focus-within:scale-110 transition" size={20} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchData()}
              placeholder="Tìm món ăn, địa điểm..." 
              className="w-full bg-white/95 backdrop-blur-sm rounded-2xl pl-14 pr-6 py-4 text-gray-900 font-bold outline-none shadow-premium focus:ring-4 ring-primary-500/20 transition-all"
            />
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
      </section>

      {/* Categories Filter */}
      <section className="flex items-center gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-3 rounded-2xl whitespace-nowrap font-black text-sm uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-primary-500 text-white shadow-premium' : 'bg-white text-gray-400 hover:text-gray-600 shadow-soft'}`}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl whitespace-nowrap font-black text-sm uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-primary-500 text-white shadow-premium' : 'bg-white text-gray-400 hover:text-gray-600 shadow-soft'}`}
          >
            {cat.name}
          </button>
        ))}
      </section>

      {/* AI Recommendation Section */}
      {user && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <Sparkles className="text-yellow-500 fill-yellow-500" />
              Gợi ý riêng cho {user.username}
            </h2>
            <div className="h-[2px] flex-1 bg-gray-100 mx-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recoLoading ? (
              [1, 2, 3, 4].map(i => <PostCardSkeleton key={i} />)
            ) : (
              recommendations.length > 0 ? (
                recommendations.map(post => <PostCard key={post.id} post={post} />)
              ) : (
                <div className="col-span-full h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-medium">
                  Hãy tương tác (Like/View) nhiều hơn để AI bắt đầu gợi ý cho bạn nhé!
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* All Posts Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <Flame className="text-primary-500 fill-primary-500" />
            Tất cả món ăn
          </h2>
          <div className="flex bg-white p-1 rounded-xl shadow-soft">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${sortBy === 'newest' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-500'}`}
            >
              Mới nhất
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition ${sortBy === 'popular' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-primary-500'}`}
            >
              Phổ biến
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-20">
          {loading ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map(i => <PostCardSkeleton key={i} />)
          ) : (
            posts.map(post => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
