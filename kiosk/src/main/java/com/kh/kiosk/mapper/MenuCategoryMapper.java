package com.kh.kiosk.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.kh.kiosk.entity.MenuCategory;

@Mapper
public interface MenuCategoryMapper {

	List<MenuCategory> findAll();

	void create(MenuCategory category);

	void update(MenuCategory category);

	void delete(@Param("id") Long id);
	
	MenuCategory findByName(String categoryName);
}
