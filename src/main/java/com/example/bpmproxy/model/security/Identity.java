package com.example.bpmproxy.model.security;

final public class Identity {
	private String username;
	private String password;

	protected Identity() {
	}
	
	public Identity(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}
	
	public String getUsername() {
		return username;
	}
	public String getPassword() {
		return this.password;
	}
}
