$(document).ready(function() {

});
const socket = new WebSocket('ws://localhost:8080/order-websocket');

socket.onopen = function(event) {
	console.log('웹 소켓 연결');
};

socket.onmessage = function(event) {
	console.log('이벤트 발생')
	const orderUpdate = event.data;
	// 수신한 주문 업데이트 처리
	console.log('Order Update: ', orderUpdate);
};

socket.onclose = function(event) {
	console.log('웹 소켓 연결 종료');
};

socket.onerror = function(error) {
	console.log('WebSocket error: ', error);
};