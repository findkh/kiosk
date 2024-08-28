package com.kh.kiosk.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kh.kiosk.dto.MenuDTO;

public interface MenuService {
	void create(String menuDTOJson, String menuImgDTOJson, MultipartFile menuImageFile);
	List<MenuDTO> findAll(String category, String name);
	void update(String menuDTOJson, MultipartFile menuImageFile);
	void delete(Long id);
}
