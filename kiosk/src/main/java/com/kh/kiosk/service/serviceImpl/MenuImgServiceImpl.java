package com.kh.kiosk.service.serviceImpl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.kh.kiosk.entity.MenuImg;
import com.kh.kiosk.exception.CustomException;
import com.kh.kiosk.mapper.MenuImgMapper;
import com.kh.kiosk.service.MenuImgService;

@Service
public class MenuImgServiceImpl implements MenuImgService {
	
	private final MenuImgMapper menuImgMapper;
	
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	public MenuImgServiceImpl(MenuImgMapper menuImgMapper) {
		this.menuImgMapper = menuImgMapper;
	}
	
	@Override
	public ResponseEntity<Resource> getMenuImage(Long id) {
		MenuImg menuImg = menuImgMapper.findById(id);
		
		if (menuImg == null) {
			throw new CustomException(HttpStatus.NOT_FOUND, "이미지 파일이 존재하지 않습니다.");
		} else {
			File imgFile = new File(uploadDir, menuImg.getFileName().toString());
			if (!imgFile.exists()) {
				throw new CustomException(HttpStatus.NOT_FOUND, "이미지 파일이 존재하지 않습니다.");
			}
			
			try {
				Resource resource = new InputStreamResource(new FileInputStream(imgFile));
				return ResponseEntity.ok()
					.contentType(MediaType.parseMediaType(menuImg.getFileType()))
					.body(resource);
			} catch (FileNotFoundException e) {
				throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 파일을 읽는 중 오류가 발생했습니다.");
			}
		}
	}
}
