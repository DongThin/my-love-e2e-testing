# 5. Ma trận Test Case (QA)

| ID | Mô tả | Input | Kết quả mong đợi | Loại |
|---|---|---|---|---|
| TC-01 | Gross cơ bản, không người phụ thuộc, dưới mọi trần BH, thuế 1 bậc | gross=17.000.000, dependents=0, region=1 | netSalary=15.004.250 (xem Ví dụ 1) | Happy path |
| TC-02 | Gross chưa đủ giảm trừ bản thân → thuế = 0 | gross=12.290.500, dependents=0 | totalTax=0 | Boundary |
| TC-03 | Có 1 người phụ thuộc, thu nhập chịu thuế = 0 | gross=12.290.500, dependents=1 | totalTax=0, giảm trừ người phụ thuộc=4.400.000 | Boundary |
| TC-04 | Có 1 người phụ thuộc, thuế tính hết trong bậc 1 | gross=16.000.000, dependents=1 | thu nhập chịu thuế=600.000 | Happy path |
| TC-05 | Có 1 người phụ thuộc, thuế vượt bậc 1 | gross=23.463.687, dependents=1 | thu nhập chịu thuế=8.063.687 | Happy path |
| TC-06 | Gross vượt trần BHXH/BHYT (theo lương cơ sở) | gross=29.900.000, region=1, mốc 07/2023 | BHXH=2.392.000, BHYT=448.500 (trần 29,8tr) | Boundary |
| TC-07 | Gross vượt trần BHTN (theo lương tối thiểu vùng), lặp cho 4 vùng | gross vượt trần vùng tương ứng, region=1..4 | BHTN bị chặn đúng trần từng vùng | Boundary |
| TC-08 | Thuế TNCN áp dụng đủ 7 bậc | thu nhập chịu thuế=84.644.000 | totalTax=19.775.400 | Boundary |
| TC-09 | Nhập vùng không hợp lệ (ngoài 1–4) | region=5 | Hệ thống từ chối, báo lỗi rõ ràng, không tính ra kết quả | Negative |
| TC-10 | Ngày tính lương trước 01/07/2022 (chưa có chính sách) | date=2020-07-01 | Hệ thống từ chối, báo lỗi rõ ràng | Negative |
| TC-11 | Hệ thống gặp lỗi khi tính bảo hiểm (ví dụ gián đoạn dữ liệu chính sách) | tình huống lỗi hệ thống | Trả về thông báo lỗi, không trả kết quả sai lệch | Negative |
| TC-12 | Hệ thống gặp lỗi khi tính thuế | tình huống lỗi hệ thống | Trả về thông báo lỗi, không trả kết quả sai lệch | Negative |
| TC-13 | Gross = 0 | gross=0 | netSalary=0, không phát sinh bảo hiểm/thuế | Boundary |
| TC-14 | Gross âm (dữ liệu không hợp lệ) | gross=-1.000.000 | **Cần BA xác nhận**: hệ thống nên từ chối/validate đầu vào, không nên tính ra số tiền bảo hiểm hoặc Net âm | Negative — ưu tiên cao |
| TC-15 | Đổi mốc chính sách đúng ngày hiệu lực (ví dụ 30/06 vs 01/07) | gross cố định, date lần lượt trước/đúng ngày 01/07/2022, 01/07/2023, 01/07/2024 | Số tiền bảo hiểm thay đổi đúng theo mốc chính sách tương ứng | Boundary |
| TC-16 | Giảm trừ người phụ thuộc lớn hơn thu nhập sau bảo hiểm | gross nhỏ, số người phụ thuộc lớn | thu nhập chịu thuế=0, không âm | Boundary |
| TC-17 | Tính lương đầy đủ theo bộ quy định mới nhất (lương cơ sở, lương tối thiểu vùng, giảm trừ gia cảnh, biểu thuế 5 bậc) | gross=50.000.000, dependents=1, region=1, kỳ lương từ 01/07/2026 | netSalary=42.945.000 (xem Ví dụ 4) | Happy path |
| TC-18 | Kỳ lương giao thời 01/01/2026 – 30/06/2026: lương tối thiểu vùng đã đổi mới nhưng lương cơ sở vẫn ở mức cũ | gross vượt trần cũ của lương cơ sở nhưng chưa vượt trần mới của lương tối thiểu vùng, date trong khoảng 01/01/2026 – 30/06/2026 | Trần BHXH/BHYT dùng lương cơ sở cũ (2.340.000), trần BHTN dùng lương tối thiểu vùng mới | Boundary — ưu tiên cao |
| TC-19 | Kỳ lương trong năm 2026 nhưng trước 01/07/2026: áp dụng giảm trừ gia cảnh/biểu thuế nào | gross cố định, dependents cố định, date = 01/02/2026 | **Cần BA xác nhận**: dùng giảm trừ/biểu thuế mới (15,5tr/6,2tr, 5 bậc) ngay từ 01/01/2026, hay chỉ từ 01/07/2026 khi luật có hiệu lực thi hành | Negative/Boundary — chưa rõ nghiệp vụ |

## Ghi chú ưu tiên kiểm thử

1. **TC-14** (gross âm) — mức độ rủi ro cao nhất, cần BA làm rõ quy tắc validate đầu vào trước khi coi là hành vi đúng.
2. **TC-18, TC-19** — mức độ rủi ro cao do năm 2026 có nhiều mốc hiệu lực chính sách khác nhau (01/01/2026, 01/07/2026, "kỳ tính thuế 2026") không trùng nhau; cần BA chốt rõ trước khi coi là hành vi đúng — xem [06-ghi-chu-rui-ro.md](./06-ghi-chu-rui-ro.md).
3. **TC-09, TC-10, TC-15** — các kịch bản liên quan đến lựa chọn đúng chính sách theo ngày và validate vùng/ngày, cần kiểm thử kỹ ở mức tích hợp đầu-cuối (từ Gross đến Net), không chỉ ở từng bước riêng lẻ.
4. **TC-13** — cần kiểm thử tường minh cho gross=0 để tránh phát sinh lỗi về sau (regression).
