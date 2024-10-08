package com.kh.kiosk.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.kh.kiosk.dto.OrderDTOForAdmin;
import com.kh.kiosk.entity.MenuSales;
import com.kh.kiosk.entity.MonthlySales;
import com.kh.kiosk.entity.Order;
import com.kh.kiosk.entity.SalesInfo;

public interface OrderMapper {
	void create(Order order);
	List<OrderDTOForAdmin> findOrders(@Param("orderStatus") String orderStatus, 
			@Param("startDate") String startDate, 
			@Param("endDate") String endDate,
			@Param("keyWord") String keyWord);
	void updateOrderStatus(Integer callNumber, String orderStatus);
	void delete(Integer callNumber);
	List<Order> findRecentCompletedOrderNumbers();
	SalesInfo findSalesInfo();
	List<MonthlySales> findMonthlySales();
	List<MenuSales> findMenuSales();
	List<Order> findByMenuId(String menuId);
}
