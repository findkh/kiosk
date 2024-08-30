package com.kh.kiosk.service.serviceImpl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.kiosk.dto.MenuDTO;
import com.kh.kiosk.dto.MenuImgDTO;
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
	
	public MenuServiceImpl(MenuMapper menuMapper, 
			MenuImgMapper menuImgMapper, 
			ObjectMapper objectMapper) {
		this.menuMapper = menuMapper;
		this.menuImgMapper = menuImgMapper;
		this.objectMapper = objectMapper;
	}
	
	// 메뉴 조회
	@Override
	public List<MenuDTO> findAll(String category, String name) {
		List<Menu> menuList = menuMapper.findAll(category, name);

		return menuList.stream()
			.map(menu -> new MenuDTO(
				menu.getId(),
				menu.getMenuName(),
				menu.getMenuCategory(),
				menu.getMenuPrice(),
				menu.isActive(),
				menu.getImgId(),
				menu.getCreatedId(),
				menu.getCreatedDt(),
				menu.getModifiedId(),
				menu.getModifiedDt()
			))
			.collect(Collectors.toList());
	}
	
	// 메뉴 생성
	@Override
	@Transactional
	public void create(String menuDTOJson, String menuImgDTOJson, MultipartFile menuImageFile) {
		try {
			MenuDTO menuDTO = objectMapper.readValue(menuDTOJson, MenuDTO.class);
			MenuImgDTO menuImgDTO = objectMapper.readValue(menuImgDTOJson, MenuImgDTO.class);

			Menu menu = convertToEntity(menuDTO);
			MenuImg menuImg = convertToEntity(menuImgDTO);

			String originalFileName = StringUtils.cleanPath(menuImageFile.getOriginalFilename());
			String fileName = generateUniqueFileName(originalFileName);
			String fileType = menuImageFile.getContentType();
			String fileSize = String.valueOf(menuImageFile.getSize());

			menuImg.setFileName(fileName);
			menuImg.setFileType(fileType);
			menuImg.setFileSize(fileSize);

			menuImgMapper.create(menuImg);
			Long imgId = menuImg.getId();

			if (imgId == null) {
				throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 ID가 생성되지 않았습니다.");
			}

			menu.setImgId(imgId.toString());
			menuMapper.create(menu);

			Path targetLocation = Paths.get(uploadDir).resolve(fileName);
			Files.copy(menuImageFile.getInputStream(), targetLocation);

		} catch (IOException e) {
			e.printStackTrace();
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 이동 중 오류 발생");
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 저장 중 오류 발생");
		}
	}
	
	// 메뉴 수정
	@Override
	@Transactional
	public void update(String menuDTOJson, MultipartFile menuImageFile) {
		try {
			MenuDTO menuDTO = objectMapper.readValue(menuDTOJson, MenuDTO.class);
			Menu menu = convertToEntity(menuDTO);
			
			menuMapper.update(menu);
			
			if (menuImageFile != null && !menuImageFile.isEmpty()) {
				if (menuDTO.getImgId() != null) {
					Long existingImgId = Long.parseLong(menuDTO.getImgId());
					MenuImg existingMenuImg = menuImgMapper.findById(existingImgId);
					
					if (existingMenuImg != null) {
						String existingFileName = existingMenuImg.getFileName();
						Path existingFilePath = Paths.get(uploadDir).resolve(existingFileName);
						try {
							Files.deleteIfExists(existingFilePath);
						} catch (IOException e) {
							throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "기존 파일 삭제 중 오류가 발생하였습니다.");
						}
						menuImgMapper.delete(existingImgId);
					}
				}
				
				String originalFileName = StringUtils.cleanPath(menuImageFile.getOriginalFilename());
				String fileName = generateUniqueFileName(originalFileName);
				String fileType = menuImageFile.getContentType();
				String fileSize = String.valueOf(menuImageFile.getSize());
				
				MenuImg menuImg = new MenuImg();
				menuImg.setOriginFileName(originalFileName);
				menuImg.setFileName(fileName);
				menuImg.setFileType(fileType);
				menuImg.setFileSize(fileSize);
				
				menuImgMapper.create(menuImg);
				Long imgId = menuImg.getId();
				
				if (imgId == null) {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 ID가 생성되지 않았습니다.");
				}
				
				menu.setImgId(imgId.toString());
				
				Path targetLocation = Paths.get(uploadDir).resolve(fileName);
				Files.copy(menuImageFile.getInputStream(), targetLocation);
			} else {
				menu.setImgId(menuDTO.getImgId());
			}
			
			menuMapper.update(menu);
			
		} catch (IOException e) {
			e.printStackTrace();
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "파일 이동 중 오류가 발생하였습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 저장 중 오류가 발생하였습니다.");
		}
	}
	
	// 메뉴 삭제
	@Override
	public void delete(Long id) {
		Menu menu = menuMapper.findById(id);
		if (menu == null) {
			throw new CustomException(HttpStatus.NOT_FOUND, "해당 ID의 메뉴를 찾을 수 없습니다.");
		}
		
		String imgIdStr = menu.getImgId();
		if (imgIdStr != null) {
			try {
				Long imgId = Long.parseLong(imgIdStr);
				MenuImg menuImg = menuImgMapper.findById(imgId);
				
				if (menuImg != null) {
					String fileName = menuImg.getFileName();
					Path filePath = Paths.get(uploadDir).resolve(fileName);
					
					try {
						Files.deleteIfExists(filePath);
					} catch (IOException e) {
						throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "이미지 파일 삭제 중 오류가 발생하였습니다.");
					}
					
					menuImgMapper.delete(imgId);
				} else {
					throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "해당 이미지 ID의 이미지를 찾을 수 없습니다.");
				}
			} catch (NumberFormatException e) {
				throw new CustomException(HttpStatus.BAD_REQUEST, "잘못된 이미지 ID 형식입니다.");
			}
		}
		
		menuMapper.delete(id);
	}
	
	// 고유 파일 이름 생성
	private String generateUniqueFileName(String originalFileName) {
		String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
		return UUID.randomUUID().toString() + fileExtension;
	}
	
	//DTO -> Entity 변환
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
	
	//DTO -> Entity 변환
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
