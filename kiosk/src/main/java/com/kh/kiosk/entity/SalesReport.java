package com.kh.kiosk.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesReport {
	private SalesInfo salesInfo;
	private MonthlySales monthlySales;
	private MenuSales menuSales;
}
