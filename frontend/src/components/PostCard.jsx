import React from 'react';
import { Heart, Eye, Star, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <Link 
      to={`/post/${post.id}`}
      className="group bg-white rounded-2xl p-3 shadow-soft hover:shadow-premium hover:-translate-y-1 transition-all duration-300 block ring-1 ring-black/5"
    >
      {/* 70% Image Ratio */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Floating Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-sm">
          {post.category_name}
        </span>
        {/* Rating Overlay */}
        <div className="absolute bottom-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[11px] font-bold">{Number(post.avg_rating).toFixed(1)}</span>
        </div>
      </div>

      {/* 30% Info */}
      <div className="px-1 pb-1">
        <h3 className="font-bold text-gray-900 group-hover:text-primary-500 transition line-clamp-1">
          {post.title}
        </h3>
        
        <div className="flex items-center text-gray-400 text-[11px] font-medium mt-1 mb-3">
          <MapPin size={10} className="mr-1" />
          {post.location}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-500">
              <Heart size={14} className="group-hover:text-red-500 transition" />
              <span className="text-xs">{post.likes_count || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Eye size={14} />
              <span className="text-xs">{post.views_count || 0}</span>
            </div>
          </div>
          <span className="text-primary-500 font-bold text-sm">
            {Number(post.price).toLocaleString()}đ
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
