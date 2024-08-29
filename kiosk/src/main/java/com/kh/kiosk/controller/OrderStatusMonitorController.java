package com.kh.kiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrderStatusMonitorController {
	
	// 주문 전광판 화면 호출
	@GetMapping("/viewOrderStatusMonitor")
	public String viewOrderStatusMonitor() {
		return "/contents/orderStatusMonitor";
	}
}
