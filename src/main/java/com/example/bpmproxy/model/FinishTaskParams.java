package com.example.bpmproxy.model;

public class FinishTaskParams {
	private String piid;
	private String tkiid;
	private String luuid;
	private String nuuid;
	private String muuid;
	
	public FinishTaskParams(String piid) {
		this(piid, null, null, null, null);
	}

	public FinishTaskParams(String piid, String tkiid) {
		this(piid, tkiid, null, null, null);
	}
	
	public FinishTaskParams(String piid, String tkiid, String luuid, String nuuid, String muuid) {
		super();
		this.piid = piid;
		this.tkiid = tkiid;
		this.luuid = luuid;
		this.nuuid = nuuid;
		this.muuid = muuid;
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
	public String getLuuid() {
		return luuid;
	}
	public void setLuuid(String luuid) {
		this.luuid = luuid;
	}
	public String getNuuid() {
		return nuuid;
	}
	public void setNuuid(String nuuid) {
		this.nuuid = nuuid;
	}
	public String getMuuid() {
		return muuid;
	}
	public void setMuuid(String muuid) {
		this.muuid = muuid;
	}
}
