# 🧠 Giải thích Thuật toán Khai phá dữ liệu & Gợi ý (AI Recommendation)

Tài liệu này giải thích chi tiết cách hệ thống **FoodRec AI** khai phá dữ liệu người dùng để đưa ra các gợi ý món ăn chính xác.

---

## 1. Thuật toán Collaborative Filtering (User-based)
Đây là "trái tim" của hệ thống, được cài đặt tại `backend/services/recommendation.service.js`.

### 🔍 Cách thức khai phá:
Hệ thống không chỉ dựa vào việc bạn thích gì, mà dựa vào việc **"Những người giống bạn cũng thích món này"**.

1.  **Thu thập Ma trận Tương tác (User-Item Matrix)**:
    Hệ thống gom tất cả dữ liệu từ 4 nguồn: `Ratings` (5đ), `Favorites` (3đ), `Likes` (2đ), và `Views` (1đ).
2.  **Tính toán độ tương đồng (Cosine Similarity)**:
    Sử dụng công thức Cosine để so sánh vector hành vi của bạn với tất cả các người dùng khác trong hệ thống.
    $$ \text{similarity} = \frac{A \cdot B}{\|A\| \|B\|} $$
3.  **Dự đoán sở thích**:
    Hệ thống tìm ra top 5 người dùng "tâm đầu ý hợp" nhất với bạn. Nếu họ thích một món ăn mà bạn chưa từng xem, AI sẽ tính điểm dự đoán cho món đó dựa trên độ tương đồng của họ.

---

## 2. Thuật toán Xếp hạng Bảng tin (Unified Feed Scoring)
Để Bảng tin (Home Feed) luôn hấp dẫn, chúng tôi sử dụng cơ chế **Scoring (Tính điểm ưu tiên)** trong `getFeed`.

| Độ ưu tiên | Nguồn dữ liệu | Điểm cộng | Lý do |
| :--- | :--- | :--- | :--- |
| **1 (Cao nhất)** | People You Follow | +100 | Bạn chủ động muốn xem tin từ họ (Tính xã hội). |
| **2 (Trung bình)** | AI Recommendation | +50 | AI dự đoán bạn sẽ thích dựa trên khai phá dữ liệu. |
| **3 (Cơ bản)** | Trending/Recent | +0 | Các bài viết mới nhất để đảm bảo feed không bao giờ trống. |

---

## 3. Cách kiểm chứng độ chính xác (Accuracy Verification)
Trong môn Khai phá dữ liệu, việc kiểm chứng (Validation) là cực kỳ quan trọng.

### Kịch bản "Gold Set":
Trong `database/seeder.js`, tôi đã cài đặt một kịch bản mẫu để demo:
*   **User 1**: Thích `Phở` và `Bún Chả`.
*   **User 2**: Thích `Phở`, `Bún Chả` và thêm món `Cơm Tấm`.
*   **Kết quả**: AI nhận thấy User 1 và User 2 rất giống nhau (cùng thích Phở & Bún Chả). Do đó, nó sẽ tự động gợi ý `Cơm Tấm` cho User 1.

**Lệnh chạy kiểm tra:**
```powershell
node scripts/verify_accuracy.js
```

---

## 4. Công cụ Khai phá
*   **Hashtag Extracting**: Tự động bóc tách `#hashtag` từ nội dung bài viết để phân loại chủ đề (Topic Modeling cơ bản).
*   **Social Graph**: Sử dụng bảng `follows` để xây dựng mạng lưới quan hệ giữa các thực thể dữ liệu.

---
> [!TIP]
> Bạn có thể sử dụng file này để đưa vào phần **Báo cáo chuyên môn** hoặc **Slide thuyết trình** của mình. Nó thể hiện rõ các bước: Thu thập dữ liệu -> Xử lý/Tính toán -> Đưa ra kết quả (Gợi ý).
