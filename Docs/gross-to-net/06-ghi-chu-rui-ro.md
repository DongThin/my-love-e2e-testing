# 6. Ghi chú & Câu hỏi nghiệp vụ còn mở

Mục này tổng hợp các điểm chưa được định nghĩa rõ về mặt nghiệp vụ, cần BA/PM xác nhận trước khi coi tài liệu đặc tả là chốt cuối cùng.

## 6.1. Trần đóng BHXH/BHYT và BHTN dễ bị nhầm lẫn nếu không nêu rõ căn cứ

Có hai cách hiểu dễ gây nhầm lẫn:
- Trần đóng BHXH/BHYT = 20 × **lương cơ sở** (áp dụng thống nhất toàn quốc, không phân biệt vùng)
- Trần đóng BHTN = 20 × **lương tối thiểu vùng** (theo vùng 1–4 nơi người lao động làm việc)

Tài liệu này áp dụng đúng cách hiểu trên theo quy định hiện hành (mục 2.2, [02-bao-hiem-bat-buoc.md](./02-bao-hiem-bat-buoc.md)).

→ **Đề xuất**: khi trao đổi với các bên liên quan hoặc đối chiếu với tài liệu/sơ đồ cũ khác đang lưu hành nội bộ, cần thống nhất lại đúng hai công thức trên để tránh áp sai trần đóng.

## 6.2. Ngày hiệu lực mặc định có luôn đúng với ngày thực tế không?

Khi người dùng không chỉ định ngày hiệu lực, hệ thống cần tự động lấy **đúng ngày thực tế tại thời điểm tính lương** để chọn đúng chính sách lương cơ sở/lương tối thiểu vùng áp dụng.

→ **Đề xuất**: xác nhận rõ hành vi này, đặc biệt vào các thời điểm chuyển mốc chính sách (thường là ngày 01/07 hàng năm) — tránh trường hợp hệ thống áp dụng nhầm chính sách cũ cho các kỳ lương phát sinh sau mốc đổi chính sách.

## 6.3. Quy tắc validate Gross âm hoặc bằng 0

Cần xác nhận với BA quy tắc nghiệp vụ cho các trường hợp dữ liệu đầu vào bất thường:

- Gross = 0: có coi là hợp lệ không? Nếu hợp lệ, Net dự kiến = 0.
- Gross âm: đây là dữ liệu không hợp lệ (sai sót nhập liệu hoặc lỗi tích hợp dữ liệu từ hệ thống khác). Hệ thống **không nên** tính ra số tiền bảo hiểm hoặc lương Net âm — cần có bước từ chối/validate đầu vào trước khi đưa vào luồng tính lương.

→ **Đề xuất**: bổ sung quy tắc validate Gross phải lớn hơn hoặc bằng 0 (hoặc lớn hơn 0, tuỳ nghiệp vụ) ngay từ bước nhận dữ liệu đầu vào.

## 6.4. Mức độ chi tiết của thông báo lỗi

Cần xác định rõ nội dung thông báo hiển thị cho người dùng khi:
- Nhập sai vùng (ngoài 1–4)
- Nhập ngày hiệu lực không có chính sách tương ứng (ví dụ trước 01/07/2022)
- Gặp lỗi hệ thống khác trong quá trình tính lương

→ **Đề xuất**: xác nhận với BA/UX liệu có cần phân biệt từng loại lỗi cụ thể cho người dùng, hay dùng chung một thông báo lỗi tổng quát.

## 6.5. Các mốc hiệu lực chính sách năm 2026 không trùng nhau

Từ năm 2026, có ba thay đổi chính sách lớn ảnh hưởng đến việc tính lương, nhưng **có hiệu lực vào ba thời điểm khác nhau**:

| Chính sách | Mốc hiệu lực | Căn cứ |
|---|---|---|
| Lương tối thiểu vùng mới | 01/01/2026 | Nghị định 293/2025/NĐ-CP |
| Giảm trừ gia cảnh mới (15,5tr/6,2tr) và biểu thuế TNCN mới (5 bậc) | "Kỳ tính thuế năm 2026" — có thể hiểu là từ 01/01/2026 khi quyết toán cuối năm | Nghị quyết 110/2025/UBTVQH15; Luật Thuế TNCN 2025 (Luật 109/2025/QH15) |
| Lương cơ sở mới (2.530.000) | 01/07/2026 | Nghị định 161/2026/NĐ-CP |

Luật Thuế TNCN 2025 có hiệu lực thi hành từ 01/07/2026, nhưng lại quy định riêng rằng thu nhập từ tiền lương, tiền công áp dụng ngay từ **kỳ tính thuế năm 2026** — theo thông lệ, thuế TNCN được quyết toán theo năm dương lịch, nên rất có thể giảm trừ gia cảnh và biểu thuế mới sẽ được áp dụng **hồi tố cho toàn bộ năm 2026** khi quyết toán cuối năm, kể cả giai đoạn trước 01/07/2026, dù khi tính tạm nộp hàng tháng trong nửa đầu năm có thể vẫn đang dùng số liệu cũ.

→ **Đề xuất**: BA cần xác nhận rõ với bộ phận pháp chế/thuế:
1. Trong giai đoạn 01/01/2026 – 30/06/2026, hệ thống tính lương hàng tháng nên dùng giảm trừ gia cảnh và biểu thuế cũ (11tr/4,4tr, 7 bậc) hay mới (15,5tr/6,2tr, 5 bậc)?
2. Có cần cơ chế tính bù/quyết toán lại vào cuối năm 2026 nếu nửa đầu năm đã tạm tính theo mức cũ?
3. Lương cơ sở (ảnh hưởng trần BHXH/BHYT) chỉ đổi từ 01/07/2026 — cần đảm bảo không bị nhầm lẫn với mốc đổi lương tối thiểu vùng (01/01/2026) hoặc mốc đổi giảm trừ/biểu thuế.

## 6.6. Phạm vi ngoài tài liệu này

- **Net → Gross**: chiều tính ngược lại (từ Net suy ra Gross) là một nghiệp vụ khác, có quy tắc và rủi ro riêng, không thuộc phạm vi tài liệu này.
- **Trợ cấp bảo hiểm xã hội một lần**: nghiệp vụ tính trợ cấp BHXH một lần, không liên quan đến luồng tính lương hàng tháng Gross → Net.
