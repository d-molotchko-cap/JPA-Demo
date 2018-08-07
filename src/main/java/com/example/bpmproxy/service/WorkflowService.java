package com.example.bpmproxy.service;

import java.io.UnsupportedEncodingException;
import java.util.List;

import com.example.bpmproxy.model.BoTracking;
import com.example.bpmproxy.model.ProcessInstance;
import com.example.bpmproxy.model.Statistic;

public interface WorkflowService {
	String start(String token, String acronym, String body);
	List<ProcessInstance> getInstances(String token, String[] acronyms);
	String getTaskData(String token, String tkiid);
	String finishTask(String token, BoTracking taskParams, String params) throws UnsupportedEncodingException;

	/**
	 * Provides bpmn 2.0 xml representation of process
	 *
	 * @param key process key (definition id)
	 * @return xml representation of workflow definition
	 *
	 */
	String getXml(String token, String key);

	/**
	 * Provides statistic about runned instances within process
	 *
	 * @param key process key (definition id)
	 * @return statistics
	 */
	List<Statistic> getStatistics(String token, String key);
}
