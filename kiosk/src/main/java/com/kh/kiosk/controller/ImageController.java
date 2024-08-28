package com.kh.kiosk.controller;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.kh.kiosk.service.MenuImgService;

@RestController
public class ImageController {
	private final MenuImgService menuImgService;
	
	public ImageController(MenuImgService menuImgService) {
		this.menuImgService = menuImgService;
	}
	
	@GetMapping("/menuImage/{id}")
	public ResponseEntity<Resource> getMenuImage(@PathVariable Long id) {
		return menuImgService.getMenuImage(id);
	}
}
