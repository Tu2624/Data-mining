# Tài liệu API (API Reference): FoodRec AI

Hệ thống cung cấp một RESTful API cho phép Frontend và các ứng dụng khác tương tác với dữ liệu món ăn và thuật toán gợi ý.

## 🔐 Xác thực (Authentication)

Hầu hết các tài nguyên yêu cầu xác thực qua **JSON Web Token (JWT)**.
- Gửi Token tại Header: `Authorization: Bearer <your_jwt_token>`

## 🥖 Authentication Endpoints

| Phương thức | Tên đường dẫn (Endpoint) | Vai trò |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Đăng ký tài khoản mới. |
| `POST` | `/api/auth/login` | Đăng nhập và nhận JWT Token. |

## 🍕 Posts & Interactions

| Phương thức | Tên đường dẫn (Endpoint) | Vai trò | Yêu cầu Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Lấy danh sách tất cả bài viết ẩm thực. | Không |
| `GET` | `/api/posts/:id` | Xem chi tiết một bài viết cụ thể. | Không |
| `POST` | `/api/interact` | Gửi tương tác (Like, Favorite, Rate, View). | Có |
| `GET` | `/api/history` | Lấy lịch sử tương tác của người dùng hiện tại. | Có |
| `GET` | `/api/favorites` | Danh sách bài viết đã lưu vào yêu thích. | Có |

## 🧠 Gợi ý AI (AI Recommendations)

| Phương thức | Tên đường dẫn (Endpoint) | Vai trò |
| :--- | :--- | :--- |
| `GET` | `/api/recommendations` | Lấy danh sách gợi ý cá nhân hóa dựa trên AI. |
| `GET` | `/api/posts/:id/related` | Lấy các món ăn liên quan (Content-based). |

## 💬 Bình luận (Comments)

| Phương thức | Tên đường dẫn (Endpoint) | Vai trò |
| :--- | :--- | :--- |
| `GET` | `/api/posts/:id/comments` | Xem tất cả bình luận của bài viết. |
| `POST` | `/api/posts/:id/comments` | Gửi bình luận mới. |

## 🛠 Quản trị viên (Admin only)

*Các API này yêu cầu Header `Authorization` và User phải có `role = 'admin'`.*

| Phương thức | Tên đường dẫn (Endpoint) | Vai trò |
| :--- | :--- | :--- |
| `POST` | `/api/admin/posts` | Tạo bài viết món ăn mới. |
| `PUT` | `/api/admin/posts/:id` | Cập nhật thông tin bài viết. |
| `DELETE` | `/api/admin/posts/:id` | Xóa bài viết khỏi hệ thống. |

---

## 📡 Thông báo Thời gian thực (Socket.io)

Hệ thống phát các sự kiện sau qua WebSocket:
- `new_post`: Khi admin thêm món ăn mới.
- `admin_alert`: Thông báo quan trọng từ quản trị viên.
- `notification_update`: Khi người dùng nhận được thông báo cá nhân.
