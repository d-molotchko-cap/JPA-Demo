package com.example.bpmproxy.service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class PropagateChangesService {
	@Autowired
	private SimpMessagingTemplate template;
	
	public void propagate(String rc, Map<String, String> varType) {
		final JSONObject vars = new JSONObject(rc);
		for( String key: vars.keySet()) {
			Object value = vars.get(key);
			JSONObject message = new JSONObject();
			message.put("clientId", "service");
			message.put("data", value);
			template.send("/topic/"+varType.get(key), MessageBuilder.withPayload(message.toString().getBytes(StandardCharsets.UTF_8)).build());
		}
	}

}
