# 🍕 FoodRec AI: Personalized Culinary Recommendation System

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.x-blue)](https://reactjs.org/)
[![Database](https://img.shields.io/badge/database-MySQL-orange)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **FoodRec AI** là nền tảng web hiện đại tích hợp trí tuệ nhân tạo để cá nhân hóa gợi ý ẩm thực. Dự án được phát triển cho môn học **Khai phá dữ liệu**, sử dụng các mô hình lọc cộng tác (Collaborative Filtering) và lọc dựa trên nội dung (Content-based Filtering) để phân tích hành vi người dùng.

---

## 📚 Tài liệu chi tiết (Detailed Documentation)

Để hiểu rõ hơn về hệ thống, vui lòng tham khảo các tài liệu chuyên sâu sau đây:

1.  **[Kiến trúc Hệ thống (Architecture)](./docs/SYSTEM_ARCHITECTURE.md)**: Tổng quan về Tech Stack và luồng dữ liệu.
2.  **[Hướng dẫn Cơ sở Dữ liệu (Database)](./docs/DATABASE_GUIDE.md)**: Sơ đồ ERD và cấu trúc bảng chi tiết.
3.  **[Tài liệu API (API Reference)](./docs/API_REFERENCE.md)**: Danh sách các endpoint và cách tương tác.
4.  **[Thuật toán Gợi ý (AI Logic)](./docs/AI_RECOMMENDATION_LOGIC.md)**: Giải thích chi tiết về Cosine Similarity và mô hình lai.

---

## 🌟 Tính năng Nổi bật

### 👤 Trải nghiệm Người dùng
- **Trang chủ Cá nhân hóa**: Gợi ý "Dành cho bạn" dựa trên thuật toán AI.
- **Tìm kiếm Thông minh**: Lọc món ăn theo Giá, Danh mục và Địa điểm.
- **Tương tác Xã hội**: Đánh giá (Rating), Thích (Like), Lưu (Favorite) và Bình luận.
- **Thông báo Thời gian thực**: Cập nhật tức thời qua Socket.io.

### 🛡️ Quản lý Admin
- **Dashboard**: CRUD món ăn, danh mục và thẻ (Tags).
- **Hệ thống Thông báo**: Gửi tin nhắn đến toàn bộ người dùng ngay lập tức.
- **Phân tích Dữ liệu**: (Sắp tới) Biểu đồ xu hướng người dùng.

---

## 🚀 Công nghệ Sử dụng

| Tầng | Công nghệ |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Zustand |
| **Backend** | Node.js, Express, Socket.io, JWT Authentication |
| **Database** | MySQL (Tối ưu hóa Indexing cho truy vấn nhanh) |
| **Tools** | Axios, Lucide Icons, MySQL2 |

---

## 🛠 Cài đặt & Triển khai

### 1. Thiết lập Database
1. Tạo MySQL database: `foodrec_ai`.
2. Import schema từ `database/schema.sql`.
3. (Tùy chọn) Chạy Seeder để tạo dữ liệu mẫu: `node database/seeder.js`

### 2. Cấu hình Backend
1. Vào thư mục `/backend`.
2. Tạo tệp `.env` với các thông số: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`.
3. Chạy lệnh: `npm install` và `npm run dev`.

### 3. Cấu hình Frontend
1. Vào thư mục `/frontend`.
2. Chạy lệnh: `npm install` và `npm run dev`.

---

## 📂 Cấu trúc Thư mục

```text
├── backend/            # Express.js Server & Logic AI
├── frontend/           # React Frontend (Vite)
├── database/           # SQL Scripts & Seeders
├── docs/               # Tài liệu chi tiết dự án (Mới)
└── README.md           # Trang tổng quan
```

## 📝 License & Authors

- **Môn học**: Khai phá dữ liệu (Data Mining)
- **Năm học**: 2026
- **Bản quyền**: MIT License.

---
*Nếu bạn thấy dự án hữu ích, hãy tặng 1 ⭐ trên GitHub!*