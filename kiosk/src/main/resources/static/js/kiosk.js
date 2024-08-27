        $(document).ready(function() {
            // 메뉴 카테고리를 가져와서 네비게이션 바와 콘텐츠에 추가하는 함수
            function getMenuCategories() {
                $.ajax({
                    url: '/kiosk/menuCategories',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        console.log('Fetched data:', data);

                        // 네비게이션 바에 항목 추가
                        updateNavbarMenu(data);

                        // 콘텐츠 영역에 카테고리 카드 추가
//                        updateContentCategory(data);
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching menu categories:', error);
                    }
                });
            }

            // 네비게이션 바 메뉴 업데이트
            function updateNavbarMenu(data) {
                const navbarMenu = $('#navbarNav .navbar-nav');
                navbarMenu.empty(); // 메뉴가 중복되지 않도록 기존 내용을 지움

                data.forEach(item => {
                    const categoryLink = $('<a>', {
                        class: 'nav-link',
                        href: `#${item.categoryName.toLowerCase()}`,
                        text: item.categoryName,
                        'aria-current': item.categoryName === 'COFFEE' ? 'page' : undefined
                    });

                    const listItem = $('<li>', { class: 'nav-item' }).append(
                        $('<h4>').append(categoryLink)
                    );

                    navbarMenu.append(listItem);
                });
            }

            // 페이지가 로드되면 메뉴 카테고리 데이터 가져오기
            getMenuCategories();
        });



let menuList = [...menu];
let cartUl = document.querySelector('.cartUl');

let body
// 메뉴 화면에 뿌리기
menuList.forEach(function(item) {
	if(item.id === 'coffee') {
		body = document.querySelector('#COFFEE_body');
	} else if (item.id === 'flatccino') {
		body = document.querySelector('#FLATCCINO_body');
	} else {
		body = document.querySelector('#DESSERT_body');
	}

	body.innerHTML += `<div class="col-md-6 col-lg-3 mb-5">
							<div class="card mx-auto">
								<div class="d-flex align-items-center justify-content-center" style="background-color:#f5f5f5">
									<img class="img-fluid item_img" src="${item.picture}"/>
								</div>
								<div class="card-body2">
									<span id="name">${item.name}</span><br>
									<span id="price">${createCommaFormat(item.price)}</span>
									<div class="input-group">
										<input type="number" min="1" class="form-control ${item.no} ${item.id}" value="1" style="text-align: center;" disabled >
										<button class="btn btn-outline-primary btn-number" type="button" button-type="plus"><i class="fas fa-plus"></i></button>
										<button class="btn btn-outline-danger btn-number" type="button" button-type="minus"><i class="fas fa-minus"></i></button>
										<button type="button" class="btn btn-outline-primary btn-add">담기</button>
									</div>
								</div>
							</div>
						</div>`
});

// 메인 +/- 버튼 기능
let btn = document.querySelectorAll('.btn-number');
btn.forEach(function(item) {
	item.addEventListener('click', function() {
		let btnType = item.getAttribute('button-type');
		let parent = item.parentNode;
		let qty = parent.childNodes[1];

		if(btnType === 'plus') {
			qty.value = Number(qty.value) + 1;
		} else {
			if(qty.value != 0) {
				qty.value = Number(qty.value) - 1;
			}
		}
	})
});

// 장바구니에 담기 기능
let addCartBtn = document.querySelectorAll('.btn-add');
let cartArr = [];

addCartBtn.forEach(function(item) {
	item.addEventListener('click', function() {
		let parent = item.parentNode;
		let qty = parent.childNodes[1];
		let menuNo = qty.getAttribute('class').split(' ')[1];
		let menuId = qty.getAttribute('class').split(' ')[2];
		let qtyValue = qty.value;
		
		menuList.forEach(function(item) {
			if(item.no == menuNo && item.id == menuId) {
				item.count = item.count==null ? Number(qtyValue) : item.count+Number(qtyValue);
				cartArr.push(item);
			}
		});

		makeCartList();
		qty.value = 1;
		document.querySelector('.menuBtn').click();
	})
})

// 카트 +/- 삭제 버튼 기능
function makeCartFnBtn() {
	cartBtn = document.querySelectorAll('.cart-btn-number');
	cartBtn.forEach(function(cartItem) {
		cartItem.addEventListener('click', function() {
			let btnType = cartItem.getAttribute('button-type');
			let parent = cartItem.parentNode;
			let qty = parent.childNodes[1];
			let price = qty.getAttribute('price');
			let totalP = removeCommaFormat(document.querySelector('.total_price').innerText);

			if(btnType === 'plus') {
				totalP -= price  * qty.value;
				qty.value = Number(qty.value) + 1;
				document.querySelector('.total_price').innerText = createCommaFormat(totalP + (qty.value * price));
			} else if(btnType === 'minus') {
				totalP -= price  * qty.value;
				let value = Number(qty.value) - 1;
				qty.value = value;
				document.querySelector('.total_price').innerText = createCommaFormat(totalP + (qty.value * price));
				
				if(value == 0) {
					no = Number(qty.getAttribute('item'));
					for(i = 0; i < uniqueArr.length; i++) {
						if(uniqueArr[i].no == no) {
							cartArr[i].count = null;
							uniqueArr[i].count = null;
							cartArr.splice(i, 1);
							uniqueArr.splice(i, 1);
							break;
						}
					}
					
					parent.parentNode.parentNode.parentNode.remove();
					if(document.querySelector('.cartUl').children.length == 0) {
						window.location.reload();
					}
				}
			} else { //삭제 버튼
				totalP = totalP - (price  * qty.value);
				document.querySelector('.total_price').innerText = createCommaFormat(totalP);
				qty.value = Number(qty.value) - 1;
				
				no = Number(qty.getAttribute('item'));
				for(i = 0; i < uniqueArr.length; i++) {
					if(uniqueArr[i].no == no) {
						cartArr[i].count = null;
						uniqueArr[i].count = null;
						cartArr.splice(i, 1);
						uniqueArr.splice(i, 1);
						break;
					}
				}
				parent.parentNode.parentNode.parentNode.remove();
				
				if(document.querySelector('.cartUl').children.length == 0) {
					window.location.reload();
				}
			}
		})
	});
}


// 카트 메뉴 리스트 만드는 함수
function makeCartList() {
	let cartSet = new Set(cartArr);
	uniqueArr = [...cartSet];
	
	let totalPrice = 0;

	while(cartUl.firstChild)  {
		cartUl.removeChild(cartUl.firstChild);
	}

	uniqueArr.forEach(function(item) {
		cartUl.innerHTML += `<li class="list-group-item cartLi ${item.no} ${item.id}">
								<div class="row">
									<div class="col-sm-5">
										<span>${item.name}</span><br>
										<span>${createCommaFormat(item.price)}</span>
									</div>
									<div class="col-sm-7 mt-3">
										<div class="input-group">
											<input type="number" min="0" class="form-control cartQty" value="${item.count}" price="${item.price}" item="${item.no}" style="height:25px;text-align:center;" disabled >
											<button class="btn btn-outline-primary cart-btn-number" type="button" button-type="plus" style="height:25px;text-align: center;"><i class="fas fa-plus menu"></i></button>
											<button class="btn btn-outline-danger cart-btn-number" type="button" button-type="minus" style="height:25px;text-align: center;"><i class="fas fa-minus menu"></i></button>
											<button class="btn btn-outline-success cart-btn-number" type="button" button-type="delete" style="height:25px;text-align: center;"><i class="fa fa-trash menu"></i></button>
										</div>
									</div>
								</li>`
		totalPrice += item.price * item.count;
		makeCartFnBtn();
		document.querySelector('.total_price').innerText = createCommaFormat(totalPrice);
	})
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