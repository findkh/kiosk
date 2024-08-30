package com.kh.kiosk.handler;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
@Component
public class OrderWebSocketHandler extends TextWebSocketHandler {
	private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.out.println("사용자가 웹소켓 서버에 접속");
		sessions.add(session);
		System.out.println("현재 세션 수: " + sessions.size());
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("사용자가 웹소켓 서버에 접속 종료");
		sessions.remove(session);
		System.out.println("현재 세션 수: " + sessions.size());
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		
	}
	
	public void sendOrderUpdate(String message) {
		System.out.println("Sending message: " + message);
		TextMessage textMessage = new TextMessage(message);
		System.out.println("Current session count: " + sessions.size());
		for (WebSocketSession session : sessions) {
			if (session.isOpen()) {
				try {
					session.sendMessage(textMessage);
				} catch (IOException e) {
					e.printStackTrace();
				}
			} else {
				System.out.println("Session " + session.getId() + " is not open.");
			}
		}
	}
}
