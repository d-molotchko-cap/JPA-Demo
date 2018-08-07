package com.example.bpmproxy.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;

import com.example.bpmproxy.model.security.Identity;
import com.example.bpmproxy.service.IdentityService;

@RestController
public class LoginController extends SecuredController {
	
	@Autowired
	private IdentityService identityService;

    @GetMapping("/user")
    ResponseEntity<String> user(@RequestHeader(value="Authorization", required=false) String authorization){
    	JSONObject user = new JSONObject();
    	user.put("authenticated", false);
    	
    	try {
    		Identity identity = identityService.getIdentity(extractToken(authorization));
    		user.put("authenticated", true);
    		user.put("username", identity.getUsername());
    	} catch (HttpClientErrorException e) {
		}
    	return ResponseEntity.ok(user.toString());
    }
	
    @PostMapping("/login")
    ResponseEntity<String> login(@RequestBody Identity identity){
    	final String token = identityService.login(identity);
    	if( token == null ) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    	}
    	final JSONObject response = new JSONObject();
    	response.put("token", token);
    	return ResponseEntity.ok(response.toString());
    }
    
    @PostMapping("/logout")
    ResponseEntity<?> logout(@RequestHeader("Authorization")String authorization){
    	identityService.logout(extractToken(authorization));
    	return ResponseEntity.ok().build();
    }
}
