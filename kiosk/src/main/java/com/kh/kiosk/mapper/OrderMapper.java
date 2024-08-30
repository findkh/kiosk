package com.kh.kiosk.mapper;

import java.util.List;

import com.kh.kiosk.dto.OrderDTOForAdmin;
import com.kh.kiosk.entity.Order;

public interface OrderMapper {
	void create(Order order);
	List<OrderDTOForAdmin> findPendingOrders(String orderStatus);
	void updateOrderStatus(Integer callNumber, String orderStatus);
}
