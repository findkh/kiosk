package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.MenuCategoryDTO;

public interface MenuCategoryService {
	List<MenuCategoryDTO> findAll();
	
	MenuCategoryDTO create(MenuCategoryDTO categoryDto);
	
	MenuCategoryDTO update(Long id, MenuCategoryDTO categoryDto);
	
	void delete(Long id);
}
