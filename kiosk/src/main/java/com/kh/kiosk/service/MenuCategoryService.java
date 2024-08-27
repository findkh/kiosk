package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.MenuCategoryDto;

public interface MenuCategoryService {
	List<MenuCategoryDto> findAll();
	
	MenuCategoryDto create(MenuCategoryDto categoryDto);
	
	MenuCategoryDto update(Long id, MenuCategoryDto categoryDto);
	
	void delete(Long id);
}
