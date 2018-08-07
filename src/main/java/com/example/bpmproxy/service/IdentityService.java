package com.example.bpmproxy.service;

import com.example.bpmproxy.model.security.Identity;

public interface IdentityService {
	String login(Identity identity);
	void logout(String token);
	boolean isValidUser(Identity identity);
	Identity getIdentity(String token);
}
