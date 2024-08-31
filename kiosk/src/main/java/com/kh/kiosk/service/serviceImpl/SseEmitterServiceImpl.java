package com.kh.kiosk.service.serviceImpl;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.kh.kiosk.entity.Order;
import com.kh.kiosk.mapper.OrderMapper;
import com.kh.kiosk.service.SseEmitterService;

@Service
public class SseEmitterServiceImpl implements SseEmitterService {
	
	private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();
	private final OrderMapper orderMapper;
	
	public SseEmitterServiceImpl(OrderMapper orderMapper) {
		this.orderMapper = orderMapper;
	}
	
	@Override
	public SseEmitter connect() {
		SseEmitter emitter = new SseEmitter();
		emitters.add(emitter);
		
		emitter.onCompletion(() -> emitters.remove(emitter));
		emitter.onTimeout(() -> emitters.remove(emitter));
		emitter.onError(e -> emitters.remove(emitter));
		
		try {
			emitter.send(SseEmitter.event().data("연결이 되었습니다."));
			
			List<Order> orderList = orderMapper.findRecentCompletedOrderNumbers();
			List<Integer> callNumbers = orderList.stream()
					.map(Order::getCallNumber)
					.collect(Collectors.toList());
				
			String callList = callNumbers.stream()
				.map(String::valueOf)
				.collect(Collectors.joining(", "));
			
			String output = String.format("CallList: %s",  callList);
			
			sendCallList(output);
			
		} catch (IOException e) {
			emitters.remove(emitter);
		}
		return emitter;
	}
	
	@Override
	public void sendCallList(String message) {
		for (SseEmitter emitter : emitters) {
			try {
				emitter.send(SseEmitter.event().data(message));
			} catch (IOException e) {
				emitters.remove(emitter);
			}
		}
	}
}