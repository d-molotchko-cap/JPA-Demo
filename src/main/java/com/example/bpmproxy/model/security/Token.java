package com.example.bpmproxy.model.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

final public class Token {

	private final String token; 
	
	public Token(Identity identity) {
		SecureRandom sr = new SecureRandom();
        byte[] salt = new byte[12];
        sr.nextBytes(salt);
        
        MessageDigest md;
		try {
			md = MessageDigest.getInstance("SHA-256");
	        md.update(salt);
	        md.update(identity.getUsername().getBytes(StandardCharsets.UTF_8));
	        this.token = 
	        	Base64.getEncoder()
	        		.encodeToString(
	        			md.digest(
	        				identity.getPassword().getBytes(StandardCharsets.UTF_8)
	        			)
	        		);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	public Token(String token) {
		this.token = token;
	}

	public String getToken() {
		return token;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((token == null) ? 0 : token.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Token other = (Token) obj;
		if (token == null) {
			if (other.token != null)
				return false;
		} else if (!token.equals(other.token))
			return false;
		return true;
	}
	
	
}
