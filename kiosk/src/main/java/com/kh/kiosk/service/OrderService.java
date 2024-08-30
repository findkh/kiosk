package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.OrderDTO;
import com.kh.kiosk.dto.OrderDTOForAdmin;

public interface OrderService {
	Integer create(List<OrderDTO> orderDTOList);
	List<OrderDTOForAdmin> findOrders(String orderStatus, String startDate, String endDate);
	void updateOrderStatus(Integer callNumber, String orderStatus);
	void delete(Integer callNumber);
}
