package com.kh.kiosk.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
	private Long id;
	private Integer orderQty;
	private String packagingOrSeat;
	private String menuId;
	private String orderStatus;
	private LocalDateTime createdDt;
	private LocalDateTime updatedDt;
	private Integer callNumber;
}
