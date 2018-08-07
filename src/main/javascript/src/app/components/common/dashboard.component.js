"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var process_instance_diagram_component_1 = require("./process-instance-diagram.component");
var reducer_1 = require("../../reducer");
var DashboardComponent = (function () {
    function DashboardComponent(ngRedux, service, router, modalService) {
        this.ngRedux = ngRedux;
        this.service = service;
        this.router = router;
        this.modalService = modalService;
        this.instances = [];
    }
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.subData = this.ngRedux.select(reducer_1.TASK_STORE_KEY).subscribe(function (data) {
            _this.instances = data[reducer_1.TASK_STORE_LIST_KEY];
        });
        this.refresh();
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        this.subData.unsubscribe();
    };
    DashboardComponent.prototype.refresh = function () {
        var _this = this;
        this.isLoading = true;
        this.ngRedux.dispatch({
            type: 'GET_INSTANCES',
            params: { succCallback: function () { return _this.isLoading = false; }, errCallback: function () { return _this.isLoading = false; } }
        });
    };
    DashboardComponent.prototype.showProcessInstanceImage = function (processInstance) {
        this.bsModalRef = this.modalService.show(process_instance_diagram_component_1.PIDiagramComponent, { class: 'modal-full-screen' });
        this.bsModalRef.content.processInstance = processInstance;
    };
    DashboardComponent.prototype.prepareLink = function (row) {
        var url = '/' + this.camel(row.instance.processInstanceName) +
            '/' + this.camel(row.subject.displayName) +
            '/' + row.subject.tkiid +
            '/' + row.instance.piid;
        return url;
    };
    DashboardComponent.prototype.camel = function (str) {
        var camel = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/[\s\\-]+/g, '');
        return camel.charAt(0).toLowerCase() + camel.slice(1);
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        templateUrl: './dashboard.component.html'
    })
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
