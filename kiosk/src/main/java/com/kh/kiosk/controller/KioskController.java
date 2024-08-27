package com.kh.kiosk.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.kh.kiosk.dto.MenuCategoryDto;
import com.kh.kiosk.service.MenuCategoryService;

@Controller
public class KioskController {
	
	private final MenuCategoryService menuCategoryService;

	@Autowired
	public KioskController(MenuCategoryService menuCategoryService) {
		this.menuCategoryService = menuCategoryService;
	}
	
	// 메뉴 카테고리 조회
	@GetMapping("/kiosk/menuCategories")
	public ResponseEntity<List<MenuCategoryDto>> getMenuCategories() {
		List<MenuCategoryDto> categories = menuCategoryService.findAll();
		return ResponseEntity.ok(categories);
	}
}
