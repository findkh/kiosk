package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.MenuCategoryDTO;

public interface MenuCategoryService {
	List<MenuCategoryDTO> findAll();
	void create(MenuCategoryDTO categoryDTO);
	void update(Long id, MenuCategoryDTO categoryDTO);
	void delete(Long id);
}
