package com.kh.kiosk.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.kh.kiosk.entity.MenuCategory;

@Mapper
public interface KioskMapper {
	List<MenuCategory> CategoryfindAll();
}
