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
});