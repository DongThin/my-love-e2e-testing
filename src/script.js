import grossToNet from "./salary-app/grossToNet.js";

console.log(0.1);

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    document.getElementById("btnGrossToNet").addEventListener("click", async function () {
        const income = document.getElementById("income").value; // Lấy dữ liệu từ input
        const result = await grossToNet(income); // Gọi hàm tính toán
        const LOCALE = "vi-VI";

        document.getElementById("gross").textContent = result.gross.toLocaleString(LOCALE); // Lương Gross
        document.getElementById("insurance").textContent = result.totalInsurance.toLocaleString(LOCALE); // Tổng bảo hiểm
        document.getElementById("tax").textContent = result.totalTax.toLocaleString(LOCALE);
        document.getElementById("net").textContent = result.netSalary.toLocaleString(LOCALE);
    });
});
