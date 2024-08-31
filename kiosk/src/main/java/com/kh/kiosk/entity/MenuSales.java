package com.kh.kiosk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuSales {
	private String menuName;
	private Integer totalSalesCount;
}
