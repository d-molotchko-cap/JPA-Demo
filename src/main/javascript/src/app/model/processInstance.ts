export interface Subject {
    tkiid: string;
    displayName: string;
    name: string;
    fields: string;
}

export interface Instance {
    piid: string;
    processInstanceName: string;
    key: string;
}

export interface AtRisk {
    atRiskTime: string;
    isAtRisk: boolean;
}

export interface Priority {
    priority: number;
    priorityName: string;
}

export interface ProcessInstance {
    subject: Subject;
    instance: Instance;
    assignee: string;
    received: string;
    due: string;
    atRisk: AtRisk;
    priority: Priority;
    key: string;
}
