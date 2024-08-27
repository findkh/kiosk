package com.kh.kiosk.service.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.kiosk.dto.MenuDTO;
import com.kh.kiosk.dto.MenuImgDTO;
import com.kh.kiosk.dto.MenuWithImageDTO;
import com.kh.kiosk.entity.Menu;
import com.kh.kiosk.entity.MenuImg;
import com.kh.kiosk.exception.CustomException;
import com.kh.kiosk.mapper.MenuImgMapper;
import com.kh.kiosk.mapper.MenuMapper;
import com.kh.kiosk.service.MenuService;

@Service
public class MenuServiceImpl implements MenuService {

	private final MenuMapper menuMapper;
	private final MenuImgMapper menuImgMapper;
	private final ObjectMapper objectMapper;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public MenuServiceImpl(MenuMapper menuMapper, MenuImgMapper menuImgMapper, ObjectMapper objectMapper) {
		this.menuMapper = menuMapper;
		this.menuImgMapper = menuImgMapper;
		this.objectMapper = objectMapper;
	}

	@Override
	@Transactional // 트랜잭션 범위 설정
	public MenuWithImageDTO create(String menuDTOJson, String menuImgDTOJson, MultipartFile menuImageFile) {
		try {
			// JSON 문자열을 DTO 객체로 변환
			MenuDTO menuDTO = objectMapper.readValue(menuDTOJson, MenuDTO.class);
			MenuImgDTO menuImgDTO = objectMapper.readValue(menuImgDTOJson, MenuImgDTO.class);

			// DTO를 Entity로 변환
			Menu menu = convertToEntity(menuDTO);
			MenuImg menuImg = convertToEntity(menuImgDTO);

			// 파일 정보 처리
			String originalFileName = StringUtils.cleanPath(menuImageFile.getOriginalFilename());
			String fileName = generateUniqueFileName(originalFileName);
			String fileType = menuImageFile.getContentType();
			String fileSize = String.valueOf(menuImageFile.getSize());

			// 이미지 Entity에 파일 정보 추가
			menuImg.setFileName(fileName);
			menuImg.setFileType(fileType);
			menuImg.setFileSize(fileSize);

			// 메뉴 이미지 저장 및 ID 반환
			menuImgMapper.create(menuImg);
			Long imgId = menuImg.getId(); // 자동 생성된 ID

			if (imgId == null) {
				throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 ID가 생성되지 않았습니다.");
			}

			// 이미지 ID를 Menu DTO에 설정
			menu.setImgId(imgId.toString());

			// 메뉴 저장
			menuMapper.create(menu);

			// 파일 이동
			Path targetLocation = Paths.get(uploadDir).resolve(fileName);
			Files.copy(menuImageFile.getInputStream(), targetLocation);

			// 성공적으로 완료된 경우 MenuWithImageDTO 반환
			return new MenuWithImageDTO(menuDTO, menuImgDTO);

		} catch (IOException e) {
			e.printStackTrace();
			// 파일 이동 중 오류 발생 시 트랜잭션 롤백
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 이동 중 오류 발생");
		} catch (Exception e) {
			e.printStackTrace();
			// 기타 예외 발생 시 트랜잭션 롤백
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 저장 중 오류 발생");
		}
	}

	private String generateUniqueFileName(String originalFileName) {
		String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
		return UUID.randomUUID().toString() + fileExtension;
	}

	private Menu convertToEntity(MenuDTO menuDTO) {
		Menu menu = new Menu();
		menu.setId(menuDTO.getId());
		menu.setMenuName(menuDTO.getMenuName());
		menu.setMenuCategory(menuDTO.getMenuCategory());
		menu.setMenuPrice(menuDTO.getMenuPrice());
		menu.setActive(menuDTO.isActive());
		menu.setImgId(menuDTO.getImgId());
		menu.setCreatedId(menuDTO.getCreatedId());
		menu.setCreatedDt(menuDTO.getCreatedDt());
		menu.setModifiedId(menuDTO.getModifiedId());
		menu.setModifiedDt(menuDTO.getModifiedDt());
		return menu;
	}

	private MenuImg convertToEntity(MenuImgDTO menuImgDTO) {
		MenuImg menuImg = new MenuImg();
		menuImg.setId(menuImgDTO.getId());
		menuImg.setOriginFileName(menuImgDTO.getOriginFileName());
		menuImg.setFileName(menuImgDTO.getFileName());
		menuImg.setFileType(menuImgDTO.getFileType());
		menuImg.setFileSize(menuImgDTO.getFileSize());
		menuImg.setCreatedId(menuImgDTO.getCreatedId());
		menuImg.setCreatedDt(menuImgDTO.getCreatedDt());
		return menuImg;
	}
}
