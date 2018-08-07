package com.example.bpmproxy.service.impl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.example.bpmproxy.model.security.Identity;
import com.example.bpmproxy.service.FileStorageService;
import com.example.bpmproxy.utils.RestTemplateFactory;

@Service("bpm-storage")
class BPMFileStorageService extends RestService implements FileStorageService{

	@Value("${proxy.url}")
	private String url;

	@Value("${proxy.login}")
	private String login;

	@Value("${proxy.password}")
	private String password;

	@Override
	public String add( String piid, FileDescription file) {
		try {
			final String fullUrl = 
				this.url + "/rest/bpm/wle/v1/process/" + piid + "?action=addDocument&hideInPortal=false&docType=file&parts=header&name=" + URLEncoder.encode( file.getName(), "UTF-8" );

	        HttpPost uploadFile = new HttpPost(fullUrl);
	        uploadFile.setHeader("Authorization", makeAuthorization(login, password));
	        uploadFile.setHeader("Accept", MediaType.APPLICATION_JSON.toString());

	        MultipartEntityBuilder builder = MultipartEntityBuilder.create();

	        builder.addBinaryBody("data", file.getContent(), ContentType.create(file.getMime()), file.getName());
	        uploadFile.setEntity(builder.build());

	        HttpResponse response = null;
	        response = RestTemplateFactory.get().execute(uploadFile);
	        org.apache.http.HttpEntity responseEntity = response.getEntity();

	        InputStream is = responseEntity.getContent();
	        String result = new BufferedReader(new InputStreamReader(is))
	        		  .lines().collect(Collectors.joining("\n"));
	        
	        try {
				final JSONObject resp = new JSONObject(result);
				final JSONArray docs = resp.getJSONObject("data").getJSONArray("documents");
				final JSONObject doc = docs.getJSONObject(docs.length()-1);
				return getUuid(doc);
	        } catch( Exception e) {
	        }
	        
	        return piid;
		} catch ( IOException e) {
			e.printStackTrace();
		}
		return piid;
	}

	@Override
	public List<FileDescription> list(String piid) {
		final String fullUrl = "/rest/bpm/wle/v1/process/" + piid + "?parts=header";
		
		final JSONObject resp = getRESTObject(new Identity(login, password), fullUrl);
		try {
			final JSONArray docs = resp.getJSONObject("data").optJSONArray("documents");
			
			List<FileDescription> rc = new ArrayList<>();
			for(int i=0;  docs != null  &&  i<docs.length();  ++i) {
				final JSONObject doc = docs.getJSONObject(i);
				
				final FileDescription fd = new FileDescription();
				fd.setUuid(getUuid(doc));
				fd.setName(doc.getString("name"));
				
				rc.add(fd);
			}
			return rc;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return Collections.EMPTY_LIST;
	}

	@Override
	public void remove(String piid, String uuid) {
	}

	@Override
	public FileDescription get(String piid, String uuid) {
		return null;
	}
	
	private String getUuid(JSONObject doc) {
		return doc.getString("ID")+":"+doc.getString("ecmID");
	}
	

	private String makeAuthorization(String login, String password) {
		return "Basic "+Base64.getEncoder().encodeToString((login+":"+password).getBytes(StandardCharsets.UTF_8));
	}

	@Override
	protected String getBaseUrl() {
		return url;
	}
	
}