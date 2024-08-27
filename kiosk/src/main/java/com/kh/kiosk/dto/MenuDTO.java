package com.kh.kiosk.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuDTO {
	private Long id;
	private String menuName;
	private String menuCategory;
	private String menuPrice;
	@JsonProperty("isActive")
	private boolean isActive;
	private String imgId;
	private String createdId;
	private LocalDateTime createdDt;
	private String modifiedId;
	private LocalDateTime modifiedDt;
}