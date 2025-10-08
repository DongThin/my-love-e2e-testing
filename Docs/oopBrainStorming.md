# OOP

- 15 lớp (Mỗi khối 5 lớp, từ 1 tới 5)

    - Thầy hiệu trưởng phân công giáo viên chủ nhiệm và lên sĩ số cho từng lớp: 
        - Thầy HT giao danh sachs lớp cho từng giáo viên
        
    - Cô Thanh chủ nhiệm lớp 10/1. 
        - Giáo viên đọc tên để nhận học sinh lớp mình > về phòng học 
        - Kiểm tra Sĩ số
        - Sắp xếp mâm: 1 bàn 4-6 bạn (Nam nữ xen kẽ)

    - Học sinh Thồn: 
        - Nhận lớp khi nghe giáo viên đọc tên
        - Tìm parners mâm chung
        - Nhận phiếu ăn từ GV
        - Đi ăn cùng parners mâm > Collect phiếu ăn trưa/chiều của mn trong mâm 
        - Đưa phiếu cho cô nuôi để nhận bữa trưa/chiều của mâm
        
    - Cô nuôi An:
    
        - Số lượng học sinh
        - Số lượng mâm theo phân công của GVCN
        - Thực đơn theo tuần
        - Phát đồ ăn sáng (theo người)
        - Lên kế hoach đi chợ
        - Đi chợ
        - Nấu ăn  > Chia đủ mâm 
        - Phát đồ ăn trưa (theo mâm) > Bằng phiếu từ học sinh 
        - Kiểm tra phiếu ĐÚNG NGÀY ĐÚNG SỐ LƯỢNG
        - Kiểm kê đã đủ hay chưa? 
        - Vệ sinh chén bát + nhà bếp
        - Chuẩn bị bữa chiều: Giống bữa trưa

---
- Đối tượng
    - Học sinh
    - Mâm ăn (5-6 học sinh)
    - Phiếu ăn
    - Cô nuôi

- Học sinh: 
    - Tên
    - Lớp
    - Nhóm mâm ăn
    - Có thể trở thành người đại diện (Người đại diện > Thu và gởi phiếu ăn tới cô nuôi)
- Mâm ăn: 
    - Danh sách học sinh trong mâm
    - Tổng số phiếu trong mâm
    - Chọn người đại diện
- Phiếu ăn
    - Ngày
    - Bữa
    - Số lượng phiếu trên mâm
    - Verify ngày, bữa có hợp lệ không? => Trạng thái Valid/Invalid
- Cô nuôi:
    - Tên
    - Kiểm tra số phiếu, hợp lệ ngày/bữa không?
    - Đếm tổng suất ăn trong ngày
