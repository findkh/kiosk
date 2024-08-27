package com.kh.kiosk.exception;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

public class CustomException extends ResponseStatusException {

	private static final long serialVersionUID = 1L;

	public CustomException(HttpStatusCode status, String reason) {
		super(status, reason);
	}
}
