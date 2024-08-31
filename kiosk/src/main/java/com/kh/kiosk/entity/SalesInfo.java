package com.kh.kiosk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesInfo {
	private int monthlySalesCount;
	private double monthlySalesAmount;
	private int dailySalesCount;
	private double dailySalesAmount;
}
