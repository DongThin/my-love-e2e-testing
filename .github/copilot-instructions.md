## PROJECT OVERVIEW

This project is designed to provide comprehensive training in various aspects crucial for a manual testers who do not have an IT-software background to become an automation
tester. The project is to focus on salary related apps: salary calculator app, social insurance calculator app, so on (we'll add more on the way).

* Social Insureance app: One-Time Benefit Amount

### Rules for Calculating One-Time Social Insurance Payment (Contributions After 2014 Only)

For social insurance contributions made from **January 1, 2014, onwards**, the rule for calculating the one-time social insurance payment in Vietnam is as follows:

* **Each year of social insurance contribution** from 2014 onwards is compensated with an amount equal to **2 months of the average monthly salary** used for social insurance contributions.

**Formula:**

$$\text{One-Time Benefit Amount} = 2 \times \text{Average Monthly Salary for SI Contribution} \times \text{Contribution Period from 2014 Onwards (in years)}$$

**Explanation of Terms:**

* **Average Monthly Salary for SI Contribution:** This is the total monthly salary on which the individual contributed social insurance (adjusted for inflation/price index according to government regulations for each specific year) divided by the total number of months contributed. The inflation adjustment factor (coefficient for adjusting contribution salaries/incomes) is issued annually by the government to ensure the real value of the money at the time of benefit reception.
* **Contribution Period from 2014 Onwards:** This refers to the total duration (in years) for which the individual contributed to social insurance starting from January 1, 2014.
    * For **partial months**:
        * If the period is from **1 to 6 months**, it is counted as **0.5 years**.
        * If the period is from **7 to 11 months**, it is counted as **1 year**.

---

### Example of One-Time Social Insurance Payment Calculation

Ms. Do Quynh Mai contributed to social insurance from January 2021 to April 2024 with the following contribution salaries:

* **From January 2021 - December 2021 (12 months):** Salary of VND $5,000,000/\text{month}$.
* **From January 2022 - April 2023 (16 months):** Salary of VND $6,000,000/\text{month}$.
* **From May 2023 - April 2024 (12 months):** Salary of VND $7,000,000/\text{month}$.

**Step 1: Determine Total Social Insurance Contribution Period**

Ms. Mai's total social insurance contribution period is $12 + 16 + 12 = 40 \text{ months}$, which equals **3 years and 4 months**. (Since this entire period is after 2014, it will all be calculated using the factor of 2).

**Step 2: Calculate Total Adjusted Monthly Salary for Social Insurance Contribution**

We need to use the **inflation adjustment coefficient (coefficient for adjusting contributed salaries)** corresponding to each year. Based on Circular 20/2023/TT-BLDTBXH (applicable for 2024), and previous circulars:

* Adjustment coefficient for 2021 is **1.07**.
* Adjustment coefficient for 2022 is **1.03**.
* Adjustment coefficient for 2023 is **1.00**.
* Adjustment coefficient for 2024 is **1.00**.

Specifically:

* **Period Jan 2021 - Dec 2021 (12 months):**
    $\text{VND } 5,000,000/\text{month} \times 1.07 \text{ (2021 coeff.)} \times 12 \text{ months} = \text{VND } 64,200,000$

* **Period Jan 2022 - Dec 2022 (12 months):** (Within the VND $6,000,000/\text{month}$ salary)
    $\text{VND } 6,000,000/\text{month} \times 1.03 \text{ (2022 coeff.)} \times 12 \text{ months} = \text{VND } 74,160,000$

* **Period Jan 2023 - Apr 2023 (4 months):** (Within the VND $6,000,000/\text{month}$ salary)
    $\text{VND } 6,000,000/\text{month} \times 1.00 \text{ (2023 coeff.)} \times 4 \text{ months} = \text{VND } 24,000,000$

* **Period May 2023 - Dec 2023 (8 months):** (Within the VND $7,000,000/\text{month}$ salary)
    $\text{VND } 7,000,000/\text{month} \times 1.00 \text{ (2023 coeff.)} \times 8 \text{ months} = \text{VND } 56,000,000$

* **Period Jan 2024 - Apr 2024 (4 months):** (Within the VND $7,000,000/\text{month}$ salary)
    $\text{VND } 7,000,000/\text{month} \times 1.00 \text{ (2024 coeff.)} \times 4 \text{ months} = \text{VND } 28,000,000$

**Total Adjusted Social Insurance Contribution Amount:**
$\text{VND } 64,200,000 + 74,160,000 + 24,000,000 + 56,000,000 + 28,000,000 = \text{VND } 246,360,000$

**Step 3: Calculate Average Monthly Salary for Social Insurance Contribution**

$$\text{Average Monthly Salary for SI Contribution} = \frac{\text{Total Adjusted SI Contribution Amount}}{\text{Total Months Contributed}} = \frac{\text{VND } 246,360,000}{40 \text{ months}} = \text{VND } 6,159,000/\text{month}$$

**Step 4: Calculate One-Time Social Insurance Benefit Amount**

Mai's contribution period is 3 years and 4 months. According to the rule for rounding partial years, 4 months will be counted as 0.5 years.
Therefore, the total contribution period from 2014 onwards is **3.5 years**.

$$\text{One-Time SI Benefit Amount} = 2 \times \text{Average Monthly Salary for SI Contribution} \times \text{Contribution Period (years)}$$
$$\text{One-Time SI Benefit Amount} = 2 \times \text{VND } 6,159,000/\text{month} \times 3.5 \text{ years} = \text{VND } 43,113,000$$

---

Thus, the total **one-time social insurance payment** Ms. Do Quynh Mai can receive is **VND 43,113,000**.

## CODE STYLE
## FOLDER ORGANIZATION
- src/
  - lib/ contains libraries that are using for the apps
  - salary-app/ focuses on salary conversion from gross to net and net to gross
  - solve-quadratic/ to learn js fundamentals

## TECH STACK
- Javascript
- Bootstrap 5.1.3
- Mocha for testing
- Node assertion first then migrated to ChaiJS
- BigJs to do number computation

## PROJECT-SPECIFIC STANDARDS
## WORKFLOW & RELEASE RULES
## REFERENCE EXAMPLES
## PROJECT DOCUMENTATION & CONTEXT SYSTEM
## DEBUGGING
## FINAL DOs AND DON'Ts