package com.kh.kiosk.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.kh.kiosk.dto.OrderDTOForAdmin;
import com.kh.kiosk.entity.Order;

public interface OrderMapper {
	void create(Order order);
	List<OrderDTOForAdmin> findOrders(@Param("orderStatus") String orderStatus, 
			@Param("startDate") String startDate, 
			@Param("endDate") String endDate);
	void updateOrderStatus(Integer callNumber, String orderStatus);
	void delete(Integer callNumber);
}
