package com.example.bpmproxy.model;

public class Statistic {
    private String id;
    private Integer instances;

    public Statistic() {
    }

    public Statistic(String id, Integer instances) {
        this.id = id;
        this.instances = instances;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getInstances() {
        return instances;
    }

    public void setInstances(Integer instances) {
        this.instances = instances;
    }
}