package com.example.bpmproxy.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.bpmproxy.model.security.Identity;
import com.example.bpmproxy.service.IdentityService;

@Service
class IdentityServiceImpl implements IdentityService {

    @Value("${proxy.login}")
    private String login;

    @Value("${proxy.password}")
    private String password;

	@Override
	public String login(Identity identity) {
		if( isValidUser(identity) ) {
			return login;
		}
		return null;
	}

	@Override
	public void logout(String token) {
	}

	@Override
	public boolean isValidUser(Identity identity) {
    	return this.password.equals(identity.getPassword()) && this.login.toLowerCase().equals(identity.getUsername().toLowerCase());
	}

	@Override
	public Identity getIdentity(String token) {
		return new Identity(login, password);
	}
	
}
