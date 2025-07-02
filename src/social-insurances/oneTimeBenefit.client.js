import { calculateOneTimeBenefit } from './oneTimeBenefit.js';
import { numberFormatter } from '../utils.js';
import { showToast, initializeToast } from '../utils/toast.js';

const MIN_DATE = '2014-01';

function validateDate(date, fieldName) {
    if (date < MIN_DATE) {
        showToast(`${fieldName} không thể trước tháng 01/2014`, 'error');
        return false;
    }
    return true;
}

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
	removeBtn.addEventListener('click', function () {
		this.closest('.period-card').remove();
	});

	// Add validation for dates
	startInput.addEventListener('change', function() {
		if (!validateDate(this.value, 'Thời gian bắt đầu')) {
			this.value = MIN_DATE;
			return;
		}
		endInput.min = this.value;
		if (endInput.value && endInput.value < this.value) {
			endInput.value = this.value;
		}
	});

	endInput.addEventListener('change', function() {
		if (!validateDate(this.value, 'Thời gian kết thúc')) {
			this.value = startInput.value || MIN_DATE;
			return;
		}
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

    // Validate and collect data from all period cards
    for (const card of periodCards) {
        const startMonth = card.querySelector('.period-start').value;
        const endMonth = card.querySelector('.period-end').value;
        const monthlySalary = parseFloat(card.querySelector('.period-salary').value);

        if (!startMonth || !endMonth) {
            showToast('Vui lòng nhập đầy đủ thông tin thời gian đóng BHXH', 'error');
            return;
        }

        if (!monthlySalary || monthlySalary <= 0) {
            showToast('Vui lòng nhập mức lương đóng BHXH hợp lệ', 'error');
            return;
        }

        periods.push({
            startMonth,
            endMonth,
            monthlySalary
        });
    }

    if (periods.length === 0) {
        showToast('Vui lòng thêm ít nhất một khoảng thời gian đóng BHXH', 'error');
        return;
    }

    try {
        // Calculate benefit using the imported function
        const result = calculateOneTimeBenefit(periods);

        // Update UI with results
        document.getElementById('totalMonths').textContent = result.breakdown.totalContributionMonths;
        document.getElementById('totalYears').textContent = result.breakdown.totalContributionYears;
        document.getElementById('averageIncome').textContent = numberFormatter.format(result.breakdown.averageMonthlyContribution);
        document.getElementById('benefitAmount').textContent = numberFormatter.format(result.oneTimeBenefitAmount);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Add first period card
    addPeriod();

    // Set up event listeners
    document.getElementById('btnAddPeriod').addEventListener('click', addPeriod);
    document.getElementById('btnCalculate').addEventListener('click', calculateBenefit);

    // Initialize toast
    initializeToast();
});
