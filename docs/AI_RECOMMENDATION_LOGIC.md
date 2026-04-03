# Thuật toán Gợi ý (AI Recommendation Logic): FoodRec AI

FoodRec AI sử dụng hệ thống **Hybrid Recommendation** (Gợi ý lai), kết hợp giữa **Collaborative Filtering** và **Content-based Filtering** để đảm bảo độ chính xác cao và giải quyết vấn đề "Cold Start" (Người dùng mới).

## 📊 1. Mô hình Điểm Tương tác (Multi-Interaction Scoring)

Hệ thống không chỉ dựa vào đánh giá (Ratings) mà còn sử dụng các tín hiệu tương tác khác để đánh giá độ quan tâm của người dùng. Mỗi loại tương tác được gán một trọng số (Score):

| Tương tác (Interaction) | Điểm (Weight) | Ý nghĩa |
| :--- | :--- | :--- |
| **Rating** | 1 - 5 | Tín hiệu tường minh nhất từ người dùng. |
| **Favorite** | 3 | Người dùng muốn lưu lại để xem sau. |
| **Like** | 2 | Đồng tình hoặc ủng hộ món ăn. |
| **View** | 1 | Tín hiệu ngầm định về sự quan tâm. |

*Hệ thống sẽ lấy giá trị cao nhất (`MAX`) nếu một người dùng có nhiều tương tác trên cùng một món ăn.*

## 🤝 2. Lọc Cộng tác (Collaborative Filtering - User-Based)

Thuật toán này tìm kiếm những người dùng có "khẩu vị" tương đồng với bạn để đưa ra gợi ý.

### Bước 1: Xây dựng Ma trận Người dùng - Món ăn (User-Item Matrix)
Hệ thống lấy dữ liệu từ các bảng `ratings`, `favorites`, `likes`, và `views` để tạo thành một ma trận điểm số.

### Bước 2: Tính độ tương đồng bằng Cosine Similarity
Độ tương đồng giữa Người dùng A ($U_A$) và Người dùng B ($U_B$) được tính bằng công thức:

$$\text{Similarity}(U_A, U_B) = \frac{\sum_{i=1}^{n} R_{A,i} \cdot R_{B,i}}{\sqrt{\sum_{i=1}^{n} R_{A,i}^2} \cdot \sqrt{\sum_{i=1}^{n} R_{B,i}^2}}$$

Trong đó:
- $R_{A,i}$ là điểm của người dùng $A$ cho món ăn $i$.
- $n$ là tổng số món ăn trong hệ thống.

### Bước 3: Dự đoán điểm số
Hệ thống sẽ lấy Top 5 người dùng tương đồng nhất và tính toán điểm dự báo cho các món ăn mà người dùng hiện tại chưa xem:
$$\text{Score}(U, i) = \sum_{V \in \text{SimilarUsers}} \text{Score}(V, i) \cdot \text{Similarity}(U, V)$$

## 🏷️ 3. Lọc dựa trên Nội dung (Content-based Filtering)

Thuật toán này tập trung vào đặc tính của món ăn để gợi ý các sản phẩm tương tự.

### Cơ chế hoạt động:
1. **Phân loại (Category Matching)**: Ưu tiên các món ăn cùng danh mục (VD: Cùng là "Món nước").
2. **Thẻ (Tag Overlap)**: Đếm số lượng thẻ chung giữa các món ăn (VD: Cùng có thẻ "Cay", "Hải sản").
3. **Sắp xếp**: Các món ăn có nhiều thẻ chung nhất và cùng danh mục sẽ được đẩy lên đầu.

## ⚡ 4. Chiến lược Hybrid & Caching

- **Cấu hình**: Hệ thống kết hợp kết quả từ cả hai engine. 
- **Caching**: Kết quả gợi ý được lưu vào bảng `recommendations_cache` để truy xuất tức thời (Sub-50ms), thay vì phải tính toán lại toàn bộ ma trận khi mỗi request đến.
- **Tần suất cập nhật**: Cache được làm mới khi người dùng thực hiện một tương tác quan trọng (Rating/Favorite) hoặc sau một khoảng thời gian nhất định.

---
> [!IMPORTANT]
> Thuật toán Collaborative Filtering yêu cầu một lượng dữ liệu tương tác tối thiểu để đạt độ chính xác cao. Cho đến khi đó, Content-based Filtering sẽ đóng vai trò chủ đạo.
