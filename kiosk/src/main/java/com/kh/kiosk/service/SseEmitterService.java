package com.kh.kiosk.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface SseEmitterService {
	SseEmitter connect();
	void sendCallList(String message);
}
