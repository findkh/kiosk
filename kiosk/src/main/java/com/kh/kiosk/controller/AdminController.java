package com.kh.kiosk.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.kh.kiosk.dto.MenuCategoryDto;
import com.kh.kiosk.service.MenuCategoryService;

@Controller
public class AdminController {

	private final MenuCategoryService menuCategoryService;

	@Autowired
	public AdminController(MenuCategoryService menuCategoryService) {
		this.menuCategoryService = menuCategoryService;
	}

	// 대시보드 화면 호출
	@GetMapping("/viewDashboard")
	public String viewDashboard() {
		return "dashboard";
	}

	// 메뉴 관리 화면 호출
	@GetMapping("/viewMenuSetting")
	public String viewMenuSetting() {
		return "/contents/menu/menuPage";
	}

	// 메뉴 카테고리 조회
	@GetMapping("/admin/menuCategories")
	public ResponseEntity<List<MenuCategoryDto>> getMenuCategories() {
		List<MenuCategoryDto> categories = menuCategoryService.findAll();
		return ResponseEntity.ok(categories);
	}

	// 메뉴 카테고리 추가
	@PostMapping("/admin/menuCategories")
	public ResponseEntity<MenuCategoryDto> createMenuCategory(
			@RequestBody MenuCategoryDto categoryDto) {
		MenuCategoryDto createdCategory = menuCategoryService.create(categoryDto);
		return ResponseEntity.ok(createdCategory);
	}

	// 메뉴 카테고리 수정
	@PutMapping("/admin/menuCategories/{id}")
	public ResponseEntity<MenuCategoryDto> updateMenuCategory(
			@PathVariable("id") Long id,
			@RequestBody MenuCategoryDto categoryDto) {
		MenuCategoryDto updatedCategory = menuCategoryService.update(id, categoryDto);
		return ResponseEntity.ok(updatedCategory);
	}

	// 메뉴 카테고리 삭제
	@DeleteMapping("/admin/menuCategories/{id}")
	public ResponseEntity<Void> deleteMenuCategory(@PathVariable("id") Long id) {
		menuCategoryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
