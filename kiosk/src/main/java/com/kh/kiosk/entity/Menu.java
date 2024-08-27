package com.kh.kiosk.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
	private Long id;
	private String menuName;
	private String menuCategory;
	private String menuPrice;
	private boolean isActive;
	private String imgId;
	private String createdId;
	private LocalDateTime createdDt;
	private String modifiedId;
	private LocalDateTime modifiedDt;
}
