export const testData = {
    salary: [
        {
            desc: "No tax",
            luongGross: 5_000_000,
            expected: {
                luongGross: "5.000.000 ₫",
                baoHiem: "525.000 ₫",
                thueTNCN: "0 ₫",
                luongNet: "4.475.000 ₫"
            }
        },
        {
            desc: "lv1",
            luongGross: 12_300_000,
            expected: {
                luongGross: "12.300.000 ₫",
                baoHiem: "1.291.500 ₫",
                thueTNCN: "425 ₫",
                luongNet: "11.008.075 ₫"
            }
        },
        {
            desc: "lv2",
            luongGross: 17_900_000,
            expected: {
                luongGross: "17.900.000 ₫",
                baoHiem: "1.879.500 ₫",
                thueTNCN: "252.050 ₫",
                luongNet: "15.768.450 ₫"
            }
        },
        {
            desc: "lv3",
            luongGross: 23_463_687,
            expected: {
                luongGross: "23.463.687 ₫",
                baoHiem: "2.463.687 ₫",
                thueTNCN: "750.000 ₫",
                luongNet: "20.250.000 ₫"
            }
        },
        {
            desc: "lv4",
            luongGross: 32_402_235,
            expected: {
                luongGross: "32.402.235 ₫",
                baoHiem: "3.402.235 ₫",
                thueTNCN: "1.950.000 ₫",
                luongNet: "27.050.000 ₫"
            }
        },
        {
            desc: "lv5",
            luongGross: 48_044_693,
            expected: {
                luongGross: "48.044.693 ₫",
                baoHiem: "4.926.447 ₫",
                thueTNCN: "4.779.562 ₫",
                luongNet: "38.338.685 ₫"
            }
        },
        {
            desc: "lv6",
            luongGross: 70_391_061,
            expected: {
                luongGross: "70.391.061 ₫",
                baoHiem: "5.149.911 ₫",
                thueTNCN: "10.422.345 ₫",
                luongNet: "54.818.805 ₫"
            }
        },
        {
            desc: "lv7",
            luongGross: 101_675_978,
            expected: {
                luongGross: "101.675.978 ₫",
                baoHiem: "5.438.000 ₫",
                thueTNCN: "19.983.292 ₫",
                luongNet: "76.254.686 ₫"
            },
        },
    ]

}
