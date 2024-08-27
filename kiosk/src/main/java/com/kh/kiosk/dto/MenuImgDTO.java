package com.kh.kiosk.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImgDTO {
	private Long id;
	private String originFileName;
	private String fileName;
	private String fileType;
	private String fileSize;
	private String createdId;
	private LocalDateTime createdDt;
}