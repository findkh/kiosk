package com.kh.kiosk.service.serviceImpl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.kiosk.dto.OrderDTO;
import com.kh.kiosk.entity.CallNumber;
import com.kh.kiosk.entity.Order;
import com.kh.kiosk.mapper.CallNumberMapper;
import com.kh.kiosk.mapper.OrderMapper;
import com.kh.kiosk.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService{
	
	private final OrderMapper orderMapper;
	private final ObjectMapper objectMapper;
	private final CallNumberMapper callNumberMapper;
	
	public OrderServiceImpl(OrderMapper orderMapper,
			ObjectMapper objectMapper,
			CallNumberMapper callNumberMapper) {
		this.orderMapper = orderMapper;
		this.objectMapper = objectMapper;
		this.callNumberMapper = callNumberMapper;
	}
	
	// 주문 저장
	@Override
	@Transactional
	public Integer create(List<OrderDTO> orderDTOList) {
		String today = LocalDate.now().toString();
		
		Integer maxCallNumber = callNumberMapper.getMaxCallNumberForToday(today);
		int newCallNumber = (maxCallNumber == null) ? 1 : maxCallNumber + 1;
		
		CallNumber callNumberEntity = new CallNumber();
		callNumberEntity.setOrderDate(today);
		callNumberEntity.setCallNumber(newCallNumber);
		callNumberMapper.insertCallNumber(callNumberEntity);
		
		for (OrderDTO orderDTO : orderDTOList) {
			Order order = convertToEntity(orderDTO);
			order.setCallNumber(newCallNumber);
			orderMapper.create(order);
		}
		
		return newCallNumber;
	}

	// DTO를 엔티티로 변환하는 메서드
	private Order convertToEntity(OrderDTO orderDTO) {
		Order order = new Order();
		order.setOrderQty(orderDTO.getOrderQty());
		order.setPackagingOrSeat(orderDTO.getPackagingOrSeat());
		order.setMenuId(orderDTO.getMenuId());
		order.setOrderStatus(orderDTO.getOrderStatus());
		return order;
	}

}
