"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var FileServiceDownloadComponent = (function () {
    function FileServiceDownloadComponent(fileServiceService) {
        this.fileServiceService = fileServiceService;
        this.changeFile = new core_1.EventEmitter();
    }
    FileServiceDownloadComponent.prototype.ngOnInit = function () {
    };
    FileServiceDownloadComponent.prototype.addFile = function (event) {
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
                    that.fileServiceService.addFile(that.endpoint, that.credential, file).subscribe(function (res) {
                        that.file = res;
                        that.changeFile.emit(that.file);
                    });
                }
            };
            reader.readAsBinaryString(_file);
        }, false);
    };
    FileServiceDownloadComponent.prototype.editFile = function (vent) {
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
                    that.file.content = { base64: btoa(e.target['result']) };
                    that.fileServiceService.updateFile(that.endpoint, that.file).subscribe(function (res) {
                        that.file = res;
                        that.changeFile.emit(that.file);
                    });
                }
            };
            reader.readAsBinaryString(_file);
        }, false);
    };
    FileServiceDownloadComponent.prototype.removeFile = function (event) {
        var _this = this;
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.removeFile(this.endpoint, this.file).subscribe(function (res) { return _this.changeFile.emit(null); });
    };
    FileServiceDownloadComponent.prototype.downloadFile = function (event) {
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.download(this.endpoint, this.file).subscribe(function (res) {
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
    FileServiceDownloadComponent.prototype.formatSize = function (size) {
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
    FileServiceDownloadComponent.prototype.formatDate = function (date) {
        return new Date(date).toLocaleString('en-us');
    };
    return FileServiceDownloadComponent;
}());
__decorate([
    core_1.Input()
], FileServiceDownloadComponent.prototype, "endpoint", void 0);
__decorate([
    core_1.Input()
], FileServiceDownloadComponent.prototype, "credential", void 0);
__decorate([
    core_1.Input()
], FileServiceDownloadComponent.prototype, "folder", void 0);
__decorate([
    core_1.Input()
], FileServiceDownloadComponent.prototype, "file", void 0);
__decorate([
    core_1.Input()
], FileServiceDownloadComponent.prototype, "label", void 0);
__decorate([
    core_1.Output()
], FileServiceDownloadComponent.prototype, "changeFile", void 0);
FileServiceDownloadComponent = __decorate([
    core_1.Component({
        selector: 'app-file-service-download',
        templateUrl: './file-service-download.component.html',
        providers: []
    })
], FileServiceDownloadComponent);
exports.FileServiceDownloadComponent = FileServiceDownloadComponent;
