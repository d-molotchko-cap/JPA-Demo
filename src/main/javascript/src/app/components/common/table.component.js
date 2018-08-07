"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TableComponent = (function () {
    function TableComponent() {
        this.id = null;
        this.changeRows = new core_1.EventEmitter();
        this.pagination = null;
        this.nested = null;
        this.header = null;
        this.footer = null;
        this.lang = 'en';
        this.style = null;
        this.cssClass = null;
        this.expanded = {};
        this.totals = {};
        this.footerTotals = [];
    }
    TableComponent.prototype.ngOnInit = function () {
    };
    TableComponent.prototype.ngOnChanges = function () {
    };
    TableComponent.prototype.removeRow = function (rowIndex) {
        this.rows.splice(rowIndex, 1);
        this.rows = this.rows.slice();
        this.changeRows.emit(this.rows);
    };
    TableComponent.prototype.addRow = function (index) {
        if (!!index) {
            this.rows.splice(index, 0, {});
        }
        else {
            this.rows.push({});
        }
        this.rows = this.rows.slice();
        this.changeRows.emit(this.rows);
    };
    TableComponent.prototype.updateValue = function (event, cell, rowIndex) {
        this.rows[rowIndex][cell] = event.target.value;
        this.rows = this.rows.slice();
        this.changeRows.emit(this.rows);
    };
    return TableComponent;
}());
__decorate([
    core_1.Input()
], TableComponent.prototype, "id", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "features", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "columns", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "rows", void 0);
__decorate([
    core_1.Output()
], TableComponent.prototype, "changeRows", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "pagination", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "nested", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "header", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "footer", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "lang", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "style", void 0);
__decorate([
    core_1.Input()
], TableComponent.prototype, "cssClass", void 0);
__decorate([
    core_1.ViewChild('table')
], TableComponent.prototype, "table", void 0);
TableComponent = __decorate([
    core_1.Component({
        selector: 'app-table',
        templateUrl: './table.component.html',
        styleUrls: ['./table.component.css']
    })
], TableComponent);
exports.TableComponent = TableComponent;
