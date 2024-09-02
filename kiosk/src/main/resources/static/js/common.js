function createCommaFormat(num) {
	return Number(num).toLocaleString();
}

function removeCommaFormat(num) {
	return num.split(',').join('');
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

function getFormattedDate(offsetDays = 0) {
	const today = new Date();
	today.setDate(today.getDate() + offsetDays);
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}