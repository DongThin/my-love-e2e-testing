# 1. Tổng quan nghiệp vụ

## 1.1. Đầu vào (Input)

| Tham số | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|
| Gross | Có | — | Lương Gross (VNĐ) |
| Số người phụ thuộc | Không | 0 | Số người phụ thuộc được khai báo giảm trừ gia cảnh |
| Vùng | Không | 1 | Vùng lương tối thiểu: 1, 2, 3, hoặc 4 |
| Ngày hiệu lực | Không | Ngày hiện tại | Ngày dùng để xác định chính sách lương cơ sở / lương tối thiểu vùng áp dụng |

> **Lưu ý**: khi không chỉ định ngày hiệu lực, hệ thống cần luôn lấy đúng ngày thực tế tại thời điểm tính lương — xem câu hỏi mở ở [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md).

## 1.2. Đầu ra (Output) — "Phiếu lương"

| Trường | Mô tả |
|---|---|
| Gross | Lương Gross đầu vào |
| Vùng | Vùng áp dụng |
| Tổng bảo hiểm | Tổng tiền bảo hiểm bắt buộc phải đóng |
| Chi tiết bảo hiểm | Chi tiết từng loại bảo hiểm (tên, số tiền) |
| Thu nhập sau bảo hiểm | = Gross − Tổng bảo hiểm |
| Số người phụ thuộc | Số người phụ thuộc |
| Giảm trừ người phụ thuộc | Tổng tiền giảm trừ người phụ thuộc |
| Chi tiết thuế | Chi tiết thuế theo từng bậc (tên bậc, tỷ lệ, số tiền) |
| Tổng thuế TNCN | Tổng thuế TNCN phải nộp |
| Net | Lương Net thực lãnh |

## 1.3. Luồng xử lý tổng quát

```
Gross
  │
  ▼
[1] Tính bảo hiểm bắt buộc (BHXH 8% + BHYT 1,5% + BHTN 1%, có trần đóng theo vùng/thời gian)
  │
  ▼
Thu nhập sau bảo hiểm = Gross − Tổng bảo hiểm
  │
  ▼
[2] Trừ giảm trừ gia cảnh (giảm trừ bản thân 11.000.000 + giảm trừ người phụ thuộc 4.400.000/người)
  │
  ▼
Thu nhập chịu thuế = max(0, Thu nhập sau bảo hiểm − Tổng giảm trừ)
  │
  ▼
[3] Tính thuế TNCN lũy tiến từng phần (7 bậc)
  │
  ▼
Net = Thu nhập sau bảo hiểm − Tổng thuế TNCN
```

Chi tiết bước [1] xem [02-bao-hiem-bat-buoc.md](./02-bao-hiem-bat-buoc.md).
Chi tiết bước [2] và [3] xem [03-giam-tru-thue-tncn.md](./03-giam-tru-thue-tncn.md).

## 1.4. Quy tắc nghiệp vụ chính

1. Bảo hiểm được tính **trên Gross gốc** (không phải trên thu nhập đã giảm trừ), có áp **trần đóng** riêng cho từng loại.
2. Giảm trừ gia cảnh **không áp dụng vào bảo hiểm**, chỉ áp dụng khi tính thu nhập chịu thuế TNCN.
3. Nếu thu nhập chịu thuế ≤ 0 (sau khi trừ bảo hiểm và giảm trừ) → thuế TNCN = 0, không âm.
4. Thuế TNCN tính theo phương pháp **lũy tiến từng phần**: phần thu nhập nằm trong mỗi bậc chịu đúng thuế suất của bậc đó, không áp một mức thuế suất duy nhất cho toàn bộ thu nhập.
5. Trần đóng bảo hiểm và mức lương tối thiểu vùng **thay đổi theo thời gian** (theo các mốc chính sách 07/2022, 07/2023, 07/2024…), vì vậy cùng một mức Gross có thể cho ra số tiền bảo hiểm khác nhau tuỳ ngày tính lương.
