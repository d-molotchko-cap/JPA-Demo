package com.example.bpmproxy.service;

import java.util.List;

public interface FileStorageService {
	
	public class FileDescription {
		private String uuid;
		private String name;
		private String mime;
		private byte[] content;
		
		public FileDescription() {}
		public FileDescription(String name, String mime, byte[] content) {
			this.name = name;
			this.mime = mime;
			this.content = content;
		}
		
		public String getUuid() {
			return uuid;
		}
		public void setUuid(String uuid) {
			this.uuid = uuid;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getMime() {
			return mime;
		}
		public void setMime(String mime) {
			this.mime = mime;
		}
		public byte[] getContent() {
			return content;
		}
		public void setContent(byte[] content) {
			this.content = content;
		}
		
	}
	
	public String add(String piid, FileDescription file);
	public void remove(String piid, String uuid);
	public List<FileDescription> list(String piid);
	public FileDescription get(String piid, String uuid);
}
