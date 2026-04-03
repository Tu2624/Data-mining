import React, { useState, useEffect } from "react";
import { Users, UserPlus, UserMinus, Search, Sparkles } from "lucide-react";
import client from "../api/client";
import useStore from "../store/useStore";
import { Link } from "react-router-dom";

const Friends = () => {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState("following"); // 'following' or 'suggestions'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint =
        activeTab === "following" ? "/social/following" : "/social/suggestions";
      const res = await client.get(endpoint);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user, activeTab]);

  const handleFollow = async (targetId) => {
    try {
      await client.post("/social/follow", { followingId: targetId });
      // Refresh list
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await client.post("/social/unfollow", { followingId: targetId });
      // Refresh list
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl shadow-soft">
        <Users size={64} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-2xl font-black text-gray-900">
          Vui lòng đăng nhập
        </h2>
        <p className="text-gray-500 mt-2">
          Bạn cần đăng nhập để xem danh sách bạn bè.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block bg-primary-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary-100 no-underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="bg-white rounded-[32px] p-8 shadow-soft border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Users size={36} className="text-primary-500" />
            Kết nối
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Xây dựng cộng đồng ẩm thực của riêng bạn
          </p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "following" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Đang theo dõi
          </button>
          <button
            onClick={() => setActiveTab("suggestions")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "suggestions" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            Khám phá
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 4, 5].map((n) => (
            <div
              key={n}
              className="bg-white h-24 rounded-3xl animate-pulse shadow-sm border border-gray-50"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-[28px] p-5 shadow-soft border border-gray-50 flex items-center justify-between group hover:border-primary-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center font-black text-primary-500 text-xl uppercase">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt={u.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      u.username.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{u.username}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                      Thành viên mới
                    </p>
                  </div>
                </div>

                {activeTab === "following" ? (
                  <button
                    onClick={() => handleUnfollow(u.id)}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    title="Bỏ theo dõi"
                  >
                    <UserMinus size={20} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleFollow(u.id)}
                    className="p-3 bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white rounded-2xl transition-all shadow-sm"
                    title="Theo dõi"
                  >
                    <UserPlus size={20} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-200">
              {activeTab === "following" ? (
                <>
                  <Sparkles size={48} className="mx-auto text-gray-200 mb-4" />
                  <h3 className="text-xl font-black text-gray-400">
                    Bạn chưa theo dõi ai
                  </h3>
                  <p className="text-gray-400 mt-1">
                    Hãy chuyển sang mục Khám phá để tìm bạn mới!
                  </p>
                </>
              ) : (
                <>
                  <Search size={48} className="mx-auto text-gray-200 mb-4" />
                  <h3 className="text-xl font-black text-gray-400">
                    Không tìm thấy gợi ý
                  </h3>
                  <p className="text-gray-400 mt-1">
                    Bạn đã theo dõi tất cả mọi người rồi đấy!
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Friends;
