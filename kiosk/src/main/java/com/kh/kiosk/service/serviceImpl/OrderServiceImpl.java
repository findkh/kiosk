package com.kh.kiosk.service.serviceImpl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kh.kiosk.dto.OrderDTO;
import com.kh.kiosk.dto.OrderDTOForAdmin;
import com.kh.kiosk.entity.CallNumber;
import com.kh.kiosk.entity.Order;
import com.kh.kiosk.handler.OrderWebSocketHandler;
import com.kh.kiosk.mapper.CallNumberMapper;
import com.kh.kiosk.mapper.OrderMapper;
import com.kh.kiosk.service.OrderService;
import com.kh.kiosk.service.SseEmitterService;

@Service
public class OrderServiceImpl implements OrderService {

	private final OrderMapper orderMapper;
	private final CallNumberMapper callNumberMapper;
	private final OrderWebSocketHandler orderWebSocketHandler;
	private final SseEmitterService sseEmitterService;
	
	public OrderServiceImpl(OrderMapper orderMapper,
		CallNumberMapper callNumberMapper,
		OrderWebSocketHandler orderWebSocketHandler,
		SseEmitterService sseEmitterService) {
		this.orderMapper = orderMapper;
		this.callNumberMapper = callNumberMapper;
		this.orderWebSocketHandler = orderWebSocketHandler;
		this.sseEmitterService = sseEmitterService;
	}
	
	// 주문 조회
	@Override
	public List<OrderDTOForAdmin> findOrders(String orderStatus, String startDate, String endDate) {
		List<OrderDTOForAdmin> orderList = orderMapper.findOrders(orderStatus, startDate, endDate);
		
		return orderList.stream().map(order -> new OrderDTOForAdmin(
				order.getId(),
				order.getCallNumber(),
				order.getOrderQty(),
				order.getPackagingOrSeat(),
				order.getOrderMenuName(),
				order.getOrderStatus(),
				order.getCreatedDt(),
				order.getUpdatedDt()
			))
			.collect(Collectors.toList());
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
		
		// WebSocket을 통해 주문 정보를 관리 화면으로 전송
		String orderUpdateMessage = "New Order";
		System.out.println(orderUpdateMessage);
		orderWebSocketHandler.sendOrderUpdate(orderUpdateMessage);
		
		return newCallNumber;
	}
	
	// 주문 상태 수정
	@Transactional
	@Override
	public void updateOrderStatus(Integer callNumber, String orderStatus) {
		orderMapper.updateOrderStatus(callNumber, orderStatus);
		
		// 메뉴가 완성 되면 SSE로 고객을 호출한다.
		if (orderStatus.equals("c")) {
			List<Order> orderList = orderMapper.findRecentCompletedOrderNumbers();
			
			List<Integer> callNumbers = orderList.stream()
				.map(Order::getCallNumber)
				.collect(Collectors.toList());
			
			String currentCall = callNumber.toString();
			String callList = callNumbers.stream()
				.map(String::valueOf)
				.collect(Collectors.joining(", "));
			
			String output = String.format("currentCall: %s, CallList: %s", currentCall, callList);
			
			sseEmitterService.sendCallList(output);
		}
	}
	
	// 주문 삭제
	@Override
	public void delete(Integer callNumber) {
		orderMapper.delete(callNumber);
	}
	
	// DTO -> Entity
	private Order convertToEntity(OrderDTO orderDTO) {
		Order order = new Order();
		order.setOrderQty(orderDTO.getOrderQty());
		order.setPackagingOrSeat(orderDTO.getPackagingOrSeat());
		order.setMenuId(orderDTO.getMenuId());
		order.setOrderStatus(orderDTO.getOrderStatus());
		return order;
	}
}
