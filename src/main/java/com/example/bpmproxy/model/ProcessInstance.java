package com.example.bpmproxy.model;

public class ProcessInstance {

	public static class Priority {
		final private Integer priority;
		final private String priorityName;

		public Priority(Integer priority, String priorityName) {
			this.priority = priority;
			this.priorityName = priorityName;
		}

		public Integer getPriority() {
			return priority;
		}

		public String getPriorityName() {
			return priorityName;
		}
	}

	public static class AtRisk {
		final private String atRiskTime;
		final private Boolean isAtRisk;

		public AtRisk(String atRiskTime, Boolean isAtRisk) {
			this.atRiskTime = atRiskTime;
			this.isAtRisk = isAtRisk;
		}

		public String getAtRiskTime() {
			return atRiskTime;
		}

		public Boolean getIsAtRisk() {
			return isAtRisk;
		}
	}

	public static class Instance {
		final private String piid;
		final private String processInstanceName;
		final private String key;

		public Instance(String piid, String processInstanceName) {
			this.piid = piid;
			this.processInstanceName = processInstanceName;
			this.key = null;
		}

		public Instance(String piid, String processInstanceName, String key) {
			this.piid = piid;
			this.processInstanceName = processInstanceName;
			this.key = key;
		}

		public String getPiid() {
			return piid;
		}

		public String getProcessInstanceName() {
			return processInstanceName;
		}

		public String getKey() {
			return key;
		}
	}

	public static class Subject {
		final private String tkiid;
		final private String displayName;
		final private String name;
		final private String fields;
		final private String key;

		public Subject(String tkiid, String displayName, String name, String fields) {
			this.tkiid = tkiid;
			this.displayName = displayName;
			this.name  = name;
			this.fields = fields;
			this.key = null;
		}

		public Subject(String tkiid, String displayName, String name, String fields, String key) {
			this.tkiid = tkiid;
			this.displayName = displayName;
			this.name  = name;
			this.fields = fields;
			this.key = key;
		}

		public String getTkiid() {
			return tkiid;
		}

		public String getDisplayName() {
			return displayName;
		}

		public String getName() {
			return name;
		}

		public String getFields() {
			return fields;
		}

		public String getKey() {
			return key;
		}
	}

	final private Subject subject;
	final private Instance instance;
	final private String assignee;
	final private String received;
	final private String due;
	final private AtRisk atRisk;
	final private Priority priority;


	public ProcessInstance(
			Subject subject,
			Instance instance,
			String assignee,
			String received,
			String due,
			AtRisk atRisk,
			Priority priority) {
		this.subject = subject;
		this.instance = instance;
		this.assignee = assignee;
		this.received = received;
		this.due = due;
		this.atRisk = atRisk;
		this.priority = priority;
	}


	public Subject getSubject() {
		return subject;
	}


	public Instance getInstance() {
		return instance;
	}


	public String getAssignee() {
		return assignee;
	}


	public String getReceived() {
		return received;
	}


	public String getDue() {
		return due;
	}


	public AtRisk getAtRisk() {
		return atRisk;
	}


	public Priority getPriority() {
		return priority;
	}

}
