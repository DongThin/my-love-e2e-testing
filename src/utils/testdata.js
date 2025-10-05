export const testData = {
    salaries: [
        {
            desc: "No tax",
            gross: 5_000_000,
            expected: {
                gross: "5.000.000 ₫",
                insurances: "525.000 ₫",
                taxes: "0 ₫",
                netSalary: "4.475.000 ₫"
            }
        },
        {
            desc: "lv1",
            gross: 12_300_000,
            expected: {
                gross: "12.300.000 ₫",
                insurances: "1.291.500 ₫",
                taxes: "425 ₫",
                netSalary: "11.008.075 ₫"
            }
        },
        {
            desc: "lv2",
            gross: 17_900_000,
            expected: {
                gross: "17.900.000 ₫",
                insurances: "1.879.500 ₫",
                taxes: "252.050 ₫",
                netSalary: "15.768.450 ₫"
            }
        },
        {
            desc: "lv3",
            gross: 23_463_687,
            expected: {
                gross: "23.463.687 ₫",
                insurances: "2.463.687 ₫",
                taxes: "750.000 ₫",
                netSalary: "20.250.000 ₫"
            }
        },
        {
            desc: "lv4",
            gross: 32_402_235,
            expected: {
                gross: "32.402.235 ₫",
                insurances: "3.402.235 ₫",
                taxes: "1.950.000 ₫",
                netSalary: "27.050.000 ₫"
            }
        },
        {
            desc: "lv5",
            gross: 48_044_693,
            expected: {
                gross: "48.044.693 ₫",
                insurances: "4.926.447 ₫",
                taxes: "4.779.562 ₫",
                netSalary: "38.338.685 ₫"
            }
        },
        {
            desc: "lv6",
            gross: 70_391_061,
            expected: {
                gross: "70.391.061 ₫",
                insurances: "5.149.911 ₫",
                taxes: "10.422.345 ₫",
                netSalary: "54.818.805 ₫"
            }
        },
        {
            desc: "lv7",
            gross: 101_675_978,
            expected: {
                gross: "101.675.978 ₫",
                insurances: "5.438.000 ₫",
                taxes: "19.983.292 ₫",
                netSalary: "76.254.686 ₫"
            },
        },
    ]

}
