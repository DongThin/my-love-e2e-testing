import grossToNet from "./salary-app/grossToNet.js";

const numberFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

let grossElement, insuranceElement, taxElement, netElement, incomeInput;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    
    // Cache DOM elements
    grossElement = document.getElementById("gross");
    insuranceElement = document.getElementById("insurance");
    taxElement = document.getElementById("tax");
    netElement = document.getElementById("net");
    incomeInput = document.getElementById("income");
    
    // Convert back to plain number when focusing
    incomeInput.addEventListener('focus', function() {
        if (this.value) {
            const numValue = parseFloat(this.value.replace(/[^\d]/g, ''));
            if (!isNaN(numValue)) {
                this.value = numValue;
            }
        }
    });
    
    // Format when clicking outside
    incomeInput.addEventListener('blur', function() {
        if (this.value) {
            const numValue = parseFloat(this.value.replace(/[^\d]/g, ''));
            if (!isNaN(numValue)) {
                this.value = numberFormatter.format(numValue);
            }
        }
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
