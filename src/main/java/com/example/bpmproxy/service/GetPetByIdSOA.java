package com.example.bpmproxy.service;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;

import com.example.bpmproxy.invoker.Invoker;

public class GetPetByIdSOA {

	/*
	 * inputs and outputs are json:
	 * {
	 * 	varName: 123,
	 *  varName3: {
	 *  	field: 45,
	 *  	field1: true,
	 *  	...
	 *  }
	 * }
	 * */
	
	public static String execute(String inputs){
		// 1 create & initialize variables
		JSONObject variables = new JSONObject(inputs);
		
		// 2 start a process
		invokeGetPetById(variables);

		// 3. return
		final String[] outputs = new String[] {"pet"};
		return Invoker.makeVariables(variables, outputs);
	}

	private static void invokeGetPetById(JSONObject variables) {
		final String func = "GET";
		final String url = "http://petstore.swagger.io/v2/pet/{pet.id}";
		final String body = "";
		final String[] outputs = new String[] {"pet"};
		final String dateFormat = "";

		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json; charset=utf-8");
		headers.put("Accept", "application/json");

        Invoker.invokeRest( func, url, body, headers, variables, outputs, dateFormat);
	}
}
