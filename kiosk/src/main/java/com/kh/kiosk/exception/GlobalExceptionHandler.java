package com.kh.kiosk.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(CustomException.class)
	@ResponseBody
	public ResponseEntity<ErrorResponse> handleCustomException(CustomException ex) {
		ErrorResponse errorResponse = new ErrorResponse(
			ex.getReason(), 
			ex.getStatusCode().value() // 상태 코드를 포함
		);
		return new ResponseEntity<>(errorResponse, ex.getStatusCode());
	}

	public static class ErrorResponse {
		private String message;
		private int statusCode;

		public ErrorResponse(String message, int statusCode) {
			this.message = message;
			this.statusCode = statusCode;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

		public int getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(int statusCode) {
			this.statusCode = statusCode;
		}
	}
}
