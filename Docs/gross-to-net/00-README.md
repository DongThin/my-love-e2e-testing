# Đặc tả nghiệp vụ: Tính lương Gross → Net

## 1. Mục đích

Tài liệu này mô tả cách tính **lương Net (thực lãnh)** từ **lương Gross**, bao gồm: bảo hiểm bắt buộc, giảm trừ gia cảnh và thuế thu nhập cá nhân (TNCN) lũy tiến từng phần, áp dụng theo quy định của Việt Nam.

Tài liệu phục vụ cho BA/PM thống nhất yêu cầu nghiệp vụ, và Tester thiết kế test case kiểm thử chức năng tính lương.

## 2. Phạm vi tài liệu

| File | Nội dung |
|---|---|
| [01-tong-quan-nghiep-vu.md](./01-tong-quan-nghiep-vu.md) | Input/Output, luồng xử lý tổng quát, quy tắc nghiệp vụ |
| [02-bao-hiem-bat-buoc.md](./02-bao-hiem-bat-buoc.md) | Công thức tính BHXH, BHYT, BHTN; trần đóng; bảng chính sách theo thời gian |
| [03-giam-tru-thue-tncn.md](./03-giam-tru-thue-tncn.md) | Giảm trừ gia cảnh, giảm trừ người phụ thuộc, biểu thuế lũy tiến 7 bậc |
| [04-vi-du-tinh-toan.md](./04-vi-du-tinh-toan.md) | Ví dụ tính toán chi tiết từng bước |
| [05-test-case-qa.md](./05-test-case-qa.md) | Ma trận test case cho QA |
| [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md) | Các câu hỏi nghiệp vụ còn mở, rủi ro cần xác nhận trước khi chốt đặc tả |

## 3. Đối tượng đọc

- **BA/PM**: dùng để xác nhận yêu cầu nghiệp vụ, trao đổi với phòng nhân sự/khách hàng.
- **Tester**: dùng để thiết kế test case, xác định các kịch bản cần kiểm thử.
- **Dev**: dùng làm căn cứ xây dựng chức năng tính lương.

## 4. Căn cứ xây dựng tài liệu

Tài liệu được xây dựng dựa trên các quy định hiện hành về: mức đóng bảo hiểm xã hội (BHXH), bảo hiểm y tế (BHYT), bảo hiểm thất nghiệp (BHTN) bắt buộc; mức giảm trừ gia cảnh; và biểu thuế lũy tiến từng phần áp dụng cho thu nhập từ tiền lương, tiền công — kết hợp với yêu cầu nghiệp vụ tính lương nội bộ của đơn vị.

## 5. Bảng thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| Gross | Lương gộp, tổng thu nhập trước khi trừ bảo hiểm và thuế |
| Net | Lương thực lãnh sau khi trừ bảo hiểm và thuế |
| BHXH | Bảo hiểm xã hội — 8% |
| BHYT | Bảo hiểm y tế — 1,5% |
| BHTN | Bảo hiểm thất nghiệp — 1% |
| Lương cơ sở | Mức lương do Nhà nước quy định, áp dụng thống nhất toàn quốc, dùng làm trần đóng BHXH/BHYT |
| Lương tối thiểu vùng | Mức lương tối thiểu theo từng vùng (1–4), dùng làm trần đóng BHTN |
| Giảm trừ gia cảnh | Mức giảm trừ cho bản thân người nộp thuế trước khi tính thuế TNCN |
| Giảm trừ người phụ thuộc | Mức giảm trừ theo số người phụ thuộc khai báo |
| Thu nhập chịu thuế | Phần thu nhập còn lại sau khi trừ bảo hiểm và các khoản giảm trừ, dùng để tính thuế TNCN |
| TNCN | Thuế thu nhập cá nhân |

## 6. Thông tin tài liệu

- Người soạn: Kien Alang (BA/PM/Tester)
- Phiên bản: 1.1
- Trạng thái: Dự thảo — chờ xác nhận nghiệp vụ (xem [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md))

### Lịch sử cập nhật

| Phiên bản | Ngày | Nội dung thay đổi |
|---|---|---|
| 1.1 | 2026-10-18 | Bổ sung quy định áp dụng từ 2026: lương tối thiểu vùng mới (01/01/2026), lương cơ sở mới (01/07/2026), giảm trừ gia cảnh mới và biểu thuế TNCN 5 bậc (từ kỳ tính thuế 2026); bổ sung câu hỏi mở về các mốc hiệu lực không trùng nhau trong năm 2026 |
| 1.0 | 2026-10-17 | Soạn thảo lần đầu |
