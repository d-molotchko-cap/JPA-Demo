package com.example.bpmproxy.service.impl;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.bpmproxy.service.FileStorageService;

@Service("in-memory-storage")
public class InMemoryFileStorageService implements FileStorageService {

	private Map<String, Map<String, FileDescription>> storage = new HashMap<>();
	
	@Override
	synchronized public String add(String piid, FileDescription file) {
		Map<String, FileDescription> files = getFiles(piid);
		if( file.getUuid() == null ) {
			file.setUuid(UUID.randomUUID().toString());
		}
		files.put(file.getUuid(), file);
		return file.getUuid();
	}

	@Override
	synchronized public void remove(String piid, String uuid) {
		Map<String, FileDescription> files = getFiles(piid);
		files.remove(uuid);
	}

	@Override
	synchronized public List<FileDescription> list(String piid) {
		Map<String, FileDescription> files = getFiles(piid);
		return files.entrySet().stream().map(e->e.getValue()).collect(Collectors.toList());
	}

	private Map<String, FileDescription> getFiles(String piid) {
		Map<String, FileDescription> files = storage.get(piid);
		if( files == null ) {
			storage.put(piid, files = new LinkedHashMap<>());
		}
		return files;
	}

	@Override
	public FileDescription get(String piid, String uuid) {
		Map<String, FileDescription> files = getFiles(piid);
		final FileDescription fd = files.get(uuid);
		if( fd != null ) {
			return fd;
		}
		return null;
	}
}
