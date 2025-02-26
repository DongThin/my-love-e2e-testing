var timer;

// Reset tất cả các giá trị về mặc định
$(".btn-thm.btn-red").on("click", function (e) {
	e.preventDefault(); // Ngăn chặn hành động mặc định của nút (chẳng hạn chuyển hướng)

	// Reset các giá trị nhập liệu về mặc định
	$("#inp_loanValue").val(0);
	$("#rng_loanValue").val(2).trigger('input');
	$("#slc_loanValue").val(0).selectpicker('refresh');

	$("#inp_realEstateValue").val(0);
	$("#rng_realEstateValue").val(3).trigger('input');
	$("#slc_realEstateValue").val(0).selectpicker('refresh');

	$("#inp_loanPercent").val(70);
	$("#rng_loanPercent").val(70).trigger('input');

	$("#inp_loanPeriod").val(25);
	$("#rng_loanPeriod").val(25).trigger('input');
	$("#slc_loanPeriod").val(0).selectpicker('refresh');

	$("#inp_preferentialInterestRate").val(7.5);
	$("#rng_preferentialInterestRate").val(7.5).trigger('input');

	$("#inp_preferentialPeriod").val(1);
	$("#rng_preferentialPeriod").val(1).trigger('input');
	$("#slc_preferentialPeriod").val(0).selectpicker('refresh');

	$("#inp_interestRateAfterIncentives").val(11);
	$("#rng_interestRateAfterIncentives").val(11).trigger('input');

	$("#rdb_giaTriKhoanVay").prop("checked", true).trigger('change');
	$("#rdb_laiSuatTuyChinh").prop("checked", true).trigger('change');
	$("#rdb_duNoGiamDan").prop("checked", true).trigger('change');

	$("#ckb_thanhToanTruocHan").prop("checked", false).trigger('change');
	$("#ckb_anHanNoGoc").prop("checked", false).trigger('change');
	$("#ckb_hoTroLaiSuat").prop("checked", false).trigger('change');

	$("#inp_estimatePaymentTime").val(0);
	$("#rng_estimatePaymentTime").val(0).trigger('input');
	$("#slc_estimatePaymentTime").val(0).selectpicker('refresh');

	$("#inp_earlyPaymentTime").val(0);
	$("#rng_earlyPaymentTime").val(0).trigger('input');

	$("#inp_principalDeferral").val(0);
	$("#rng_principalDeferral").val(0).trigger('input');
	$("#slc_principalDeferral").val(0).selectpicker('refresh');

	$("#inp_interestRateSupport").val(0);
	$("#rng_interestRateSupport").val(0).trigger('input');
	$("#slc_interestRateSupport").val(0).selectpicker('refresh');

	// Gọi lại hàm tính toán để cập nhật kết quả
	calculateData();
});

// Lắng nghe sự kiện thay đổi trên dropdown
$("#slc_preferentialPeriod").on("change", function () {
	let isYear = $(this).val() === "0"; // Kiểm tra nếu chọn "Năm"
	let maxValue = isYear ? 5 : 60; // Nếu là "Năm" thì max = 5, nếu là "Tháng" thì max = 60

	// Cập nhật giá trị max cho thanh trượt và trường nhập liệu
	$("#rng_preferentialPeriod").attr("max", maxValue);
	$("#inp_preferentialPeriod").attr("max", maxValue);

	// Đặt lại giá trị hiện tại nếu vượt quá max mới
	let currentValue = parseFloat($("#rng_preferentialPeriod").val());
	if (currentValue > maxValue) {
		currentValue = maxValue;
	}

	// Cập nhật giá trị đồng bộ
	$("#rng_preferentialPeriod").val(currentValue).trigger('input'); // Đảm bảo thanh trượt được cập nhật
	$("#inp_preferentialPeriod").val(currentValue); // Đồng bộ trường nhập liệu

	// Cập nhật giao diện thanh trượt
	let percentage = (currentValue / maxValue) * 100;
	let trackColor = `linear-gradient(to right, #C4161C 0%, #C4161C ${percentage}%, #dddddd ${percentage}%, #dddddd 100%)`;
	$("#rng_preferentialPeriod").css("--track-color", trackColor);
});

$(".calculate-range").on('input', function (e) {
	var id = $(this).attr("id").substring(4)

	var valueFloat = parseFloat($(this).val())

	var value = (valueFloat - $(this).attr('min')) / ($(this).attr('max') - $(this).attr('min')) * 100;
	changeTrackColor(this, 'linear-gradient(to right, #C4161C 0%, #C4161C ' + value + '%, #dddddd ' + value + '%, #dddddd 100%)')
	if (valueFloat != parseFloat($("#inp_" + id).val())) {
		$("#inp_" + id).val(valueFloat)
	}
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {

		//vứt hàm gen khoản vay
		calculateData()
	}, 300);
})

$(".calculate-input").on('keyup', function () {
	var id = $(this).attr("id").substring(4)

	let value = parseFloat($(this).val())

	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {

		if (!isNaN(value)) {
			$("#rng_" + id).val(value).trigger('input')
		}

	}, 300);
})

$("#slc_loanValue").on("change", function () {
	if ($(this).val() == 0) // Tỷ
	{
		$("#rng_loanValue").attr("min", 0)
		$("#rng_loanValue").attr("max", 100)
		$("#rng_loanValue").val(0).trigger("input")
	} else {
		$("#rng_loanValue").attr("min", 0)
		$("#rng_loanValue").attr("max", 9999)
		$("#rng_loanValue").val(0).trigger("input")
	}
})

$("#slc_realEstateValue").on("change", function () {
	if ($(this).val() == 0) // Tỷ
	{
		$("#rng_realEstateValue").attr("max", 100)
		$("#rng_realEstateValue").attr("min", 0)
		$("#rng_realEstateValue").val(0).trigger("input")
	} else {
		$("#rng_realEstateValue").attr("min", 0)
		$("#rng_realEstateValue").attr("max", 9999)
		$("#rng_realEstateValue").val(0).trigger("input")
	}
})


function changeTrackColor(element, color) {
	$(element).css('--track-color', color);
	$(element).addClass('track-changed'); // Thêm class để điều chỉnh màu track
}


//chart
var ctx = document.getElementById('myDonutChart').getContext('2d');
var data = {
	labels: ['Cần trả trước', 'Gốc cần trả', 'Lãi cần trả'], // Nhãn cho từng phần trong donut
	datasets: [{
		data: [300, 50, 100], // Dữ liệu (tổng cộng là 450)
		backgroundColor: ['#3a3d54', '#0055A3', '#ED8A19'], // Màu sắc của các phần
		hoverBackgroundColor: ['#3a3d54', '#0055A3', '#ED8A19'], // Màu sắc khi hover
		borderWidth: 5,       // Slice border width
		borderRadius: 15
	}]
};
var options = {
	responsive: true,
	cutout: '90%',  // Lỗ ở giữa biểu đồ
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			enabled: true, // Hiển thị tooltip khi hover
		},
		// Cấu hình label ở trung tâm
		doughnutLabel: {
			color: 'black',  // Màu chữ
			font: {
				size: 18,  // Kích thước font chữ
				weight: 'bold',  // Độ đậm của font
			},
			formatter: function (chart) {
				return 'Total: 450'; // Giá trị label tại trung tâm
			},
		}
	},
};
// Tạo biểu đồ Donut
var myDonutChart = new Chart(ctx, {
	type: 'doughnut', // Loại biểu đồ là doughnut
	data: data, // Dữ liệu
	options: options // Cấu hình
});


$(document).ready(function () {
	loadDataBank()

	$(".calculate-range").trigger('input')

	$("input[name='rdb_giaTri']").change(function () {
		if ($(this).attr("id") == "rdb_giaTriKhoanVay") {
			$("#form-giaTriKhoanVay").removeClass("d-none")
			$("#form-giaTriBatDongSan").addClass("d-none")
		}

		if ($(this).attr("id") == "rdb_giaTriBatDongSan") {
			$("#form-giaTriKhoanVay").addClass("d-none")
			$("#form-giaTriBatDongSan").removeClass("d-none")
		}

		calculateData();
	})

	$("input[name='rdb_laiSuat']").change(function () {
		if ($(this).attr("id") == "rdb_laiSuatTuyChinh") {
			$("#form-bank").addClass("d-none")
		}

		if ($(this).attr("id") == "rdb_laiSuatTheoNganHang") {
			$("#form-bank").removeClass("d-none")
		}
		calculateData();

	})

	$("#ckb_thanhToanTruocHan").on('change', function () {
		$("#form-thanhToanTruocHan").addClass("d-none")
		if ($(this).is(":checked")) {
			$("#form-thanhToanTruocHan").removeClass("d-none")
		}
		//calculateData();

	})
	$("#ckb_anHanNoGoc").on('change', function () {
		$("#form-anHanNoGoc").addClass("d-none")
		if ($(this).is(":checked")) {
			$("#form-anHanNoGoc").removeClass("d-none")
		}
	})
	$("#ckb_hoTroLaiSuat").on('change', function () {
		$("#form-hoTroLaiSuat").addClass("d-none")
		if ($(this).is(":checked")) {
			$("#form-hoTroLaiSuat").removeClass("d-none")
		}
	})

	$("#slc_bank").on("change", async function () {
		let bankId = $(this).val();
		await loadDataFinancialServiceByBank(bankId)
	})

	$("#slc_finanicalService").on("change", async function () {
		var financialId = $(this).val()
		await detalFinancialServiceById(financialId)
	})

	$("input[name='rdb_phuongThuc']").on("change", function () {
		calculateData();
	})
})

function calculateData() {
	loading.show()

	var giaTri = 0, thoiHanVay = 0, tiLeVay = 100;
	var laiSuatUuDai = 0, thoiGianUuDai = 0, laiSuatSauUuDai = 0;

	//kiểm tra Giá trị khoản vay / Giá trị bất động sản
	if ($("#rdb_giaTriKhoanVay").is(":checked")) {

		//kiểm tra, quy đổi giá trị dang dạng nghìn đồng
		switch ($("#slc_loanValue").val()) {
			case "0": //tỷ
				giaTri = $("#inp_loanValue").val() * 1000000000;
				break;
			case "1": //triệu
				giaTri = $("#inp_loanValue").val() * 1000000;
				break;
		}

	} else if ($("#rdb_giaTriBatDongSan").is(":checked")) {
		//kiểm tra, quy đổi giá trị dang dạng nghìn đồng
		switch ($("#slc_realEstateValue").val()) {
			case "0": //tỷ
				giaTri = $("#inp_realEstateValue").val() * 1000000000;
				break;
			case "1": //triệu
				giaTri = $("#inp_realEstateValue").val() * 1000000;
				break;
		}

		tiLeVay = $("#rng_loanPercent").val()
	}

	//kiểm tra, quy đổi giá trị dang dạng tháng
	switch ($("#slc_loanPeriod").val()) {
		case "0": //năm
			thoiHanVay = $("#inp_loanPeriod").val() * 12;
			break;
		case "1": //tháng
			thoiHanVay = $("#inp_loanPeriod").val();
			break;
	}

	//Lãi suất ưu đãi
	laiSuatUuDai = $("#inp_preferentialInterestRate").val()
	thoiGianUuDai = $("#inp_preferentialPeriod").val()
	laiSuatSauUuDai = $("#inp_interestRateAfterIncentives").val()

	//Phương thức tính lãi
	var isReducingBalance = $("#rdb_duNoGiamDan").is(":checked");

	//thanh toán trước hạn
	var thoiGianDuTinhThanhToan = 0, phiThanhToanTruocHan = 0;
	if ($("#ckb_thanhToanTruocHan").is(":checked")) {
		thoiGianDuTinhThanhToan = $("#inp_estimatePaymentTime").val()
		phiThanhToanTruocHan = $("#inp_earlyPaymentTime").val()
	}

	//ân hạn nợ gốc
	var anHanNoGoc = 0;
	if ($("#ckb_anHanNoGoc").is(":checked")) {
		anHanNoGoc = $("#inp_principalDeferral").val()
	}

	//hỗ trợ lãi suất
	var hoTroLaiSuat = 0;
	if ($("#ckb_hoTroLaiSuat").is(":checked")) {
		hoTroLaiSuat = $("#inp_interestRateSupport").val()
	}


	///tínhtoán
	//số tiền vay
	var soTienVay = giaTri * tiLeVay / 100;

	//số tiền trả trước
	var soTienTraTruoc = giaTri - soTienVay;


	//lãi cần trả
	//nếu có ưu đãi lãi suất
	//var laiSuatUuDai = 0, thoiGianUuDai = 0, laiSuatSauUuDai = 0;
	// if ($("#inp_preferentialPeriod").val().length > 0 && $("#inp_preferentialPeriod").val() > 0) {
	//     switch ($("#slc_preferentialPeriod").val()) {
	//         case "0": //năm
	//             thoiGianUuDai = $("#inp_preferentialPeriod").val() * 12;
	//             break;
	//         case "1": //tháng
	//             thoiGianUuDai = $("#inp_preferentialPeriod").val();
	//             break;
	//     }
	//
	//     laiSuatUuDai = $("#inp_preferentialInterestRate").val()
	// }
	//
	// laiSuatSauUuDai = $("#inp_interestRateAfterIncentives").val()
	// Lấy giá trị từ input và kiểm tra undefined/null
	let preferPeriodVal = $("#inp_preferentialPeriod").val() || 0; // Nếu undefined, sử dụng 0
	let preferPeriodSelectVal = $("#slc_preferentialPeriod").val() || "0"; // Nếu undefined, sử dụng "0"
	let preferentialInterestRate = $("#inp_preferentialInterestRate").val() || 0; // Nếu undefined, sử dụng 0

	// Kiểm tra điều kiện đầu vào
	if (preferPeriodVal.length > 0 && parseFloat(preferPeriodVal) > 0) {
		switch (preferPeriodSelectVal) {
			case "0": // Nếu chọn năm
				thoiGianUuDai = parseFloat(preferPeriodVal) * 12; // Chuyển đổi sang số
				break;
			case "1": // Nếu chọn tháng
				thoiGianUuDai = parseFloat(preferPeriodVal);
				break;
			default:
				thoiGianUuDai = 0; // Giá trị mặc định nếu không khớp
				break;
		}

		// Gán giá trị ưu đãi
		laiSuatUuDai = parseFloat(preferentialInterestRate); // Chuyển đổi sang số nếu cần
	} else {
		// Xử lý trường hợp không nhập đúng giá trị
		console.error("Preferential period value is invalid or undefined.");
	}

	//thanh toán tháng đầu
	var thanhToanThangDau = 0;
	var tienLaiTrongThoiGianUuDai = 0, tienLaiSauThoiGianUuDai = 0;
	var tienPhaiTraTrongThoiGianUuDai = 0, tienPhaiTraSauThoiGianUuDai = 0;
	var tongTienPhaiTra = 0;
	var duNoConLai = 0;
	var tongLaiPhaiTra = 0;
	let tienGocHangThang = soTienVay / thoiHanVay;
	//sửa lại hàm
	let laiSuatThangUuDai = laiSuatUuDai / 12 / 100; // Lãi suất ưu đãi theo tháng
	let laiSuatThangChinhThuc = laiSuatSauUuDai / 12 / 100; // Lãi suất sau ưu đãi theo tháng
	let duNo = soTienVay;
	if (isReducingBalance) // nếu chọn dư nợ giảm dần
	{
		let traGocCoDinh = soTienVay / thoiHanVay;
		for (let i = 1; i <= thoiHanVay; i++) {
			let laiSuatThangHienTai = (i <= thoiGianUuDai) ? laiSuatThangUuDai : laiSuatThangChinhThuc;
			let traLai = duNo * laiSuatThangHienTai;
			let tongTra = traGocCoDinh + traLai;
			duNo -= traGocCoDinh;

			tongLaiPhaiTra += Math.round(traLai);
			tongTienPhaiTra += Math.round(tongTra);
			if (i == 1) {
				thanhToanThangDau = Math.round(tongTra);
			}
		}
		////trường hợp nếu có hoặc còn thời gian ưu đãi
		//if (thoiGianUuDai > 0) {
		//    let tienLaiThangDau = soTienVay * (laiSuatUuDai / 100) / 12
		//    thanhToanThangDau = tienGocHangThang + tienLaiThangDau;

		//    //tính tiền trong khoản thời gian ưuu đãi
		//    let duNoSauNamDau = giaTri * (tiLeVay / 100);
		//    for (let i = 1; i <= thoiGianUuDai; i++) {
		//        let laiThang = duNoSauNamDau * (laiSuatUuDai / 100) / 12;
		//        let tongTienThang = tienGocHangThang + laiThang;

		//        tongLaiPhaiTra += laiThang;
		//        tienPhaiTraTrongThoiGianUuDai += tongTienThang;
		//        duNoConLai -= tienGocHangThang;
		//    }

		//    //sau khoảng thời gian ưu đãi
		//    duNoSauNamDau = giaTri * (tiLeVay / 100) - (tienGocHangThang * thoiGianUuDai);
		//    for (let i = thoiGianUuDai + 1; i <= thoiHanVay; i++) {
		//        let laiThang = duNoSauNamDau * (laiSuatSauUuDai / 100) / 12;

		//        tongLaiPhaiTra += laiThang;
		//        let tongTienThang = tienGocHangThang + laiThang;
		//        tienPhaiTraSauThoiGianUuDai += tongTienThang;
		//        duNoSauNamDau -= tienGocHangThang;

		//    }

		//    tongTienPhaiTra = tienPhaiTraTrongThoiGianUuDai + tienPhaiTraSauThoiGianUuDai;
		//} else {
		//    let tienLaiThangDau = soTienVay * (laiSuatSauUuDai / 100) / 12
		//    thanhToanThangDau = tienGocHangThang + tienLaiThangDau


		//    //tính tiền trong khoản thời gian ưuu đãi
		//    let duNoSauNamDau = giaTri * (tiLeVay / 100);
		//    for (let i = 1; i <= thoiHanVay; i++) {
		//        let laiThang = duNoSauNamDau * (laiSuatSauUuDai / 100) / 12;
		//        let tongTienThang = tienGocHangThang + laiThang;

		//        tongLaiPhaiTra += laiThang;
		//        tienPhaiTraTrongThoiGianUuDai += tongTienThang;
		//        duNoSauNamDau -= tienGocHangThang;
		//    }
		//    tongTienPhaiTra = tienPhaiTraTrongThoiGianUuDai;
		//}


	} else { // trường hợp trả đều hàng tháng
		let laiSuatThangHienTai = (thoiGianUuDai > 0) ? laiSuatThangUuDai : laiSuatThangChinhThuc;

		// Công thức tính số tiền trả hàng tháng theo dư nợ giảm dần
		let tienTraHangThang = (duNo * laiSuatThangHienTai) / (1 - Math.pow(1 + laiSuatThangHienTai, -thoiHanVay));

		for (let i = 1; i <= thoiHanVay; i++) {
			if (i > thoiGianUuDai) {
				laiSuatThangHienTai = laiSuatThangChinhThuc;
				tienTraHangThang = (duNo * laiSuatThangHienTai) / (1 - Math.pow(1 + laiSuatThangHienTai, -(thoiHanVay - i + 1)));
			}

			let traLai = duNo * laiSuatThangHienTai;
			let traGoc = tienTraHangThang - traLai;
			duNo -= traGoc;

			tongLaiPhaiTra += Math.round(traLai);
			tongTienPhaiTra += Math.round(tienTraHangThang);
			if (i == 1) {
				thanhToanThangDau = Math.round(tienTraHangThang);
			}
		}
		////trường hợp nếu có hoặc còn thời gian ưu đãi
		//if (thoiGianUuDai > 0) {
		//    let laiSuatThangDau = (laiSuatUuDai / 100) / 12 || 0;
		//    let tu = laiSuatThangDau * Math.pow((1 + laiSuatThangDau), thoiHanVay)
		//    let mau = (Math.pow((1 + laiSuatThangDau), thoiHanVay) - 1) == 0 ? 1 : Math.pow((1 + laiSuatThangDau), thoiHanVay) - 1;
		//    thanhToanThangDau = soTienVay * tu / mau

		//    thanhToanThangDau = tinhTienThanhToanThang(soTienVay, laiSuatThangDau, thoiHanVay);

		//    tienPhaiTraTrongThoiGianUuDai = thanhToanThangDau * thoiGianUuDai;

		//    var duNoSauNamDau = 0;
		//    if (laiSuatThangDau == 0) {
		//        duNoSauNamDau = soTienVay * Math.pow(1 + laiSuatThangDau, thoiGianUuDai) - (thanhToanThangDau * (Math.pow(1 + laiSuatThangDau, thoiGianUuDai) - 1));
		//    } else {
		//        duNoSauNamDau = soTienVay * Math.pow(1 + laiSuatThangDau, thoiGianUuDai) - (thanhToanThangDau * (Math.pow(1 + laiSuatThangDau, thoiGianUuDai) - 1)) / laiSuatThangDau;
		//    }

		//    const soTienThanhToanThangSau = tinhTienThanhToanThang(duNoSauNamDau, ((laiSuatSauUuDai / 100) / 12), parseInt(thoiHanVay) - thoiGianUuDai);

		//    const tongTienSauNamDau = soTienThanhToanThangSau * (thoiHanVay - thoiGianUuDai);

		//    tongTienPhaiTra = tienPhaiTraTrongThoiGianUuDai + tongTienSauNamDau;
		//    tongLaiPhaiTra = tongTienPhaiTra - soTienVay;
		//} else {
		//    let laiSuatThangDau = (laiSuatSauUuDai / 100) / 12 || 0;
		//    //let tu = laiSuatThangDau * Math.pow((1 + laiSuatThangDau), thoiHanVay)
		//    //let mau = Math.pow((1 + laiSuatSauUuDai), thoiHanVay) - 1;
		//    //thanhToanThangDau = soTienVay * tu / mau

		//    thanhToanThangDau = tinhTienThanhToanThang(soTienVay, laiSuatThangDau, thoiHanVay);
		//    tongTienPhaiTra = thanhToanThangDau * thoiHanVay;
		//    tongLaiPhaiTra = tongTienPhaiTra - soTienVay;
		//}
	}

	$("#txt_can_tra_truoc").text(formatterVND.format(soTienTraTruoc))
	$("#txt_goc_can_tra").text(formatterVND.format(soTienVay))
	$("#txt_lai_can_tra").text(formatterVND.format(tongLaiPhaiTra))

	$("#txt_ti_le_vay").text(tiLeVay)
	$("#txt_thoi_han_vay").text($("#slc_loanPeriod").val() == "0" ? (thoiHanVay / 12) : thoiHanVay)
	$("#txt_loaiThoiGianVay").text($("#slc_loanPeriod").val() == "0" ? "năm" : "tháng")
	$("#txt_ti_le_lai").text(laiSuatSauUuDai)

	$("#total-donut").text(formatterVND.format(tongTienPhaiTra))
	$("#txt_tong_can_tra").text(formatterVND.format(tongTienPhaiTra))
	$("#txt_thanh_toan_thang_dau").text(formatterVND.format(thanhToanThangDau))
	myDonutChart.data.datasets[0].data = [soTienTraTruoc, soTienVay, tongLaiPhaiTra];
	myDonutChart.update();
	loading.hide()
}

function tinhTienThanhToanThang(P, r, n) {
	//trường hợp k có lãi suất
	if (n == 0) {
		n = 1;
	}
	if (r == 0) {
		return P / n;
	}
	let result = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
	return result
}


async function loadDataBank() {
	$("#slc_bank").empty();
	try {
		const res = await httpService.getAsync("bank/api/list")
		if (res.status == "200") {
			$("#slc_bank").empty();
			res.data.forEach(function (item) {
				let html = `<div class="d-flex"> 
                    <img src="${item.coverPhoto}" width="80" class='me-2'>
                    <span>${item.code + " - " + item.name} (${item.shortName})</span>
                </div>`

				var newOption = new Option(item.name, item.id, false, false);
				// Gán thuộc tính data-content với HTML icon
				$(newOption).attr('data-content', html);
				// Thêm option mới vào select
				$('#slc_bank').append(newOption);

				//$("#slc_bank").append(new Option(html, item.id, false, false)).trigger('change')
			})
			$("#slc_bank").selectpicker('refresh');

		}
	} catch (e) {
		$("#slc_bank").selectpicker('refresh');
		console.error(e)
	}
}


async function loadDataFinancialServiceByBank(bankid) {
	$("#slc_finanicalService").empty();

	try {
		const res = await httpService.getAsync("financialServices/api/list-by-bankid/" + bankid);
		if (res.status == "200") {
			res.resources.forEach(function (item) {
				var newOption = new Option(item.name, item.id, false, false);
				$('#slc_finanicalService').append(newOption);
			})
		}
		$("#slc_finanicalService").selectpicker('refresh');
	} catch (e) {
		$("#slc_finanicalService").selectpicker('refresh');
		console.error(e)
	}
}

async function detalFinancialServiceById(id) {
	try {
		const res = await httpService.getAsync("financialServices/api/detail/" + id)
		console.log(res)
		if (res.status == "200") {
			$("#inp_preferentialInterestRate").val(res.data[0].preferentialInterestRates || 0).trigger('change')
			$("#inp_preferentialPeriod").val(res.data[0].preferentialPeriod || 0).trigger('change')
			$("#inp_interestRateAfterIncentives").val(res.data[0].interestRateAfterIncentives || 0).trigger('change')
		}
	} catch (e) {
		console.error(e)
	}
}

function calculateLoanSchedule(model) {
	let schedule = [];
	let duNo = model.soTienVay;
	let laiSuatThangUuDai = model.laiSuatUuDai / 12 / 100; // Lãi suất ưu đãi theo tháng
	let laiSuatThangChinhThuc = model.laiSuatSauUuDai / 12 / 100; // Lãi suất sau ưu đãi theo tháng

	if (model.hinhThucTraNo === "tra-deu-hang-thang") {
		let laiSuatThangHienTai = (model.thoiGianUuDai > 0) ? laiSuatThangUuDai : laiSuatThangChinhThuc;

		// Công thức tính số tiền trả hàng tháng theo dư nợ giảm dần
		let tienTraHangThang = (duNo * laiSuatThangHienTai) / (1 - Math.pow(1 + laiSuatThangHienTai, -model.thoiGianVayThang));

		for (let i = 1; i <= model.thoiGianVayThang; i++) {
			if (i > model.thoiGianUuDai) {
				laiSuatThangHienTai = laiSuatThangChinhThuc;
				tienTraHangThang = (duNo * laiSuatThangHienTai) / (1 - Math.pow(1 + laiSuatThangHienTai, -(model.thoiGianVayThang - i + 1)));
			}

			let traLai = duNo * laiSuatThangHienTai;
			let traGoc = tienTraHangThang - traLai;
			duNo -= traGoc;

			schedule.push({
				Ky: i,
				DuNoDauKy: Math.round(duNo + traGoc),
				TraGocTrongKy: Math.round(traGoc),
				TraLaiTrongKy: Math.round(traLai),
				TongSoTienTra: Math.round(tienTraHangThang),
				DuNoCuoiKy: Math.round(duNo)
			});
		}
	} else if (model.hinhThucTraNo === "du-no-giam-dan") {
		let traGocCoDinh = model.soTienVay / model.thoiGianVayThang;

		for (let i = 1; i <= model.thoiGianVayThang; i++) {
			let laiSuatThangHienTai = (i <= model.thoiGianUuDai) ? laiSuatThangUuDai : laiSuatThangChinhThuc;
			let traLai = duNo * laiSuatThangHienTai;
			let tongTra = traGocCoDinh + traLai;
			duNo -= traGocCoDinh;

			schedule.push({
				Ky: i,
				DuNoDauKy: Math.round(duNo + traGocCoDinh),
				TraGocTrongKy: Math.round(traGocCoDinh),
				TraLaiTrongKy: Math.round(traLai),
				TongSoTienTra: Math.round(tongTra),
				DuNoCuoiKy: Math.round(duNo)
			});
		}
	}
	return {status: "SUCCESS", data: schedule};
}

$("#view-loan-schedule").on("click", function (e) {
	$("#loan-schedule").modal("show");
	//load data kiểm tra khoản vay
	let giaTri = 0;
	thoiHanVay = 0;
	let thoiGianUuDai = 0;
	let laiSuatUuDai = $("#inp_preferentialInterestRate").val();
	let laiSuatSauUuDai = $("#inp_interestRateAfterIncentives").val();
	let phuongThuc = $("#rdb_duNoGiamDan").is(":checked");
	switch ($("#slc_loanValue").val()) {
		case "0": //tỷ
			giaTri = $("#inp_loanValue").val() * 1000000000;
			break;
		case "1": //triệu
			giaTri = $("#inp_loanValue").val() * 1000000;
			break;
	}

	switch ($("#slc_loanPeriod").val()) {
		case "0": //năm
			thoiHanVay = $("#inp_loanPeriod").val() * 12;
			break;
		case "1": //tháng
			thoiHanVay = $("#inp_loanPeriod").val();
			break;
	}

	let preferPeriodVal = $("#inp_preferentialPeriod").val() || 0; // Nếu undefined, sử dụng 0
	let preferPeriodSelectVal = $("#slc_preferentialPeriod").val() || "0"; // Nếu undefined, sử dụng "0"
	let preferentialInterestRate = $("#inp_preferentialInterestRate").val() || 0; // Nếu undefined, sử dụng 0

	// Kiểm tra điều kiện đầu vào
	if (preferPeriodVal.length > 0 && parseFloat(preferPeriodVal) > 0) {
		switch (preferPeriodSelectVal) {
			case "0": // Nếu chọn năm
				thoiGianUuDai = parseFloat(preferPeriodVal) * 12; // Chuyển đổi sang số
				break;
			case "1": // Nếu chọn tháng
				thoiGianUuDai = parseFloat(preferPeriodVal);
				break;
			default:
				thoiGianUuDai = 0; // Giá trị mặc định nếu không khớp
				break;
		}

		// Gán giá trị ưu đãi
		laiSuatUuDai = parseFloat(preferentialInterestRate); // Chuyển đổi sang số nếu cần
	} else {
		// Xử lý trường hợp không nhập đúng giá trị
		console.error("Preferential period value is invalid or undefined.");
	}

	let model = {
		soTienVay: giaTri,
		laiSuatUuDai: laiSuatUuDai,
		laiSuatSauUuDai: laiSuatSauUuDai,
		thoiGianVayThang: thoiHanVay,
		thoiGianUuDai: thoiGianUuDai,
		hinhThucTraNo: phuongThuc == false ? "tra-deu-hang-thang" : "du-no-giam-dan"
	};

	let result = calculateLoanSchedule(model);
	let tienThangDau = result.data[0].TongSoTienTra

	let tableRows = "";
	$.each(result.data, function (index, item) {
		let row = "<tr>";
		$.each(item, function (i, cellData) {
			if (i != "Ky") {
				row += `<td>${formatterVND.format(cellData)}</td>`;
			} else {
				row += `<td>${cellData}</td>`;
			}
		});
		row += "</tr>";

		tableRows += row;
	});

	$("#table-loanSchedule tbody").html(tableRows); // Đưa tất cả vào tbody

	//load data user
	let accountObj = JSON.parse(localStorage.profile);
	$(".loan-schudele-name").text(accountObj.fullName ?? "");
	$(".loan-schudele-phone").text(accountObj.phone ?? "");
	$(".loan-schudele-email").text(accountObj.email ?? "");
	$(".loan-schudele-money").text(formatterVND.format(giaTri));
	$(".loan-schudele-laiSuatUuDai").text($("#inp_preferentialInterestRate").val() + "%");
	$(".loan-schudele-laiSuatSauUuDai").text($("#inp_interestRateAfterIncentives").val() + "%");
	$(".loan-schudele-thoiHan").text(thoiHanVay + ' tháng');
	$(".loan-schudele-thoiHanUuDai").text(thoiGianUuDai + ' tháng');
	$(".loan-schudele-hinhThuc").text(phuongThuc == false ? "Trả đều theo tháng" : "Dư nợ giảm dần");
	$(".loan-schudele-firstMonthMoney").text(formatterVND.format(tienThangDau));
	$(".loan-schudele-createdTime").text(moment().format('DD/MM/YYYY'));
});


$("#print-loan-schedule").on("click", function () {
	$("#form-kiem-tra-vay-von").printThis({
		importCSS: true,  // Giữ nguyên CSS gốc của trang
		importStyle: true, // Giữ các style nội bộ
		pageTitle: "Bản in", // Tiêu đề khi in
	});
});
