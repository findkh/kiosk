package com.kh.kiosk.service;

import java.util.List;

import com.kh.kiosk.dto.OrderDTO;

public interface OrderService {
	Integer create(List<OrderDTO> orderDTOList);
}
