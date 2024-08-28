package com.kh.kiosk.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.kh.kiosk.entity.Menu;

public interface MenuMapper {
	void create(Menu menu);
	List<Menu> findAll(@Param("category") String category, @Param("name") String name);
}
