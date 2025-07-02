import { calculateOneTimeBenefit } from './oneTimeBenefit.js';

// Format number as VND currency
function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Add a new period card
function addPeriod() {
    const template = document.getElementById('period-template');
    const container = document.getElementById('periods-container');
    const clone = template.content.cloneNode(true);
    
    // Set min/max dates for the period
    const currentDate = new Date();
    const maxDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const startInput = clone.querySelector('.period-start');
    const endInput = clone.querySelector('.period-end');
    startInput.max = maxDate;
    endInput.max = maxDate;

    // Handle remove button
    const removeBtn = clone.querySelector('.btn-remove');
    removeBtn.addEventListener('click', function() {
        this.closest('.period-card').remove();
    });

    // Add validation for date ranges
    startInput.addEventListener('change', function() {
        endInput.min = this.value;
        if (endInput.value && endInput.value < this.value) {
            endInput.value = this.value;
        }
    });

    endInput.addEventListener('change', function() {
        startInput.max = this.value;
        if (startInput.value && startInput.value > this.value) {
            startInput.value = this.value;
        }
    });

    container.appendChild(clone);
}

// Calculate benefit amount
function calculateBenefit() {
    const periods = [];
    const periodCards = document.querySelectorAll('.period-card');

    // Collect data from all period cards
    periodCards.forEach(card => {
        const startMonth = card.querySelector('.period-start').value;
        const endMonth = card.querySelector('.period-end').value;
        const monthlySalary = parseFloat(card.querySelector('.period-salary').value);

        if (startMonth && endMonth && monthlySalary) {
            periods.push({
                startMonth,
                endMonth,
                monthlySalary
            });
        }
    });

    try {
        // Calculate benefit using the imported function
        const result = calculateOneTimeBenefit(periods);

        // Update UI with results
        document.getElementById('totalMonths').textContent = result.breakdown.totalContributionMonths;
        document.getElementById('totalYears').textContent = result.breakdown.totalContributionYears;
        document.getElementById('averageIncome').textContent = formatCurrency(result.breakdown.averageMonthlyContribution);
        document.getElementById('benefitAmount').textContent = formatCurrency(result.oneTimeBenefitAmount);
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add first period card
    addPeriod();

    // Set up event listeners
    document.getElementById('btnAddPeriod').addEventListener('click', addPeriod);
    document.getElementById('btnCalculate').addEventListener('click', calculateBenefit);
});
