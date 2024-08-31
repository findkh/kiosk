package com.kh.kiosk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesInfoDTO {
	private int monthlySalesCount;
	private double monthlySalesAmount;
	private int dailySalesCount;
	private double dailySalesAmount;
}
