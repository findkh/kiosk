$(document).ready(function() {
	function getFormattedDate(offsetDays = 0) {
		const today = new Date();
		today.setDate(today.getDate() + offsetDays);
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	
	
	const endDate = getFormattedDate();
	const startDate = getFormattedDate(-30);
	
	$('#startDate').val(startDate);
	$('#endDate').val(endDate);
	
	getOrderList();
});

function formatDate(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 주문 목록 조회 AJAX 요청 함수
function getOrderList(){
	let status = 'all';
	let startDt = $('#startDate').val();
	let endDt = $('#endDate').val()
	
	$.ajax({
		url: `/admin/order`,
		type: 'GET',
		dataType: 'json',
		data: {
			status: status,
			startDate: startDt,
			endDate: endDt
		},
		success: function(data) {
			makeOrderTable(data); // 데이터 처리 함수 호출
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 주문 테이블 생성 함수
function makeOrderTable(orders) {
	const $orderTbody = $('#orderTbody');
	$orderTbody.empty();

	if (orders.length === 0) return; // 주문이 없는 경우 처리

	// 주문 정보를 그룹화
	const groupedOrders = orders.reduce((acc, order) => {
		const key = `${order.callNumber}-${order.createdDt}-${order.packagingOrSeat}-${order.orderStatus}`;
		if (!acc[key]) {
			acc[key] = {
				callNumber: order.callNumber,
				createdDt: order.createdDt,
				packagingOrSeat: order.packagingOrSeat,
				orderStatus: order.orderStatus,
				items: [],
				orderId: order.id // 주문 ID 추가
			};
		}
		acc[key].items.push({
			menuName: order.orderMenuName,
			qty: order.orderQty,
			id: order.id
		});
		return acc;
	}, {});

	// 그룹화된 주문 정보를 테이블에 추가
	for (const key in groupedOrders) {
		const group = groupedOrders[key];
		const formattedDate = formatDate(group.createdDt);
		const statusText = group.orderStatus === 'w' ? '주문 수락 대기' :
						   group.orderStatus === 'a' ? '주문 수락' : '주문 완료';

		// 헤더 행 생성
		const rowHeader = `
			<tr>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${group.callNumber}</td>
				<td style="vertical-align: middle;">${group.items[0].menuName}</td>
				<td style="text-align: center; vertical-align: middle;">${group.items[0].qty}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${group.packagingOrSeat === 'packaging' ? '포장' : '먹고가기'}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${formattedDate}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${statusText}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">
					<button class="btn btn-danger" onclick="deleteOrder(${group.callNumber})">삭제</button>
				</td>
			</tr>`;

		$orderTbody.append(rowHeader);

		// 나머지 메뉴 항목 생성
		group.items.slice(1).forEach(item => {
			const rowDetail = `
				<tr>
					<td>${item.menuName}</td>
					<td style="text-align: center;">${item.qty}</td>
				</tr>`;
			$orderTbody.append(rowDetail);
		});
	}
}

// 주문 삭제 함수
function deleteOrder(callNumber) {
	console.log(callNumber)
	if (confirm('정말로 이 주문을 삭제하시겠습니까?')) {
		$.ajax({
			url: `/admin/order/${callNumber}`,
			type: 'DELETE',
			success: function() {
				alert('주문이 삭제되었습니다.');
				getOrderList(); // 목록 새로고침
			},
			error: function(xhr, status, error) {
				let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
				alert(`Error ${xhr.status}: ${errorMessage}`);
			}
		});
	}
}