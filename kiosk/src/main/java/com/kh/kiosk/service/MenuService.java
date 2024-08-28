package com.kh.kiosk.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.kh.kiosk.dto.MenuDTO;
import com.kh.kiosk.dto.MenuWithImageDTO;

public interface MenuService {
	MenuWithImageDTO create(String menuDTOJson, String menuImgDTOJson, MultipartFile menuImageFile);
	List<MenuDTO> findAll(String category, String name);
}
