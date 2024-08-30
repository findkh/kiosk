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
public class OrderDTO {
	private Long id;
	private Integer callNumber;
	private Integer orderQty;
	private String packagingOrSeat;
	private String menuId;
	private String orderStatus;
	private LocalDateTime createdDt;
	private LocalDateTime updatedDt;
}
