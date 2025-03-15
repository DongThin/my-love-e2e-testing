 function convertGrossToNet() {  
    // Lấy giá trị thu nhập từ input  
    const incomeInput = document.getElementById('incomeInput').value; 
     
    // Lấy phần tử bảng cho các ô hiển thị kết quả (Hàng thứ 2, cột thứ 1)
    const grossCell = document.querySelector('table tr:nth-child(2) td:nth-child(1)');  
    
    // Cập nhật giá trị Lương Gross trong bảng  
    grossCell.textContent = incomeInput || 0; // Nếu không có giá trị, hiển thị 0  
}  

// Ngăn không cho form tự động gửi và tải lại trang khi nút được nhấn  
function preventFormSubmission(event) {  
    event.preventDefault();  
}  

// Hàm gắn sự kiện khi trang được tải  
window.onload = function() {  
    // Thêm sự kiện click cho nút Gross sang Net  
    document.getElementById('grossToNetButton').addEventListener('click', function(event) {  
        preventFormSubmission(event); // Ngăn gửi form  
        
        this.classList.toggle("style-selected-button")
        convertGrossToNet(); // Gọi hàm để chuyển đổi  
    });  
};