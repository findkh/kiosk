package com.kh.kiosk.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import com.kh.kiosk.dto.MenuCategoryDTO;
import com.kh.kiosk.dto.MenuDTO;
import com.kh.kiosk.dto.OrderDTO;
import com.kh.kiosk.service.MenuCategoryService;
import com.kh.kiosk.service.MenuService;
import com.kh.kiosk.service.OrderService;

@Controller
public class KioskController {
	
	private final MenuCategoryService menuCategoryService;
	private final MenuService menuService;
	private final OrderService orderService;
	
	public KioskController(MenuCategoryService menuCategoryService,
			MenuService menuService,
			OrderService orderService) {
		this.menuCategoryService = menuCategoryService;
		this.menuService = menuService;
		this.orderService = orderService;
	}
	
	// 키오스크 화면 호출
	@GetMapping("/")
	public String viewKiosk() {
		return "/contents/kiosk";
	}
	
	// 메뉴 카테고리 조회
	@GetMapping("/kiosk/menuCategories")
	public ResponseEntity<List<MenuCategoryDTO>> getMenuCategories() {
		List<MenuCategoryDTO> categories = menuCategoryService.findAll();
		return ResponseEntity.ok(categories);
	}
	
	// 메뉴 조회
	@GetMapping("/kiosk/menu")
	public ResponseEntity<List<MenuDTO>> getMenus(@RequestParam(required = false) String category,
			@RequestParam(required = false) String name) {
		List<MenuDTO> menuList = menuService.findAll(category, name);
		return ResponseEntity.ok(menuList);
	}
	
	// 메뉴 저장
	@PostMapping("/kiosk/menu")
	public ResponseEntity<Integer> createMenu(@RequestBody List<OrderDTO> orderDTOList) {
		int callNumber = orderService.create(orderDTOList);
		return ResponseEntity.status(HttpStatus.CREATED).body(callNumber);
	}
}
