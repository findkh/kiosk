package com.kh.kiosk.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.kh.kiosk.dto.MenuCategoryDTO;
import com.kh.kiosk.dto.MenuDTO;
import com.kh.kiosk.service.MenuCategoryService;
import com.kh.kiosk.service.MenuService;

@Controller
public class AdminController {
	
	private final MenuCategoryService menuCategoryService;
	private final MenuService menuService;
	
	@Autowired
	public AdminController(MenuCategoryService menuCategoryService,
			MenuService menuService) {
		this.menuCategoryService = menuCategoryService;
		this.menuService = menuService;
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
	
	// 메뉴 조회
	@GetMapping("/admin/menu")
	public ResponseEntity<List<MenuDTO>> getMenus(
			@RequestParam(required = false) String category,
			@RequestParam(required = false) String name) {
		List<MenuDTO> menuList = menuService.findAll(category, name);
		return ResponseEntity.ok(menuList);
	}
	
	// 메뉴 추가
	@PostMapping("/admin/menu")
	public ResponseEntity<Void> createMenu(
		@RequestParam("menuDTO") String menuDTOJson,
		@RequestParam("menuImages") String menuImgDTOJson,
		@RequestParam("menuImageFile") MultipartFile menuImageFile) {
		menuService.create(menuDTOJson, menuImgDTOJson, menuImageFile);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	// 메뉴 수정
	
	
	// 메뉴 삭제
	
	
	// 메뉴 카테고리 조회
	@GetMapping("/admin/menuCategories")
	public ResponseEntity<List<MenuCategoryDTO>> getMenuCategories() {
		List<MenuCategoryDTO> categories = menuCategoryService.findAll();
		return ResponseEntity.ok(categories);
	}
	
	// 메뉴 카테고리 추가
	@PostMapping("/admin/menuCategories")
	public ResponseEntity<MenuCategoryDTO> createMenuCategory(
			@RequestBody MenuCategoryDTO categoryDto) {
		MenuCategoryDTO createdCategory = menuCategoryService.create(categoryDto);
		return ResponseEntity.ok(createdCategory);
	}
	
	// 메뉴 카테고리 수정
	@PutMapping("/admin/menuCategories/{id}")
	public ResponseEntity<MenuCategoryDTO> updateMenuCategory(
			@PathVariable("id") Long id,
			@RequestBody MenuCategoryDTO categoryDto) {
		MenuCategoryDTO updatedCategory = menuCategoryService.update(id, categoryDto);
		return ResponseEntity.ok(updatedCategory);
	}
	
	// 메뉴 카테고리 삭제
	@DeleteMapping("/admin/menuCategories/{id}")
	public ResponseEntity<Void> deleteMenuCategory(@PathVariable("id") Long id) {
		menuCategoryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
