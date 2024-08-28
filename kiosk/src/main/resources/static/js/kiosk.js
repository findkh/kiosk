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

// 장바구니에 담기 기능
$(document).on('click', '.btn-add', function() {
	let $btn = $(this);
	let menuId = $btn.data('menu-id');
	let $parent = $btn.parent();
	let $qty = $parent.find('input[type="number"]');
	let qtyValue = $qty.val();
	
	console.log('메뉴 ID:', menuId);
	console.log('수량:', qtyValue);
	console.log('메뉴 리스트:', menuList);
	
	let foundItem = menuList.find(item => item.id == menuId);
	
	if (foundItem) {
		foundItem.count = foundItem.count == null ? Number(qtyValue) : foundItem.count + Number(qtyValue);
		cartArr.push(foundItem);
	}

	makeCartList();
	$qty.val(1);
	$('.menuBtn').click();
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


// 카트 +/- 삭제 버튼 기능
function makeCartFnBtn() {
	$(document).on('click', '.cart-btn-number', function() {
		let $btn = $(this);
		let btnType = $btn.attr('button-type');
		let $parent = $btn.parent();
		let $qty = $parent.find('input[type="number"]');
		let price = $qty.attr('price');
		let totalP = removeCommaFormat($('.total_price').text());

		if (btnType === 'plus') {
			totalP -= price * $qty.val();
			$qty.val(Number($qty.val()) + 1);
			$('.total_price').text(createCommaFormat(totalP + ($qty.val() * price)));
		} else if (btnType === 'minus') {
			totalP -= price * $qty.val();
			let value = Number($qty.val()) - 1;
			$qty.val(value);
			$('.total_price').text(createCommaFormat(totalP + ($qty.val() * price)));
			
			if (value == 0) {
				let no = Number($qty.attr('item'));
				cartArr = cartArr.filter(item => item.no != no);
				uniqueArr = uniqueArr.filter(item => item.no != no);
				
				$parent.closest('li').remove();
				
				if ($('.cartUl').children().length === 0) {
					location.reload();
				}
			}
		} else {
			totalP -= price * $qty.val();
			$('.total_price').text(createCommaFormat(totalP));
			
			let no = Number($qty.attr('item'));
			cartArr = cartArr.filter(item => item.no != no);
			uniqueArr = uniqueArr.filter(item => item.no != no);
			
			$parent.closest('li').remove();
			
			if ($('.cartUl').children().length === 0) {
				location.reload();
			}
		}
	});
}

// 카트 메뉴 리스트 만드는 함수
function makeCartList() {
	let cartSet = new Set(cartArr);
	uniqueArr = [...cartSet];
	let totalPrice = 0;
	$('.cartUl').empty();
	
	uniqueArr.forEach(function(item) {
		$('.cartUl').append(`
			<li class="list-group-item cartLi ${item.no} ${item.id}">
				<div class="row">
					<div class="col-sm-5">
						<span>${item.name}</span><br>
						<span>${createCommaFormat(item.price)}</span>
					</div>
					<div class="col-sm-7 mt-3">
						<div class="input-group">
							<input type="number" min="0" class="form-control cartQty" value="${item.count}" price="${item.price}" item="${item.no}" style="height:25px;text-align:center;" disabled>
							<button class="btn btn-outline-primary cart-btn-number" type="button" button-type="plus" style="height:25px;text-align: center;"><i class="fas fa-plus menu"></i></button>
							<button class="btn btn-outline-danger cart-btn-number" type="button" button-type="minus" style="height:25px;text-align: center;"><i class="fas fa-minus menu"></i></button>
							<button class="btn btn-outline-success cart-btn-number" type="button" button-type="delete" style="height:25px;text-align: center;"><i class="fa fa-trash menu"></i></button>
						</div>
					</div>
				</div>
		</li>`);
		totalPrice += item.price * item.count;
	});
	
	makeCartFnBtn();
	$('.total_price').text(createCommaFormat(totalPrice));
}


function createCommaFormat(num) {
	return Number(num).toLocaleString();
}

function removeCommaFormat(num) {
	return num.split(',').join('');
}

document.querySelector('.finishBtn').addEventListener('click', function() {
	alert('주문해주셔서 감사합니다');
	window.location.reload();
});

//캔버스 닫힐때 이벤트
let canvas = document.querySelector('.orderList');
canvas.addEventListener('hidden.bs.offcanvas', function() {
	let childNode = cartUl.querySelectorAll('.cartLi');
	cartArr = [];
	childNode.forEach(function(item) {
		let no = item.getAttribute('class').split(' ')[2];
		let id = item.getAttribute('class').split(' ')[3];
		let qty = Number(item.querySelector('.cartQty').value);
		menuList.forEach(function(menu) {
			if(menu.id == id && menu.no == no) {
				menu.count = qty;
				cartArr.push(menu);
			}
		})
	})
})