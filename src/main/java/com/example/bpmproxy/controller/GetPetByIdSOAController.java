package com.example.bpmproxy.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.bpmproxy.service.GetPetByIdSOA;

@Controller
public class GetPetByIdSOAController {

	@PostMapping(value="/api/v1/service/GetPetByIdSOAService", produces="application/json")
	public ResponseEntity<String> execute(@RequestBody String inputs){
		final String rc = GetPetByIdSOA.execute(inputs);
		return ResponseEntity.ok(rc);
	}
}
