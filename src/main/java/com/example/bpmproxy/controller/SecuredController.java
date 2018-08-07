package com.example.bpmproxy.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import com.example.bpmproxy.service.IdentityService;

public class SecuredController {

	@Autowired
	private IdentityService idService; 
	
	protected String extractToken(String header) {
		if( header == null  ||  !header.startsWith("Bearer ") ) {
			throw new HttpClientErrorException(HttpStatus.UNAUTHORIZED);
		}
		final String token = header.substring(7);
		idService.getIdentity(token);
		return token;
	}

}
