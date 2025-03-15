
const A = Big(0.1).plus(Big(0.2)).toNumber();
console.log(A);
// document.addEventListener("DOMContentLoaded", function () {
//
//     const incomeInput = document.getElementById("income");
//     const grossCell = document.getElementById("gross");
//     const insuranceCell = document.getElementById("insurance");
//     const taxCell = document.getElementById("tax");
//     const netCell = document.getElementById("net");
//
//
//     window.calculateSalary = function () {
//         const grossSalary = parseFloat(incomeInput.value) || 0;
//         if (grossSalary <= 0) {
//             alert("Vui lòng nhập số hợp lệ!");
//             return;
//         }
//
//         // net(grossSalary).then((result) => {
//         //     grossCell.textContent = result.gross;
//         //     insuranceCell.textContent = result.totalInsurance;
//         //     taxCell.textContent = result.totalTax;
//         //     netCell.textContent = result.netSalary;
//         // }).catch((error) => {
//         //     console.error("Lỗi khi tính lương:", error);
//         // });
//     };
// });
