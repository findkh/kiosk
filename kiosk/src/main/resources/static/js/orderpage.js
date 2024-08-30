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
	
	$.ajax({
		url: `/admin/order/${status}`,
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			makeOrderTable(data);
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
	
	orders.forEach(order => {
		const formattedDate = formatDate(order.createdDt);
		const statusOptions = `
			<option value="w" ${order.orderStatus === 'w' ? 'selected' : ''}>주문 수락 대기</option>
			<option value="a" ${order.orderStatus === 'a' ? 'selected' : ''}>주문 수락</option>
			<option value="c" ${order.orderStatus === 'c' ? 'selected' : ''}>주문 완료</option>`;
		const row = `
			<tr>
				<td>${order.callNumber}</td>
				<td>${order.orderMenuName}</td>
				<td>${order.orderQty}</td>
				<td>${order.packagingOrSeat == 'packaging' ? '포장' : '먹고가기'}</td>
				<td>${formattedDate}</td>
				<td>
					<select class="form-control" onchange="updateOrderStatus(this)" data-order-id="${order.id}">${statusOptions}</select>
				</td>
			</tr>`;
			$orderTbody.append(row);
	});
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
	const orderId = $(selectElement).data('order-id');
	const newStatus = $(selectElement).val();
	
	$.ajax({
		url: `/admin/order/${orderId}/orderStatus`,
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