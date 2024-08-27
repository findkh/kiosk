package com.kh.kiosk.service;

import org.springframework.web.multipart.MultipartFile;

import com.kh.kiosk.dto.MenuWithImageDTO;

public interface MenuService {
	MenuWithImageDTO create(String menuDTOJson, String menuImgDTOJson, MultipartFile menuImageFile);
}
