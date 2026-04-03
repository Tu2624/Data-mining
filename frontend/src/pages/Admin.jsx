import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Image,
  MapPin,
  Tag,
  DollarSign,
  Send,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import client from "../api/client";
import useStore from "../store/useStore";

const Admin = () => {
  const { user } = useStore();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "Hà Nội, Việt Nam",
    categoryId: "",
    imageUrl: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client
      .get("/categories")
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: res.data[0].id }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post("/admin/posts", form);
      alert("Đã đăng món mới và gửi thông báo Real-time thành công!");
      setForm({
        title: "",
        description: "",
        price: "",
        location: "Hà Nội, Việt Nam",
        categoryId: categories.length > 0 ? categories[0].id : "",
        imageUrl: "",
        tags: [],
      });
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi đăng bài");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin")
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <ShieldCheck size={64} className="text-red-500 opacity-20" />
        <h1 className="text-2xl font-black text-gray-400 uppercase tracking-widest">
          Truy cập bị từ chối
        </h1>
        <p className="text-gray-500">
          Chỉ Admin mới có quyền truy cập trang này!
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 font-bold">
            Thao tác quản trị hệ thống FoodRec AI
          </p>
        </div>
        <div className="bg-primary-50 px-6 py-4 rounded-3xl flex items-center gap-3 text-primary-500">
          <PlusCircle size={28} />
          <span className="font-extrabold uppercase tracking-widest text-sm">
            Thêm bài đăng
          </span>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[32px] p-10 shadow-premium grid grid-cols-1 md:grid-cols-2 gap-10"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Tên món ăn
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Nhập tên món ăn..."
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Mô tả
            </label>
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Mô tả hương vị, nguyên liệu..."
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                Giá tham khảo
              </label>
              <div className="relative">
                <DollarSign
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0"
                  className="w-full bg-gray-50 rounded-2xl pl-10 pr-5 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                Danh mục
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
                className="w-full bg-gray-50 rounded-2xl px-4 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Link ảnh (Unsplash URL)
            </label>
            <div className="relative">
              <Image
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash..."
                className="w-full bg-gray-50 rounded-2xl pl-10 pr-5 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
              Địa điểm
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full bg-gray-50 rounded-2xl pl-10 pr-5 py-4 border-2 border-transparent focus:border-primary-500 outline-none font-bold"
                required
              />
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-gray-50 rounded-[28px] h-48 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
            {form.imageUrl ? (
              <img src={form.imageUrl} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400 font-bold text-sm tracking-wider uppercase">
                Xem trước hình ảnh
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xl shadow-premium hover:shadow-none hover:translate-y-1 transition-all disabled:opacity-50"
          >
            <Send size={24} />{" "}
            {loading ? "Đang gửi..." : "Đăng bài & Gửi thông báo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
