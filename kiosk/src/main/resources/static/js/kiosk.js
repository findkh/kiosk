$(document).ready(function() {
	getMenuCategories();
	getMenuList();
});

let cartArr = [];
let menuList;

// 네비게이션 메뉴 클릭 시 스크롤 처리
$(document).on('click', '.nav-link', function(event) {
	event.preventDefault();
	
	let target = $(this).attr('href');
	$('html, body').animate({
		scrollTop: $(target).offset().top
	}, 10);
});

// 메뉴 카테고리를 가져와서 네비게이션 바와 콘텐츠에 추가하는 함수
function getMenuCategories() {
	$.ajax({
		url: '/kiosk/menuCategories',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			updateNavbarMenu(data);
			updateContentCategory(data);
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 네비게이션 바 메뉴 업데이트
function updateNavbarMenu(data) {
	const navbarMenu = $('#navbarNav .navbar-nav');
	navbarMenu.empty();
	
	data.forEach((item, index) => {
		const categoryLink = $('<a>', {
			class: 'nav-link',
			href: `#card_${item.id}`,
			text: item.categoryName,
			'aria-current': index === 0 ? 'page' : undefined
		});
		
		const listItem = $('<li>', { class: 'nav-item' }).append(
			$('<h4>').append(categoryLink)
		);
		
		navbarMenu.append(listItem);
	});
}

// 카테고리 콘텐츠 업데이트
function updateContentCategory(data) {
	const contentDiv = $('#contentDiv');
	contentDiv.empty();

	data.forEach(item => {
		const categoryNameLowerCase = item.categoryName.toLowerCase();
		const categoryId = item.id;

		const cardHeader = $('<div>').append(
			$('<h1>', {
				class: 'display-6',
				text: item.categoryName,
				style: 'text-align:center;'
			})
		);
		
		const cardBody = $('<div>', {
			class: 'row justify-content-center',
			id: `body_${categoryId}`
		});
		
		const card = $('<div>', {
			class: 'card card-body mb-5',
			id: `card_${categoryId}`
		}).append(cardHeader, cardBody);
		
		contentDiv.append(card);
	});
}

// 메뉴 생성 함수
function addMenuItems(menuList) {
	menuList.forEach(item => {
		if (item.isActive) {
			const categoryId = item.menuCategory;
			const $body = $(`#body_${categoryId}`);
			const cardHtml = `
				<div class="col-md-6 col-lg-3 mb-5">
					<div class="card mx-auto">
						<div class="d-flex align-items-center justify-content-center" style="background-color:#f5f5f5">
							<img id="menuImage-${item.id}" class="img-fluid item_img" src="path/to/placeholder.jpg" alt="${item.menuName}" />
						</div>
						<div class="card-body2">
							<span id="name">${item.menuName}</span><br>
							<span id="price">${createCommaFormat(item.menuPrice)}</span>
							<div class="input-group">
								<input type="number" min="1" class="form-control ${item.id} ${item.menuCategory}" value="1" style="text-align: center;" disabled>
								<button class="btn btn-outline-primary btn-number" type="button" button-type="plus"><i class="fas fa-plus"></i></button>
								<button class="btn btn-outline-danger btn-number" type="button" button-type="minus"><i class="fas fa-minus"></i></button>
								<button type="button" class="btn btn-outline-primary btn-add" data-menu-id="${item.id}">담기</button>
							</div>
						</div>
					</div>
				</div>`;
			
			$body.append(cardHtml);
			getMenuImage(item.id, item.imgId);
		}
	});
}


// +/- 버튼 기능
$(document).on('click', '.btn-number', function() {
	let $btn = $(this);
	let btnType = $btn.attr('button-type');
	let $parent = $btn.parent();
	let $qty = $parent.find('input[type="number"]');
	
	if (btnType === 'plus') {
		$qty.val(Number($qty.val()) + 1);
	} else if (btnType === 'minus') {
		if (Number($qty.val()) > 0) {
			$qty.val(Number($qty.val()) - 1);
		}
	}
});

// 메뉴 이미지를 가져오는 함수
function getMenuImage(menuId, imgId) {
	$.ajax({
		url: `/menuImage/${imgId}`,
		type: 'GET',
		xhrFields: {
			responseType: 'blob'
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

// 모든 메뉴의 리스트를 조회
function getMenuList() {
	$.ajax({
		url: '/kiosk/menu',
		type: 'GET',
		dataType: 'json',
		success: function(data) {
			addMenuItems(data);
			menuList = data;
		},
		error: function(xhr, status, error) {
			let errorMessage = xhr.responseJSON.message || '알 수 없는 오류가 발생했습니다.';
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
}

// 장바구니에 담기 기능
$(document).on('click', '.btn-add', function() {
	let $btn = $(this);
	let menuId = $btn.data('menu-id');
	let $parent = $btn.parent();
	let $qty = $parent.find('input[type="number"]');
	let qtyValue = Number($qty.val());
	let foundItem = menuList.find(item => item.id == menuId);
	
	if (foundItem) {
		let existingItem = cartArr.find(item => item.id == menuId);
		
		if (existingItem) {
			// 장바구니에 이미 있는 항목이면 수량을 증가시킴
			existingItem.count += qtyValue;
		} else {
			// 장바구니에 없는 항목이면 count를 qtyValue로 설정하고 추가
			foundItem.count = qtyValue;
			cartArr.push(foundItem);
		}
	}
	
	makeCartList();
	$qty.val(1);
	$('.menuBtn').click();
});

// 카트 메뉴 리스트 만드는 함수
function makeCartList() {
	let totalPrice = 0;
	$('.cartUl').empty();
	
	cartArr.forEach(function(item) {
		$('.cartUl').append(`
			<li class="list-group-item cartLi ${item.no} ${item.id}">
				<div class="row">
					<div class="col-sm-5">
						<span>${item.menuName}</span><br>
						<span>${createCommaFormat(item.menuPrice)}</span>
					</div>
					<div class="col-sm-7 mt-3">
						<div class="input-group">
							<input type="number" min="0" class="form-control cartQty" value="${item.count}" price="${item.menuPrice}" item="${item.id}" style="height:25px;text-align:center;" disabled>
							<button class="btn btn-outline-primary cart-btn-number" type="button" button-type="plus" item-id="${item.id}" style="height:25px;text-align: center;"><i class="fas fa-plus menu"></i></button>
							<button class="btn btn-outline-danger cart-btn-number" type="button" button-type="minus" item-id="${item.id}" style="height:25px;text-align: center;"><i class="fas fa-minus menu"></i></button>
							<button class="btn btn-outline-success cart-btn-number" type="button" button-type="delete" item-id="${item.id}" style="height:25px;text-align: center;"><i class="fa fa-trash menu"></i></button>
						</div>
					</div>
				</div>
		</li>`);
		totalPrice += item.menuPrice * item.count;
	});
	
	makeCartFnBtn();
	$('.total_price').text(createCommaFormat(totalPrice));
}

// 카트 +/- 삭제 버튼 기능
function makeCartFnBtn() {
	// 기존에 등록된 이벤트 핸들러를 제거
	$(document).off('click', '.cart-btn-number');

	// 새로운 이벤트 핸들러를 등록
	$(document).on('click', '.cart-btn-number', function () {
		let $btn = $(this);
		let btnType = $btn.attr('button-type');
		let $parent = $btn.closest('.cartLi');
		let $qty = $parent.find('input[type="number"]');
		let price = Number($qty.attr('price'));
		let totalPrice = Number(removeCommaFormat($('.total_price').text()));
		let currentQty = Number($qty.val());
		let itemId = Number($qty.attr('item'));
		let cartItem = cartArr.find(item => item.id === itemId);
		
		if (btnType === 'plus') {
			currentQty++;
			$qty.val(currentQty);
			totalPrice += price;
			
			if (cartItem) {
				cartItem.count = currentQty;
			}
			
			$('.total_price').text(createCommaFormat(totalPrice));
		} else if (btnType === 'minus') {
			if (currentQty > 1) {
				currentQty--;
				$qty.val(currentQty);
				totalPrice -= price;
				
				if (cartItem) {
					cartItem.count = currentQty;
				}
				
				$('.total_price').text(createCommaFormat(totalPrice));
			} else {
				cartArr = cartArr.filter(item => item.id !== itemId);
				$parent.closest('li').remove();
				totalPrice -= price;
				
				$('.total_price').text(createCommaFormat(totalPrice));
				
				if ($('.cartUl').children().length === 0) {
					location.reload();
				}
			}
		} else if (btnType === 'delete') {
			cartArr = cartArr.filter(item => item.id !== itemId);
			$parent.closest('li').remove();
			totalPrice -= currentQty * price;
			
			$('.total_price').text(createCommaFormat(totalPrice));
			
			if ($('.cartUl').children().length === 0) {
				location.reload();
			}
		}
	});
}


function createCommaFormat(num) {
	return Number(num).toLocaleString();
}

function removeCommaFormat(num) {
	return num.split(',').join('');
}

$('#saveOrderBtn').click(function(){
	let packagingOrSeat = $('input[name="packagingOrSeat"]:checked').val();
	
	let orderList = cartArr.map(function(item) {
		return {
			orderQty: item.count,
			packagingOrSeat: packagingOrSeat,
			menuId: item.id,
			orderStatus: 'w'
		};
	});
	
	$.ajax({
		url: '/kiosk/menu',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(orderList),
		success: function(num) {
			alert('주문번호: ' +num +' 번\n 메뉴가 완성되면 주문번호를 호출하겠습니다.\n 감사합니다.');
			location.reload();
		},
		error: function(xhr, status, error) {
			console.error('에러 발생:', status, error);
			alert(`Error ${xhr.status}: ${errorMessage}`);
		}
	});
});
