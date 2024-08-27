$(document).ready(function() {
	// 페이지 로드 시, select 박스 초기화
	addCategory('menuCategory');

	// 모달이 열릴 때, 테이블 목록 업데이트
	$('#categoryModal').on('show.bs.modal', function () {
		$('#categoryName').val('');
		addCategory('tableCategory');
	});

	// 저장 버튼 클릭 시 카테고리 추가
	$('#categoryModal').on('click', '.btn-primary', function() {
		let categoryName = $('#categoryName').val().trim();
		if (categoryName) {
			createCategoryAjax(categoryName);
		} else {
			alert('카테고리 이름을 입력하세요.');
		}
	});
});

// 카테고리 추가 AJAX 요청을 처리하는 함수
function createCategoryAjax(categoryName) {
	$.ajax({
		url: '/admin/menuCategories',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ categoryName: categoryName }),
		success: function(response) {
			alert('카테고리가 추가되었습니다.');
			$('#categoryModal').modal('show');
			addCategory('tableCategory');
			addCategory('menuCategory');
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 카테고리 추가 모달을 동적으로 만드는 함수
function addCategory(selectId) {
	$.ajax({
		url: '/admin/menuCategories',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			if (selectId === 'menuCategory') {
				// 메뉴 카테고리 select 박스에 옵션 추가
				let selectBox = $('#' + selectId);
				selectBox.find('option:not(:first)').remove();
				data.forEach(function(category) {
					selectBox.append(
						$('<option>', {
							value: category.id,
							text: category.categoryName
						})
					);
				});
			} else {
				// 테이블 목록에 데이터 추가
				let tbody = $('#' + selectId);
				tbody.empty(); // 기존의 테이블 데이터를 비우고 새로 추가
				data.forEach(function(category) {
					let row = $('<tr>').append(
						$('<td>').append(
							$('<input>', {
								type: 'text',
								class: 'form-control',
								value: category.categoryName,
								disabled: true,
								'data-id': category.id
							})
						),
						$('<td>').append(
							$('<button>', {
								type: 'button',
								class: 'btn btn-sm btn-primary edit-btn',
								text: '수정'
							})
						).css({
							'text-align': 'center',
							'vertical-align': 'middle'
						}),
						$('<td>').append(
							$('<button>', {
								type: 'button',
								class: 'btn btn-sm btn-danger delete-btn',
								text: '삭제'
							})
						).css({
							'text-align': 'center',
							'vertical-align': 'middle'
						}),
						$('<td>').append(
							$('<button>', {
								type: 'button',
								class: 'btn btn-sm btn-secondary cancel-btn',
								text: '취소'
							})
						).css({
							'text-align': 'center',
							'vertical-align': 'middle',
							'display': 'none'
						})
					);

					// 테이블에 행 추가
					tbody.append(row);
				});

				// 동적으로 생성된 '수정' 버튼에 이벤트 핸들러 등록
				$('.edit-btn').off('click').on('click', function() {
					let row = $(this).closest('tr');
					let inputField = row.find('input');
					let cancelButton = row.find('.cancel-btn');

					// '수정' 상태로 변경
					if ($(this).text() === '수정') {
						inputField.prop('disabled', false); // input 활성화
						cancelButton.show(); // 취소 버튼 표시
						cancelButton.closest('td').css('display', 'table-cell'); // 취소 버튼 컬럼 표시
						$(this).text('저장').removeClass('btn-primary').addClass('btn-success');
						// 원래 이름을 data에 저장
						row.data('original-name', inputField.val());
					} else {
						// '저장' 상태일 때
						let updateName = inputField.val();
						let categoryId = inputField.data('id');

						updateCategoryAjax(categoryId, updateName, row, inputField, cancelButton, $(this));
					}
				});

				// 동적으로 생성된 '취소' 버튼에 이벤트 핸들러 등록
				$('.cancel-btn').off('click').on('click', function() {
					let row = $(this).closest('tr');
					let inputField = row.find('input');
					let editButton = row.find('.edit-btn');

					// 저장된 original-name으로 되돌림
					let originalName = row.data('original-name');
					inputField.val(originalName);
					inputField.prop('disabled', true); // 다시 비활성화
					$(this).hide(); // 취소 버튼 숨기기
					$(this).closest('td').css('display', 'none'); // 취소 버튼 컬럼 숨기기
					editButton.text('수정').removeClass('btn-success').addClass('btn-primary'); // 수정 버튼 원래 상태로
				});

				// 동적으로 생성된 '삭제' 버튼에 이벤트 핸들러 등록
				$('.delete-btn').off('click').on('click', function() {
					let row = $(this).closest('tr');
					let categoryId = row.find('input').data('id');

					if (confirm('삭제하시겠습니까?')) {
						deleteCategoryAjax(categoryId, row);
					}
				});
			}
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 카테고리 업데이트 AJAX 요청을 처리하는 함수
function updateCategoryAjax(categoryId, updateName, row, inputField, cancelButton, editButton) {
	$.ajax({
		url: '/admin/menuCategories/' + categoryId,
		type: 'PUT',
		contentType: 'application/json',
		data: JSON.stringify({ categoryName: updateName }),
		success: function(response) {
			alert('수정되었습니다.');
			inputField.prop('disabled', true);
			cancelButton.hide();
			cancelButton.closest('td').css('display', 'none');
			editButton.text('수정').removeClass('btn-success').addClass('btn-primary');
			row.data('original-name', updateName);
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 카테고리 삭제 AJAX 요청을 처리하는 함수
function deleteCategoryAjax(categoryId, row) {
	$.ajax({
		url: '/admin/menuCategories/' + categoryId,
		type: 'DELETE',
		success: function(response) {
			alert('삭제되었습니다.');
			row.remove(); // 테이블에서 해당 행 삭제
			addCategory('menuCategory'); // 메뉴 카테고리 select 박스 업데이트
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}
