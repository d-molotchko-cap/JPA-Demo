package com.example.bpmproxy.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.InvalidMediaTypeException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bpmproxy.service.FileStorageService;
import com.example.bpmproxy.service.FileStorageService.FileDescription;

@RestController
@RequestMapping("/file-storage")
public class FileUploadController {

	@Autowired
	@Qualifier("bpm-storage")
	private FileStorageService fileUploadService;
	
	@PostMapping("/upload/{piid}")
	public ResponseEntity<String> upload(@PathVariable("piid")String piid, @RequestBody Map<String, String> data) {
		JSONObject rc = new JSONObject();
		rc.put("uuid", fileUploadService.add( piid, new FileDescription(getFileName(data), getFileType(data), getFileContent(data)) ));
		return ResponseEntity.ok(rc.toString());
	}
	
	@GetMapping("/list/{piid}")
	public ResponseEntity<List<FileDescription>> list(@PathVariable("piid")String piid) {
		return ResponseEntity.ok(fileUploadService.list(piid));
	}
	
	@DeleteMapping("/delete/{piid}/{uuid}")
	public ResponseEntity<String> delete(@PathVariable("piid")String piid, @PathVariable("uuid")String uuid) {
		fileUploadService.remove(piid, uuid);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/{piid}/{uuid}/{name:.+}")
	public ResponseEntity<byte[]> get(@PathVariable("piid")String piid, @PathVariable("uuid")String uuid) {
		FileDescription fd = fileUploadService.get(piid, uuid);
		if( fd == null ) {
			return ResponseEntity.noContent().build();
		}
		String filename = fd.getName();
		try {
			filename = URLEncoder.encode(filename, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		MediaType mediaType = MediaType.TEXT_PLAIN; 
		
		try {
			mediaType = MediaType.valueOf(fd.getMime());
		} catch( InvalidMediaTypeException e ) {
		}
		
		return ResponseEntity.ok().contentType(mediaType).header("Content-Disposition", "filename=" + fd.getName()).body(fd.getContent());
	}
	
	private String getFileName(Map<String, String> data) {
		return data.get("name");
	}
	
	private String getFileType(Map<String, String> data) {
		return data.get("type");
	}

	private byte[] getFileContent(Map<String, String> data) {
		return Base64.getDecoder().decode(data.get("content"));
	}
}
