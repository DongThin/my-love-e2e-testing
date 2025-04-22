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
    
    // Prevent non-numeric input

    incomeInput.addEventListener('keydown', function(e) {
        // Allow: backspace, delete, tab, escape, enter, navigation keys
        if ([46, 8, 9, 27, 13, 37, 39].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V
            (e.keyCode === 65 && e.ctrlKey === true) ||
            (e.keyCode === 67 && e.ctrlKey === true) ||
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: home, end
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            return;
        }
        // Block any other input that isn't a number
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
            (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    // Clean input on change to ensure only numbers
    incomeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    // Handle paste event to allow only numbers
    incomeInput.addEventListener('paste', function(e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (/^\d*$/.test(pastedText)) {
            this.value = pastedText.replace(/[^\d]/g, '');
        }
    });

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
