# 2. Bảo hiểm bắt buộc (phần người lao động đóng)

> Phạm vi: tài liệu này chỉ mô tả **phần bảo hiểm do người lao động đóng**, được trừ trực tiếp vào lương để ra Net. Phần doanh nghiệp đóng không nằm trong luồng tính lương Net và không thuộc phạm vi tài liệu này.

## 2.1. Tỷ lệ đóng

| Loại bảo hiểm | Ký hiệu | Tỷ lệ |
|---|---|---|
| Bảo hiểm xã hội | BHXH | 8% |
| Bảo hiểm y tế | BHYT | 1,5% |
| Bảo hiểm thất nghiệp | BHTN | 1% |

**Tổng**: 10,5% trên phần thu nhập chưa vượt trần.

## 2.2. Trần đóng (mức thu nhập tối đa để tính bảo hiểm)

| Loại | Trần đóng | Căn cứ |
|---|---|---|
| BHXH, BHYT | 20 × **Lương cơ sở** | Lương cơ sở áp dụng thống nhất toàn quốc, không phân biệt vùng |
| BHTN | 20 × **Lương tối thiểu vùng** | Theo vùng (1/2/3/4) mà người lao động làm việc |

Công thức cho từng loại bảo hiểm `i`:

```
Số tiền đóng BH_i = min(Gross, Trần đóng_i) × Tỷ lệ_i
```

```
Tổng bảo hiểm = BHXH + BHYT + BHTN
```

Nói cách khác: nếu Gross vượt trần của một loại bảo hiểm, phần vượt trần **không** bị tính thêm bảo hiểm cho loại đó — loại bảo hiểm đó bị "chặn" (cap) ở đúng mức trần.

## 2.3. Bảng chính sách theo thời gian

Luôn áp dụng chính sách có **ngày hiệu lực gần nhất nhưng không muộn hơn ngày tính lương**. Nếu ngày tính lương trước 07/2022 → chưa có chính sách áp dụng. Lương cơ sở và lương tối thiểu vùng là **hai chính sách độc lập, có mốc hiệu lực riêng** — xem lưu ý về năm 2026 bên dưới.

**Lương cơ sở (dùng tính trần BHXH/BHYT — áp dụng thống nhất toàn quốc, không phân biệt vùng):**

| Hiệu lực từ | Lương cơ sở | Căn cứ |
|---|---|---|
| 01/07/2026 | 2.530.000 | Nghị định 161/2026/NĐ-CP |
| 01/07/2024 | 2.340.000 | |
| 01/07/2023 | 1.800.000 | |
| 01/07/2022 | 1.490.000 | |

**Lương tối thiểu vùng (dùng tính trần BHTN):**

| Hiệu lực từ | Vùng 1 | Vùng 2 | Vùng 3 | Vùng 4 | Căn cứ |
|---|---|---|---|---|---|
| 01/01/2026 | 5.310.000 | 4.730.000 | 4.140.000 | 3.700.000 | Nghị định 293/2025/NĐ-CP |
| 01/07/2024 | 4.960.000 | 4.410.000 | 3.860.000 | 3.450.000 | |
| 01/07/2023 | 4.680.000 | 4.160.000 | 3.640.000 | 3.250.000 | |
| 01/07/2022 | 4.420.000 | 3.920.000 | 3.430.000 | 3.070.000 | |

> **Lưu ý mốc giao thời năm 2026**: lương tối thiểu vùng tăng từ **01/01/2026**, nhưng lương cơ sở chỉ tăng từ **01/07/2026**. Vì vậy, với kỳ lương từ 01/01/2026 đến hết 30/06/2026: trần đóng BHTN đã áp dụng mức lương tối thiểu vùng mới, trong khi trần đóng BHXH/BHYT vẫn áp dụng lương cơ sở cũ (2.340.000) cho đến hết 30/06/2026. Cần kiểm thử riêng cho giai đoạn giao thời này — xem [05-test-case-qa.md](./05-test-case-qa.md).

Ví dụ trần đóng áp dụng từ 01/07/2026 (khi cả hai chính sách mới đã có hiệu lực):

| Loại | Vùng 1 | Vùng 2 | Vùng 3 | Vùng 4 |
|---|---|---|---|---|
| Trần BHXH/BHYT (20 × lương cơ sở 2.530.000) | 50.600.000 (như nhau mọi vùng) | | | |
| Trần BHTN (20 × lương tối thiểu vùng) | 106.200.000 | 94.600.000 | 82.800.000 | 74.000.000 |

## 2.4. Nhập vùng không hợp lệ hoặc ngày không có chính sách

- Vùng ngoài {1, 2, 3, 4}: dữ liệu không hợp lệ, hệ thống cần từ chối và báo lỗi rõ ràng cho người dùng.
- Ngày tính lương trước 01/07/2022: chưa có chính sách bảo hiểm được định nghĩa, hệ thống cần báo lỗi thay vì tính ra kết quả sai.
- Nội dung thông báo lỗi cụ thể cần xác nhận thêm — xem [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md).
