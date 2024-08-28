package com.kh.kiosk.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface MenuImgService {
	ResponseEntity<Resource> getMenuImage(Long id);
}
