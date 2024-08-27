package com.kh.kiosk.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuImg {
	private Long id;
	private String originFileName;
	private String fileName;
	private String fileType;
	private String fileSize;
	private String createdId;
	private LocalDateTime createdDt;
}
