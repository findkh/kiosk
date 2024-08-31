package com.kh.kiosk.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalesReportDTO {
	private SalesInfoDTO salesInfo;
	private List<MonthlySalesDTO> monthlySales;
	private List<MenuSalesDTO> menuSales;
}
