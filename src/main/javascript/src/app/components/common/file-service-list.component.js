"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileServiceListComponent = (function () {
    function FileServiceListComponent(fileServiceService) {
        this.fileServiceService = fileServiceService;
    }
    FileServiceListComponent.prototype.ngOnInit = function () {
        this.refresh();
    };
    FileServiceListComponent.prototype.refresh = function () {
        var _this = this;
        this.isLoading = true;
        this.fileServiceService.list(this.endpoint, this.credential, this.folder).subscribe(function (res) {
            if (!!res) {
                _this.rows = res;
            }
            _this.isLoading = false;
        });
    };
    FileServiceListComponent.prototype.addFile = function (event) {
        event.preventDefault();
        event.stopPropagation();
        var f = document.createElement('input');
        f.style.display = 'none';
        f.type = 'file';
        f.name = 'file';
        document.body.appendChild(f);
        f.click();
        var that = this;
        f.addEventListener('change', function (evt) {
            var _file = evt.target['files'][0]; // FileList object
            var reader = new FileReader();
            reader.onloadend = function (e) {
                if (e.target['readyState'] === FileReader['DONE']) {
                    var file = {
                        name: _file.name,
                        path: that.folder,
                        content: { base64: btoa(e.target['result']) }
                    };
                    that.fileServiceService.addFile(that.endpoint, that.credential, file).subscribe(function (res) { return that.refresh(); });
                }
            };
            reader.readAsBinaryString(_file);
        }, false);
    };
    FileServiceListComponent.prototype.editFile = function (event, file) {
        event.preventDefault();
        event.stopPropagation();
        var f = document.createElement('input');
        f.style.display = 'none';
        f.type = 'file';
        f.name = 'file';
        document.body.appendChild(f);
        f.click();
        var that = this;
        f.addEventListener('change', function (evt) {
            var _file = evt.target['files'][0]; // FileList object
            var reader = new FileReader();
            reader.onloadend = function (e) {
                if (e.target['readyState'] === FileReader['DONE']) {
                    file.content = { base64: btoa(e.target['result']) };
                    that.fileServiceService.updateFile(that.endpoint, file).subscribe(function (res) { return that.refresh(); });
                }
            };
            reader.readAsBinaryString(_file);
        }, false);
    };
    FileServiceListComponent.prototype.removeFile = function (event, file) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.removeFile(this.endpoint, file).subscribe(function (res) { return _this.refresh(); });
    };
    FileServiceListComponent.prototype.downloadFile = function (event, file) {
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.download(this.endpoint, file).subscribe(function (res) {
            var binary = atob(res.content.base64);
            var array = new Uint8Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            var url = window.URL.createObjectURL(new Blob([array]));
            var a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            a.href = url;
            a.download = res.name;
            a.click();
        });
    };
    FileServiceListComponent.prototype.formatSize = function (size) {
        if (size / (1024 * 1024 * 1024) > 1) {
            return Math.round(size / (1024 * 1024 * 1024) * 100) / 100 + ' GB';
        }
        else if (size / (1024 * 1024) > 1) {
            return Math.round(size / (1024 * 1024) * 100) / 100 + +' MB';
        }
        else if (size / 1024 > 1) {
            return Math.round(size / 1024 * 100) / 100 + ' KB';
        }
        return size + ' B';
    };
    FileServiceListComponent.prototype.formatDate = function (date) {
        return new Date(date).toLocaleString('en-us');
    };
    return FileServiceListComponent;
}());
__decorate([
    core_1.Input()
], FileServiceListComponent.prototype, "endpoint", void 0);
__decorate([
    core_1.Input()
], FileServiceListComponent.prototype, "credential", void 0);
__decorate([
    core_1.Input()
], FileServiceListComponent.prototype, "folder", void 0);
__decorate([
    core_1.Input()
], FileServiceListComponent.prototype, "label", void 0);
FileServiceListComponent = __decorate([
    core_1.Component({
        selector: 'app-file-service-list',
        templateUrl: './file-service-list.component.html',
        providers: []
    })
], FileServiceListComponent);
exports.FileServiceListComponent = FileServiceListComponent;
