package com.example.bpmproxy.model;

public class BoTracking {
	static class Item {
		String uuid;
		String title;
		
		public String getUuid() {
			return uuid;
		}
		public void setUuid(String uuid) {
			this.uuid = uuid;
		}
		public String getTitle() {
			return title;
		}
		public void setTitle(String title) {
			this.title = title;
		}
	} 
	
	private String piid;
	private String tkiid;
	private Item layout;
	private Item milestone;
	private Item node;
	
	public BoTracking() {
	}

	public BoTracking(String piid) {
		this.piid = piid;
	}
	
	public String getPiid() {
		return piid;
	}
	public void setPiid(String piid) {
		this.piid = piid;
	}
	public String getTkiid() {
		return tkiid;
	}
	public void setTkiid(String tkiid) {
		this.tkiid = tkiid;
	}
	public Item getLayout() {
		return layout;
	}
	public void setLayout(Item layout) {
		this.layout = layout;
	}
	public Item getMilestone() {
		return milestone;
	}
	public void setMilestone(Item milestone) {
		this.milestone = milestone;
	}
	public Item getNode() {
		return node;
	}
	public void setNode(Item node) {
		this.node = node;
	}
}
