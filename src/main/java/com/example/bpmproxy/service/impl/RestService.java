package com.example.bpmproxy.service.impl;

import java.nio.charset.StandardCharsets;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

import com.example.bpmproxy.model.security.Identity;
import com.example.bpmproxy.utils.DecodeEncodeUtil;
import com.example.bpmproxy.utils.RestTemplateFactory;

abstract public class RestService {

	protected abstract String getBaseUrl();
	
	protected String postREST(Identity identity, String url, String body) {
		return postREST(identity, url, body, null);
	}
	
	protected String postREST(Identity identity, String url, String body, HttpHeaders headers) {
		final byte[] response = request(identity, HttpMethod.POST, url, body, headers);
		if( response != null ) {
			return new String(response, StandardCharsets.UTF_8);
		}
		return null;
	}

	protected String putREST(Identity identity, String url, String body) {
		return putREST(identity, url, body, null);
	}
	
	protected String putREST(Identity identity, String url, String body, HttpHeaders headers) {
		final byte[] response = request(identity, HttpMethod.PUT, url, body, headers);
		if( response != null ) {
			return new String(response, StandardCharsets.UTF_8);
		}
		return null;
	}

	protected JSONObject getRESTObject(Identity identity, String url) {
		try {
        	return new JSONObject(new String(request(identity, HttpMethod.GET, url), StandardCharsets.UTF_8));
        } catch( HttpClientErrorException e ) {
        	return new JSONObject();
        }
	}

	protected JSONArray getRESTArray(Identity identity, String url) {
		try {
	        return new JSONArray(new String(request(identity, HttpMethod.GET, url), StandardCharsets.UTF_8));
        } catch( HttpClientErrorException e ) {
        	return new JSONArray();
        }
	}	
	
	private byte[] request(Identity identity, HttpMethod method, String url) {
		return request(identity, method, url, null, null);
	}
	
	private byte[] request(Identity identity, HttpMethod method, String url, String body, HttpHeaders headers) {
        final HttpHeaders reqHeaders = new HttpHeaders();
        if( identity != null ) {
            reqHeaders.add(HttpHeaders.AUTHORIZATION, "Basic " + DecodeEncodeUtil.encodeBase64(identity.getUsername()+":"+identity.getPassword()));
        }
        reqHeaders.add(HttpHeaders.ACCEPT, "application/json");
        if( headers != null ) {
        	reqHeaders.putAll(headers);
        }
	
        final HttpEntity<String> entity; 
        if( body != null ) {
        	entity = new HttpEntity<String>(body, reqHeaders);
        } else {
        	entity = new HttpEntity<String>(reqHeaders);
        }
        
        final ResponseEntity<byte[]> respEntity = RestTemplateFactory.createRestTemplate().exchange(getBaseUrl()+url, method, entity, byte[].class);
        if( respEntity.getStatusCode().is4xxClientError() ) {
        	throw new HttpClientErrorException(respEntity.getStatusCode());
        } else if( respEntity.getStatusCode().is5xxServerError() ) {
        	throw new HttpServerErrorException(respEntity.getStatusCode());
        }
        return respEntity.getBody();
	}

}
