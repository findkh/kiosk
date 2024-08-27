package com.kh.kiosk.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashBoardController {
	
	// 대시보드 화면 호출
	@GetMapping("/viewDashboard")
	public String viewDashboard() {
		return "dashboard";
	}
	
	
}
