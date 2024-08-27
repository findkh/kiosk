package com.kh.kiosk.service.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.kh.kiosk.dto.MenuCategoryDto;
import com.kh.kiosk.entity.MenuCategory;
import com.kh.kiosk.exception.CustomException;
import com.kh.kiosk.mapper.MenuCategoryMapper;
import com.kh.kiosk.service.MenuCategoryService;

@Service
public class MenuCategoryServiceImpl implements MenuCategoryService {

	private final MenuCategoryMapper menuCategoryMapper;

	@Autowired
	public MenuCategoryServiceImpl(MenuCategoryMapper menuCategoryMapper) {
		this.menuCategoryMapper = menuCategoryMapper;
	}

	@Override
	public List<MenuCategoryDto> findAll() {
		List<MenuCategory> categories = menuCategoryMapper.findAll();
		return categories.stream()
			.map(category -> new MenuCategoryDto(category.getId(), category.getCategoryName()))
			.collect(Collectors.toList());
	}

	@Override
	public MenuCategoryDto create(MenuCategoryDto categoryDto) {
		MenuCategory existingCategory = menuCategoryMapper.findByName(categoryDto.getCategoryName());
		if (existingCategory != null) {
			throw new CustomException(HttpStatus.CONFLICT, "동일한 이름의 카테고리가 있습니다.");
		}
		
		MenuCategory category = new MenuCategory();
		category.setCategoryName(categoryDto.getCategoryName());
		menuCategoryMapper.create(category);
		return new MenuCategoryDto(category.getId(), category.getCategoryName());
	}

	@Override
	public MenuCategoryDto update(Long id, MenuCategoryDto categoryDto) {
		MenuCategory existingCategory = menuCategoryMapper.findByName(categoryDto.getCategoryName());
		if (existingCategory != null) {
			throw new CustomException(HttpStatus.CONFLICT, "동일한 이름의 카테고리가 있습니다.");
		}
		
		MenuCategory category = new MenuCategory();
		category.setId(id);
		category.setCategoryName(categoryDto.getCategoryName());
		menuCategoryMapper.update(category);
		return new MenuCategoryDto(category.getId(), category.getCategoryName());
	}

	@Override
	public void delete(Long id) {
		menuCategoryMapper.delete(id);
	}
}
