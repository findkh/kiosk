package com.kh.kiosk.service.serviceImpl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.kiosk.dto.MenuCategoryDTO;
import com.kh.kiosk.entity.Menu;
import com.kh.kiosk.entity.MenuCategory;
import com.kh.kiosk.exception.CustomException;
import com.kh.kiosk.mapper.MenuCategoryMapper;
import com.kh.kiosk.mapper.MenuMapper;
import com.kh.kiosk.service.MenuCategoryService;

@Service
public class MenuCategoryServiceImpl implements MenuCategoryService {
	
	private final MenuCategoryMapper menuCategoryMapper;
	private final MenuMapper menuMapper;
	
	@Autowired
	public MenuCategoryServiceImpl(MenuCategoryMapper menuCategoryMapper,
			MenuMapper menuMapper) {
		this.menuCategoryMapper = menuCategoryMapper;
		this.menuMapper = menuMapper;
	}
	
	@Override
	public List<MenuCategoryDTO> findAll() {
		List<MenuCategory> categories = menuCategoryMapper.findAll();
		return categories.stream()
			.map(category -> new MenuCategoryDTO(category.getId(), category.getCategoryName()))
			.collect(Collectors.toList());
	}
	
	@Override
	@Transactional
	public void create(MenuCategoryDTO categoryDTO) {
		MenuCategory existingCategory = menuCategoryMapper.findByName(categoryDTO.getCategoryName());
		if (existingCategory != null) {
			throw new CustomException(HttpStatus.CONFLICT, "동일한 이름의 카테고리가 있습니다.");
		}
		
		MenuCategory category = new MenuCategory();
		category.setCategoryName(categoryDTO.getCategoryName());
		menuCategoryMapper.create(category);
	}
	
	@Override
	@Transactional
	public void update(Long id, MenuCategoryDTO categoryDTO) {
		MenuCategory existingCategory = menuCategoryMapper.findByName(categoryDTO.getCategoryName());
		if (existingCategory != null) {
			throw new CustomException(HttpStatus.CONFLICT, "동일한 이름의 카테고리가 있습니다.");
		}
		
		MenuCategory category = new MenuCategory();
		category.setId(id);
		category.setCategoryName(categoryDTO.getCategoryName());
		menuCategoryMapper.update(category);
	}
	
	@Override
	public void delete(Long id) {
		List<Menu> result = menuMapper.findByMenuCategory(id.toString());
		if(!result.isEmpty()) {
			throw new CustomException(HttpStatus.CONFLICT, "해당 카테고리를 사용하는 메뉴들이 존재합니다. 삭제할 수 없습니다.");
		}
		menuCategoryMapper.delete(id);
	}
}
