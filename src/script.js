import grossToNet from "./salary-app/grossToNet.js";
import Big from "./lib/big.js";
const A = Big(0.1).plus(Big(0.2)).toNumber();
console.log(A);

document.querySelector(".btn-primary").addEventListener("click", async function () {

    let income = parseFloat(document.getElementById("income").value); // Lấy dữ liệu từ input
    let result = await grossToNet(income); // Gọi hàm tính toán
    document.getElementById("gross").textContent = result.gross.toLocaleString("de-DE"); // Lương Gross
    document.getElementById("insurance").textContent = result.totalInsurance.toLocaleString("de-DE"); // Tổng bảo hiểm
    document.getElementById("tax").textContent = result.totalTax.toLocaleString("de-DE");
    document.getElementById("net").textContent = result.netSalary.toLocaleString("de-DE");
});
