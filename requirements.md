# MASTER REQUIREMENTS: FOODREC AI SYSTEM (KHAI PHÁ DỮ LIỆU)
**Dự án**: Hệ thống Gợi ý Món ăn Cá nhân hóa.

---

## 🏁 1. Tầm nhìn & Mục tiêu
Xây dựng một nền tảng Web hiện đại cho phép người dùng khám phá, đánh giá và nhận các đề xuất món ăn thông minh dựa trên kỹ thuật **Khai phá dữ liệu**. 
Hệ thống sử dụng mô hình **Hybrid Recommendation** (Lọc cộng tác + Lọc dựa trên nội dung).

## 🛠 2. Chức năng Hệ thống (Functional Requirements)

### 2.1. Người dùng & Thành viên (Account)
- Đăng ký/Đăng nhập bảo mật với **JWT**.
- Quản lý Profile (Ảnh đại diện, bài đăng, lịch sử).
- **History**: Lưu lại các món ăn đã xem gần nhất.

### 2.2. Khám phá & Tương tác (Core)
- Danh sách món ăn dạng Card (Aesthetics).
- **Search & Filter**: Tìm kiếm theo từ khóa, lọc theo Danh mục (Category), Khoảng giá (Price), Địa điểm (Location).
- **Rating System**: Đánh giá 1-5 sao cho mỗi món ăn.
- **Interactions**: Like bài viết, Lưu vào mục Yêu thích (Favorite), Bình luận (Comment).

### 2.3. Hệ thống Gợi ý AI (Recommendation Engine)
- **Collaborative Filtering**: Sử dụng điểm Rating (1-5) để tính toán độ tương đồng giữa các User (Cosine Similarity). 
- **Content-Based Filtering**: Gợi ý các món tương tự dựa trên Tags và Category.
- **Hybrid System**: Kết hợp cả 2 phương pháp để có kết quả chính xác nhất.
- **Caching**: Kết quả gợi ý được lưu lại để tăng tốc độ phản hồi.

### 2.4. Quản trị viên (Admin)
- Quản lý danh sách món ăn (Thêm/Sửa/Xóa).
- Gửi thông báo toàn hệ thống.

### 2.5. Thông báo & Real-time
- **Socket.io**: Đẩy thông báo tức thì (Real-time) khi có tương tác mới hoặc bài đăng mới.

## 🎨 3. Giao diện & Trải nghiệm (UI/UX)
- **Theme**: Minimal, màu Cam (#ff5722) chủ đạo.
- **Skeleton Loading**: Hiển thị trạng thái chờ rỗng chuyên nghiệp trong lúc tải dữ liệu.
- **Responsive**: Hiệu thị tốt trên Desktop và Mobile.
- **Animation**: Sử dụng Framer Motion cho các hiệu ứng chuyển trang và phóng to Card khi Hover.

## 💾 4. Cấu trúc Dữ liệu (MySQL Schema)
Hệ thống bao gồm 12 bảng chính:
- `users`, `categories`, `posts`, `media`, `comments`, `likes`, `tags`, `post_tags`, `favorites`, `views`, `ratings`, `notifications`, `recommendations_cache`.

## 🏗 5. Tiêu chuẩn Kỹ thuật (Technical Standards)
- **Backend Modular**: Tách biệt Service (logic AI) và Controller (API).
- **Validation**: Kiểm tra dữ liệu đầu vào (Input validation) để chống lỗi.
- **Scalability**: Dễ dàng bảo trì và mở rộng thêm các thuật toán khai phá dữ liệu mới.
