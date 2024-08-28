package com.kh.kiosk.mapper;

import com.kh.kiosk.entity.MenuImg;

public interface MenuImgMapper {
	void create(MenuImg menuImg);
	MenuImg findById(Long id);
	void delete(Long id);
}
