$(document).ready(function() {
	getOrderList();
});
const socket = new WebSocket('ws://localhost:8080/order-websocket');

socket.onopen = function(event) {
	console.log('웹 소켓 연결');
};

socket.onmessage = function(event) {
	if(event.data == 'New Order'){
		//추후 수정
		setTimeout(() => {
			getOrderList();
		}, 10);
	}
};

socket.onclose = function(event) {
	console.log('웹 소켓 연결 종료');
};

socket.onerror = function(error) {
	console.log('WebSocket error: ', error);
};

// 검색 조건 체인지 이벤트
$('input[name="orderFilter"]').change(function() {
	getOrderList();
});

// 주문 목록 조회 AJAX 요청 함수
function getOrderList(){
	const status = $('input[name="orderFilter"]:checked').val();
	
	console.log(status)
	
    $.ajax({
        url: `/admin/order`,
        type: 'GET',
        dataType: 'json',
        data: {
            status: status,
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
				items: []
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
		const statusOptions = `
			<option value="w" ${group.orderStatus === 'w' ? 'selected' : ''}>주문 수락 대기</option>
			<option value="a" ${group.orderStatus === 'a' ? 'selected' : ''}>주문 수락</option>
			<option value="c" ${group.orderStatus === 'c' ? 'selected' : ''}>주문 완료</option>`;

		// 헤더 행 생성
		const rowHeader = `
			<tr>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${group.callNumber}</td>
				<td style="vertical-align: middle;">${group.items[0].menuName}</td>
				<td style="text-align: center; vertical-align: middle;">${group.items[0].qty}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${group.packagingOrSeat === 'packaging' ? '포장' : '먹고가기'}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">${formattedDate}</td>
				<td style="text-align: center; vertical-align: middle;" rowspan="${group.items.length}">
					<select class="form-control" onchange="updateOrderStatus(this)" data-call-number="${group.callNumber}">${statusOptions}</select>
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

//timestamp를 YYYY-MM-DD HH:MM으로 변경하는 함수
function formatDate(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 주문 상태 업데이트 AJAX 요청 함수
function updateOrderStatus(selectElement) {
	const callNumber = $(selectElement).data('call-number');
	const newStatus = $(selectElement).val();
	
	$.ajax({
		url: `/admin/order/${callNumber}/orderStatus`,
		method: 'PUT',
		contentType: 'application/json', 
		data: JSON.stringify({ orderStatus: newStatus }),
		success: function(response) {
			getOrderList();
		},
		error: function(xhr, status, error) {
			console.error('Error:', error);
		}
	});
}