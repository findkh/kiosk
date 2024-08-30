package com.kh.kiosk.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.kh.kiosk.entity.CallNumber;

@Mapper
public interface CallNumberMapper {
	Integer getMaxCallNumberForToday(String orderDate);
	void insertCallNumber(CallNumber callNumber);
}
