$(document).ready(function() {
	getSalesReport();
});

function getSalesReport() {
	$.ajax({
		url: '/admin/salesReport',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if (data.salesInfo) {
				$('#dailySalesCount').text(data.salesInfo.dailySalesCount);
				$('#dailySalesAmount').text(data.salesInfo.dailySalesAmount);
				$('#monthlySalesCount').text(data.salesInfo.monthlySalesCount);
				$('#monthlySalesAmount').text(data.salesInfo.monthlySalesAmount);
			}
			
			if (data.monthlySales) {
				const labels = data.monthlySales.map(item => item.yearMonth);
				const values = data.monthlySales.map(item => item.monthlySalesAmount);
				createMonthlySalesChart(labels, values);
			}
				
			if (data.menuSales) {
				const menuLabels = data.menuSales.map(item => item.menuName);
				const menuValues = data.menuSales.map(item => item.totalSalesCount);
				createMenuPieChart(menuLabels, menuValues);
			}
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

function createMenuPieChart(labels, values) {
	let ctx = document.getElementById('menuPieChart').getContext('2d');

	// 색상 배열 정의
	let colors = [
		'rgba(78, 115, 223, 0.7)', // blue
		'rgba(28, 200, 138, 0.7)', // green
		'rgba(54, 185, 204, 0.7)', // teal
		'rgba(238, 174, 202, 0.7)', // pink
		'rgba(243, 156, 18, 0.7)'  // orange
	];

	let menuPieChart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: labels,
			datasets: [{
				data: values,
				backgroundColor: colors,
				hoverBackgroundColor: colors
			}]
		},
		options: {
			maintainAspectRatio: false,
			legend: {
				display: false
			},
			tooltips: {
				backgroundColor: "rgb(255,255,255)",
				bodyFontColor: "#858796",
				titleMarginBottom: 10,
				titleFontColor: '#6e707e',
				titleFontSize: 14,
				borderColor: '#dddfeb',
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				caretPadding: 10,
				callbacks: {
					label: function(tooltipItem, data) {
						let dataset = data.datasets[tooltipItem.datasetIndex];
						let currentLabel = data.labels[tooltipItem.index];
						let currentValue = dataset.data[tooltipItem.index];
						return currentLabel + ': ' + number_format(currentValue);
					}
				}
			}
		}
	});

	// 동적으로 레전드 추가
	let legendHtml = '<div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">';
	labels.forEach(function(label, index) {
		legendHtml += '<div style="display: flex; align-items: center; margin-left: 20px; width: 100%; box-sizing: border-box;">' +
			'<i class="fas fa-circle" style="color:' + colors[index] + '; margin-right: 5px;"></i> ' +
			'<span>' + label + '</span>' +
			'</div>';
	});
	legendHtml += '</div>';

	$('#menuLegend').html(legendHtml);
}

function createMonthlySalesChart(labels, values) {
	let ctx = document.getElementById('monthlySalesChart').getContext('2d');
	let monthlySalesChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: "Monthly Sales Amount",
				lineTension: 0.3,
				backgroundColor: "rgba(78, 115, 223, 0.05)",
				borderColor: "rgba(78, 115, 223, 1)",
				pointRadius: 3,
				pointBackgroundColor: "rgba(78, 115, 223, 1)",
				pointBorderColor: "rgba(78, 115, 223, 1)",
				pointHoverRadius: 3,
				pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
				pointHoverBorderColor: "rgba(78, 115, 223, 1)",
				pointHitRadius: 10,
				pointBorderWidth: 2,
				data: values,
				fill: true
			}]
		},
		options: {
			maintainAspectRatio: false,
			layout: {
				padding: {
					left: 10,
					right: 25,
					top: 25,
					bottom: 0
				}
			},
			scales: {
				xAxes: [{
					gridLines: {
						display: false
					},
					ticks: {
						maxTicksLimit: 12
					}
				}],
				yAxes: [{
					gridLines: {
						display: false,
						drawBorder: false
					},
					ticks: {
						maxTicksLimit: 5,
						padding: 10,
						callback: function(value) {
							return '$' + number_format(value);
						}
					}
				}]
			},
			legend: {
				display: false
			},
			tooltips: {
				backgroundColor: "rgb(255,255,255)",
				bodyFontColor: "#858796",
				titleMarginBottom: 10,
				titleFontColor: '#6e707e',
				titleFontSize: 14,
				borderColor: '#dddfeb',
				borderWidth: 1,
				xPadding: 15,
				yPadding: 15,
				displayColors: false,
				intersect: false,
				mode: 'index',
				caretPadding: 10,
				callbacks: {
					label: function(tooltipItem) {
						return '판매금액: ' + number_format(tooltipItem.yLabel) + '원';
					}
				}
			}
		}
	});
}

function number_format(number, decimals, dec_point, thousands_sep) {
	number = (number + '').replace(',', '').replace(' ', '');
	let n = !isFinite(+number) ? 0 : +number,
		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function(n, prec) {
			let k = Math.pow(10, prec);
			return '' + Math.round(n * k) / k;
		};
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length < prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}
