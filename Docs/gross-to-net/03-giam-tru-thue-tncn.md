# 3. Giảm trừ gia cảnh & Thuế thu nhập cá nhân (TNCN)

## 3.1. Thu nhập sau bảo hiểm

```
Thu nhập sau bảo hiểm = Gross − Tổng bảo hiểm bắt buộc
```

(Tổng bảo hiểm bắt buộc — xem [02-bao-hiem-bat-buoc.md](./02-bao-hiem-bat-buoc.md))

## 3.2. Giảm trừ gia cảnh

Mức giảm trừ gia cảnh thay đổi theo từng giai đoạn, theo Nghị quyết của Ủy ban Thường vụ Quốc hội:

| Áp dụng cho | Giảm trừ bản thân | Giảm trừ mỗi người phụ thuộc | Căn cứ |
|---|---|---|---|
| Từ kỳ tính thuế 2026 | 15.500.000 VNĐ/tháng (186.000.000 VNĐ/năm) | 6.200.000 VNĐ/tháng | Nghị quyết 110/2025/UBTVQH15 |
| Kỳ tính thuế 2020 – 2025 | 11.000.000 VNĐ/tháng | 4.400.000 VNĐ/tháng | Nghị quyết 954/2020/UBTVQH14 |

```
Tổng giảm trừ = Giảm trừ bản thân + (Số người phụ thuộc × Giảm trừ mỗi người phụ thuộc)
```

(dùng đúng mức giảm trừ của giai đoạn tương ứng với kỳ tính thuế đang tính)

## 3.3. Thu nhập chịu thuế

```
Thu nhập chịu thuế = max(0, Thu nhập sau bảo hiểm − Tổng giảm trừ)
```

Nếu Thu nhập sau bảo hiểm nhỏ hơn hoặc bằng Tổng giảm trừ → Thu nhập chịu thuế = 0 → không phát sinh thuế TNCN.

## 3.4. Biểu thuế lũy tiến từng phần

### a) Từ kỳ tính thuế 2026 — biểu thuế 5 bậc (Luật Thuế thu nhập cá nhân 2025 — Luật 109/2025/QH15)

| Bậc | Thu nhập tính thuế trong bậc (VNĐ/tháng) | Thu nhập tính thuế trong bậc (VNĐ/năm) | Thuế suất |
|---|---|---|---|
| 1 | Đến 10.000.000 | Đến 120.000.000 | 5% |
| 2 | Trên 10.000.000 – 30.000.000 | Trên 120.000.000 – 360.000.000 | 10% |
| 3 | Trên 30.000.000 – 60.000.000 | Trên 360.000.000 – 720.000.000 | 20% |
| 4 | Trên 60.000.000 – 100.000.000 | Trên 720.000.000 – 1.200.000.000 | 30% |
| 5 | Trên 100.000.000 | Trên 1.200.000.000 | 35% |

> Độ rộng từng bậc (dùng trong thuật toán ở mục 3.5): bậc 1–4 lần lượt là 10tr, 20tr, 30tr, 40tr; bậc 5 không giới hạn độ rộng (áp dụng cho toàn bộ phần thu nhập còn lại).

### b) Đến hết kỳ tính thuế 2025 — biểu thuế 7 bậc

| Bậc | Thu nhập tính thuế trong bậc (VNĐ/tháng) | Thuế suất |
|---|---|---|
| 1 | 0 – 5.000.000 | 5% |
| 2 | Trên 5.000.000 – 10.000.000 | 10% |
| 3 | Trên 10.000.000 – 18.000.000 | 15% |
| 4 | Trên 18.000.000 – 32.000.000 | 20% |
| 5 | Trên 32.000.000 – 52.000.000 | 25% |
| 6 | Trên 52.000.000 – 80.000.000 | 30% |
| 7 | Trên 80.000.000 | 35% |

> Độ rộng từng bậc: bậc 1–6 lần lượt là 5tr, 5tr, 8tr, 14tr, 20tr, 28tr; bậc 7 không giới hạn độ rộng.

> **Lưu ý về mốc áp dụng cần xác nhận**: Luật Thuế TNCN 2025 có hiệu lực thi hành từ 01/07/2026, nhưng quy định thu nhập từ tiền lương, tiền công áp dụng **ngay từ kỳ tính thuế năm 2026** — nghĩa là có thể phải áp dụng biểu thuế và mức giảm trừ mới cho **toàn bộ năm 2026** (kể cả giai đoạn trước 01/07/2026) khi quyết toán thuế cuối năm, chứ không chỉ từ ngày luật có hiệu lực thi hành. Đây là điểm cần BA xác nhận rõ trước khi triển khai — xem [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md).

## 3.5. Thuật toán tính thuế (lũy tiến từng phần)

Với thu nhập chịu thuế ban đầu, lặp qua từng bậc của biểu thuế đang áp dụng (5 bậc từ kỳ tính thuế 2026, hoặc 7 bậc cho các kỳ trước đó), theo thứ tự từ bậc đầu tiên đến bậc cuối cùng:

1. Lấy phần thu nhập còn lại chưa tính thuế (`remaining`), ban đầu `remaining = thu nhập chịu thuế`.
2. Nếu `remaining ≤ 0` → dừng, không tính thêm thuế.
3. Thuế của bậc hiện tại = `min(remaining, độ rộng bậc) × thuế suất bậc`.
4. Cộng dồn vào tổng thuế.
5. `remaining = remaining − độ rộng bậc`.
6. Nếu `remaining ≤ 0` → dừng (không xét các bậc còn lại); ngược lại tiếp tục bậc kế tiếp.

```
Net = Thu nhập sau bảo hiểm − Tổng thuế TNCN
```

## 3.6. Bảng tra nhanh (dùng làm oracle khi kiểm thử)

### Theo biểu thuế 7 bậc (đến hết kỳ tính thuế 2025)

| Thu nhập chịu thuế | Số bậc áp dụng | Tổng thuế |
|---|---|---|
| ≤ 0 | 0 | 0 |
| 1.234.444 | 1 | 61.722,2 |
| 9.000.000 | 2 | 650.000 |
| 12.000.000 | 3 | 1.050.000 |
| 29.000.000 | 4 | 4.150.000 |
| 32.985.345 | 5 | 4.996.336,25 |
| 54.880.000 | 6 | 10.614.000 |
| 84.644.000 | 7 (đủ 7 bậc) | 19.775.400 |
| 983.562.000 | 7 | 334.396.700 |

### Theo biểu thuế 5 bậc (từ kỳ tính thuế 2026)

| Thu nhập chịu thuế | Số bậc áp dụng | Tổng thuế |
|---|---|---|
| ≤ 0 | 0 | 0 |
| 10.000.000 | 1 | 500.000 |
| 25.000.000 | 2 | 2.000.000 |
| 50.000.000 | 3 | 6.500.000 |
| 80.000.000 | 4 | 14.500.000 |
| 150.000.000 | 5 (đủ 5 bậc) | 38.000.000 |
