package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.OrderDTO;
import com.kh.kiosk.dto.OrderDTOForAdmin;
import com.kh.kiosk.dto.SalesReportDTO;

public interface OrderService {
	Integer create(List<OrderDTO> orderDTOList);
	List<OrderDTOForAdmin> findOrders(String orderStatus, String startDate, String endDate, String keyWord);
	void updateOrderStatus(Integer callNumber, String orderStatus);
	void delete(Integer callNumber);
	SalesReportDTO getSalesReport();
}
