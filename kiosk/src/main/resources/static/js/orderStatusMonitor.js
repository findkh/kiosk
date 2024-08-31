$(document).ready(function() {
	function createEventSource() {
		const eventSource = new EventSource('/admin/stream');

		eventSource.onmessage = function(event) {
			const rawMessage = event.data;
			const currentCallMatch = rawMessage.match(/currentCall: (\d+)/);
			const callListMatch = rawMessage.match(/CallList: ([\d, ]+)/);
			const currentCall = currentCallMatch ? currentCallMatch[1] : null;

			let callList = [];
			if (callListMatch) {
				callList = callListMatch[1].split(',').map(item => item.trim());
			}

			const callNumberDiv = $('.call-number');
			if (currentCall) {
				callNumberDiv.html(`<div class="order-item" style="color:red; font-size: xxx-large;">${currentCall}</div>`);
			} else {
				callNumberDiv.empty();
			}

			const prevCallNumberDiv = $('.prev-call-number');
			prevCallNumberDiv.empty();

			callList.forEach(item => {
				prevCallNumberDiv.append(`<div class="order-item">${item}</div>`);
			});
		};

		eventSource.onerror = function() {
			console.error('SSE connection error. Reconnecting...');
			eventSource.close();
			setTimeout(createEventSource, 3000); // Reconnect after 3 seconds
		};
	}

	createEventSource(); // Initialize SSE connection
});