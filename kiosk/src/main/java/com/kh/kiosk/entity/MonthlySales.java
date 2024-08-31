package com.kh.kiosk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlySales {
	private String yearMonth;
	private Integer monthlySalesAmount;
}
