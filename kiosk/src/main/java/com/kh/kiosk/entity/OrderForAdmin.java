package com.kh.kiosk.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderForAdmin {
	private Long id;
	private Integer callNumber;
	private Integer orderQty;
	private String packagingOrSeat;
	private String orderMenuName;
	private String orderStatus;
	private LocalDateTime createdDt;
	private LocalDateTime updatedDt;
}
