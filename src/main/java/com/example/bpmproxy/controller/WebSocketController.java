package com.example.bpmproxy.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
	
	@MessageMapping("/send/{datatype}")
	@SendTo("/topic/{datatype}")
	public String onReceiveChanges(String payload) {
		return payload;
	}
}
