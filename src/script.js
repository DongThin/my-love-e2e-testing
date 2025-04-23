import grossToNet from "./salary-app/grossToNet.js";

const numberFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Cache DOM elements
    const grossElement = document.getElementById("gross");
    const insuranceElement = document.getElementById("insurance");
    const taxElement = document.getElementById("tax");
    const netElement = document.getElementById("net");
    const incomeInput = document.getElementById("income");

    // Clean input on change to ensure only numbers
    incomeInput.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });

    // Convert back to plain number when focusing
    incomeInput.addEventListener('focus', function (e) {
        if (e.target.value === "") {
            return;
        }

        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });

    // Format when clicking outside
    incomeInput.addEventListener('blur', function (e) {
        if (e.target.value === "") {
            return;
        }

        const numValue = parseFloat(e.target.value);
        e.target.value = numberFormatter.format(numValue);

    });

    document.getElementById("btnGrossToNet").addEventListener("click", async function () {
        const income = parseFloat(incomeInput.value.replace(/[^\d]/g, ''));
        const result = await grossToNet(income);
        
        grossElement.textContent = numberFormatter.format(result.gross);
        insuranceElement.textContent = numberFormatter.format(result.totalInsurance);
        taxElement.textContent = numberFormatter.format(result.totalTax);
        netElement.textContent = numberFormatter.format(result.netSalary);
    });
});
