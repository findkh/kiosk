$(document).ready(function() {
	// 페이지 로드 시, select 박스 초기화
	addCategory('menuCategory');
	
	getMenuList();

	// 카테고리 모달이 열릴 때, 테이블 목록 업데이트
	$('#categoryModal').on('show.bs.modal', function () {
		$('#categoryName').val('');
		addCategory('tableCategory');
	});
	
	// 메뉴 추가 모달이 열릴 때, 테이블 목록 업데이트
	$('#menuModal').on('show.bs.modal', function () {
		addCategory('menuCategoryModal');
	});
	
	// 카테고리 저장 버튼 클릭 시 카테고리 추가
	$('#saveCategoryBtn').on('click', function() {
		let categoryName = $('#categoryName').val().trim();
		if (categoryName) {
			createCategoryAjax(categoryName);
		} else {
			alert('카테고리 이름을 입력하세요.');
		}
	});
	
	// 메뉴 저장 버튼 클릭 시 유효성 검사 및 메뉴 추가
	$('#saveMenuButton').on('click', function() {
		// 유효성 검사
		const menuCategory = $('#menuCategoryModal').val();
		const menuImage = $('#menuImageInput').prop('files')[0]; // 파일 객체
		const menuName = $('#menuNameInput').val().trim();
		const menuPrice = $('#menuPriceInput').val().trim();
		
		let errorMessage = '';
		
		if (!menuCategory) {
			errorMessage += '메뉴 카테고리를 선택하세요.\n';
		}
		if (!menuImage) {
			errorMessage += '메뉴 이미지를 추가하세요.\n';
		}
		if (!menuName) {
			errorMessage += '메뉴 이름을 입력하세요.\n';
		}
		if (!menuPrice) {
			errorMessage += '메뉴 가격을 입력하세요.\n';
		} else if (isNaN(menuPrice) || Number(menuPrice) < 0) {
			errorMessage += '메뉴 가격은 0 이상의 숫자여야 합니다.\n';
		}
	
		if (errorMessage) {
			alert(errorMessage);
			return false;
		}
		
		const formData = new FormData();
		
		const menuDTO = {
			menuName: menuName,
			menuCategory: menuCategory,
			menuPrice: menuPrice,
			isActive: true
		};
	
		const menuImgDTO = {
			originFileName: menuImage.name,
			fileType: menuImage.type,
			fileSize: menuImage.size.toString()
		};
	
		// FormData에 데이터 추가
		formData.append('menuDTO', JSON.stringify(menuDTO));
		formData.append('menuImages', JSON.stringify(menuImgDTO));
		formData.append('menuImageFile', menuImage);
	
		// 서버로 데이터 전송
		$.ajax({
			url: '/admin/menu',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function(response) {
				alert('메뉴가 저장되었습니다.');
				$('#menuModal').modal('hide'); // 모달 닫기
			},
			error: function(xhr, status, error) {
				let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
				alert(`Error ${xhr.status}: ${errorMessage}`);
			}
		});
	});
	
	// 입력 필드에서 엔터 키를 감지
	$('#keywordInput').on('keypress keyup', function(event) {
		if (event.which === 13) {
			event.preventDefault();
			handleEnterKey();
		}
	});
});

function handleEnterKey() {
	console.log('Enter key pressed!');
	getMenuList();
}

// 모든 메뉴의 리스트를 조회
function getMenuList() {
	const category = $('#menuCategory').val();
	const keyword = $('#keywordInput').val();
	
	$.ajax({
		url: '/admin/menu',
		type: 'GET',
		dataType: 'json',
		data: {
			category: category,
			name: keyword
		},
		success: function(data) {
			if (data.length <= 0) {
				console.log('데이터가 존재하지 않습니다.');
				$('#menuListDiv').html('데이터가 존재하지 않습니다.');
			} else {
				$('#menuListDiv').empty();
				
				// 메뉴 카드 생성
				data.forEach(menu => {
					$('#menuListDiv').append(createMenuCard(menu));
				});
				
				// 카테고리 추가
				addCategory('menuCategoryCard');
				
				// 이미지 로드
				data.forEach(menu => {
					if (menu.imgId != null) {
						getMenuImage(menu.id, menu.imgId);
					}
					
					if(menu.menuCategory != null){
						let selectBox = $(`#menuCategory-${menu.id}`);
						
						// 추후 수정 필요...
						setTimeout(() => {
							if (selectBox.find(`option[value="${menu.menuCategory}"]`).length) {
								selectBox.val(menu.menuCategory).change();
							}
						}, 10);
						
						selectBox.attr('data-original', menu.menuCategory)
					}
				});
				
				// 토글 버튼 초기화
				$('#menuListDiv input[data-toggle="toggle"]').each(function() {
					$(this).bootstrapToggle();
				});
			}
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 메뉴 이미지를 가져오는 함수
function getMenuImage(menuId, imgId) {
	$.ajax({
		url: `/menuImage/${imgId}`,
		type: 'GET',
		xhrFields: {
			responseType: 'blob' // 이미지 데이터를 Blob 형식으로 받기
		},
		success: function(data) {
			const imageUrl = URL.createObjectURL(data);
			$(`#menuImage-${menuId}`).attr('src', imageUrl)
			$(`#menuImage-${menuId}`).attr('data-original', imgId)
		},
		error: function(xhr, status, error) {
			alert(`Error: ${xhr.status}, Message: ${xhr.responseText}`);
		}
	});
}
	
// 메뉴 조회 이벤트
$('#menuCategory').on('change', function(){
	getMenuList();
})
	
// 메뉴 조회 이벤트
$('#searchBtn').click(function(){
	getMenuList();
})
	
// 메뉴를 동적으로 생성하는 함수
function createMenuCard(menu) {
	return `
		<div class="col-md-6 col-lg-3 mb-5">
			<div class="card mx-auto">
				<div class="d-flex align-items-center justify-content-center" style="background-color:#f5f5f5">
					<img id="menuImage-${menu.id}" class="img-fluid item_img" src="default_image.jpg" />
				</div>
				<div class="card-body2">
					<input type="file" id="menuImageUpload-${menu.id}" class="d-none menuImageUpload mt-3 pl-3" data-id="${menu.id}" />
					<div class="form-row align-items-center mb-3 mt-3">
						<div class="col-auto pl-3">
							<label for="menuCategory-${menu.id}" class="col-form-label">카테고리</label>
						</div>
						<div class="col pr-3">
							<select id="menuCategory-${menu.id}" class="custom-select menuCategoryCard" disabled></select>
						</div>
					</div>
					<div class="form-row align-items-center mb-3">
						<div class="col-auto pl-3">
							<label for="menuName-${menu.id}" class="col-form-label">이름</label>
						</div>
						<div class="col pr-3">
							<input type="text" id="menuName-${menu.id}" class="form-control" value="${menu.menuName}" disabled data-original="${menu.menuName}" />
						</div>
					</div>
					<div class="form-row align-items-center mb-3">
						<div class="col-auto pl-3">
							<label for="menuPrice-${menu.id}" class="col-form-label">가격</label>
						</div>
						<div class="col pr-3">
							<input type="text" id="menuPrice-${menu.id}" class="form-control" value="${menu.menuPrice}" disabled data-original="${menu.menuPrice}" />
						</div>
					</div>
					<div class="form-row align-items-center mb-3">
						<div class="col-auto pl-3">
							<label for="isActive-${menu.id}" class="col-form-label">판매 상태</label>
						</div>
						<div class="col">
							<input type="checkbox" id="isActive-${menu.id}" ${menu.isActive ? 'checked' : ''} data-toggle="toggle" data-size="sm" data-on="On" data-off="Off" disabled data-original="${menu.isActive}" />
						</div>
					</div>
				</div>
				<div class="card-footer text-center">
					<button type="button" class="btn btn-primary menuEditBtn" data-id="${menu.id}">수정</button>
					<button type="button" class="btn btn-danger btn-delete" data-id="${menu.id}">삭제</button>
					<button type="button" class="btn btn-success btn-save d-none" data-id="${menu.id}">저장</button>
					<button type="button" class="btn btn-secondary menucancelBtn d-none" data-id="${menu.id}">취소</button>
				</div>
			</div>
		</div>
	`;
}

// 메뉴 수정 버튼 이벤트
$(document).on('click', '.menuEditBtn', function() {
	const id = $(this).data('id');
	$(`#menuCategory-${id}`).prop('disabled', false);
	$(`#menuName-${id}`).prop('disabled', false);
	$(`#menuPrice-${id}`).prop('disabled', false);
	$(`#isActive-${id}`).bootstrapToggle('enable');
	
	// 이미지 업로드 input을 보여줌
	$(`#menuImageUpload-${id}`).removeClass('d-none');
	
	$(this).addClass('d-none');
	$(`.btn-save[data-id="${id}"]`).removeClass('d-none');
	$(`.menucancelBtn[data-id="${id}"]`).removeClass('d-none');
	
	
});

// 메뉴 취소 버튼 이벤트
$(document).on('click', '.menucancelBtn', function() {
	const id = $(this).data('id');
	const originalCategory = $(`#menuCategory-${id}`).data('original');
	const originalName = $(`#menuName-${id}`).data('original');
	const originalPrice = $(`#menuPrice-${id}`).data('original');
	const originalActive = $(`#isActive-${id}`).data('original');
	const originalImg = $(`#menuImage-${id}`).data('original');
	
	// 원래의 데이터로 복원
	$(`#menuCategory-${id}`).val(originalCategory).prop('disabled', true);
	$(`#menuName-${id}`).val(originalName).prop('disabled', true);
	$(`#menuPrice-${id}`).val(originalPrice).prop('disabled', true);
	$(`#isActive-${id}`).bootstrapToggle(originalActive ? 'on' : 'off').bootstrapToggle('disable');
	$(`#menuImage-${id}`).val(originalImg)
	
	// 이미지 업로드 input을 숨김
	$(`#menuImageUpload-${id}`).addClass('d-none');
	
	getMenuImage(id, originalImg);
	
	// 업로드된 파일 input 초기화
	$(`#menuImageUpload-${id}`).val('');
	
	// 버튼 상태 변경
	$(this).addClass('d-none');
	$(`.btn-save[data-id="${id}"]`).addClass('d-none');
	$(`.menuEditBtn[data-id="${id}"]`).removeClass('d-none');
});


// 이미지 업로드 input의 변화 감지 및 이미지 미리 보기
$(document).on('change', '.menuImageUpload', function() {
	const id = $(this).data('id');
	const file = this.files[0];
	
	if (file) {
		const reader = new FileReader();
		reader.onload = function(e) {
			$(`#menuImage-${id}`).attr('src', e.target.result);
		}
		reader.readAsDataURL(file);
	}
});

// 메뉴 추가 모달의 썸네일 미리보기 기능
$('#menuImageInput').on('change', function(event) {
	const reader = new FileReader();
	reader.onload = function(e) {
		$('#menuThumbnail').attr('src', e.target.result).show();
	}
	reader.readAsDataURL(event.target.files[0]);
});

// 모달이 닫힐 때 모든 input 박스와 썸네일 초기화
$('#menuModal').on('hidden.bs.modal', function () {
	// 파일 입력 초기화
	$('#menuImageInput').val('');
	$('#menuThumbnail').attr('src', '').hide();

	// 모든 input 박스 초기화
	$(this).find('input').val('');
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
			if (selectId === 'menuCategory' || selectId === 'menuCategoryModal') {
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
			} else if(selectId === 'menuCategoryCard'){
				let selectBox = $('.' + selectId);
				data.forEach(function(category) {
					selectBox.append(
						$('<option>', {
							value: category.id,
							text: category.categoryName
						})
					);
				});
			} else {
				let tbody = $('#' + selectId);
				tbody.empty();
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
