package com.kh.kiosk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuWithImageDTO {
	private MenuDTO menuDTO;
	private MenuImgDTO menuImages;
}
