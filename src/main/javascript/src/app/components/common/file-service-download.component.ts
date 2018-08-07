import { Component, Directive, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FileServiceService, FileMetadata, Credential } from '../../services/file-service.service';

@Component({
    selector: 'app-file-service-download',
    templateUrl: './file-service-download.component.html',
    providers: []
})
export class FileServiceDownloadComponent implements OnInit {
    @Input() private endpoint: String;
    @Input() private credential: Credential;
    @Input() private folder: string;
    @Input() private file: FileMetadata;
    @Input() private label: String;
    @Output() private changeFile: EventEmitter<FileMetadata> = new EventEmitter<FileMetadata>();

    constructor(
        private fileServiceService: FileServiceService
    ) {
    }

    ngOnInit(): void {
    }

    addFile (event: Event) {
        event.preventDefault();
        event.stopPropagation();

        const f = document.createElement('input');
        f.style.display = 'none';
        f.type = 'file';
        f.name = 'file';
        document.body.appendChild(f);
        f.click();

        const that = this;
        f.addEventListener('change', function(evt){
            const _file = evt.target['files'][0]; // FileList object

            const reader = new FileReader();
            reader.onloadend = function(e){
                if (e.target['readyState'] === FileReader['DONE']) {
                    const file = {
                        name: _file.name,
                        path: that.folder,
                        content: {base64: btoa(e.target['result'])}
                    };
                    that.fileServiceService.addFile( that.endpoint, that.credential, file ).subscribe( res => {
                        that.file = res;
                        that.changeFile.emit(that.file);
                    });
                }
            };

            reader.readAsBinaryString(_file);
        }, false);
    }

    editFile(vent: Event) {
        event.preventDefault();
        event.stopPropagation();

        const f = document.createElement('input');
        f.style.display = 'none';
        f.type = 'file';
        f.name = 'file';
        document.body.appendChild(f);
        f.click();

        const that = this;
        f.addEventListener('change', function(evt){
            const _file = evt.target['files'][0]; // FileList object

            const reader = new FileReader();
            reader.onloadend = function(e){
                if (e.target['readyState'] === FileReader['DONE']) {
                    that.file.content = {base64: btoa(e.target['result'])};
                    that.fileServiceService.updateFile( that.endpoint, that.file ).subscribe( res => {
                        that.file = res;
                        that.changeFile.emit(that.file);
                    });
                }
            };

            reader.readAsBinaryString(_file);
        }, false);
    }

    removeFile (event: Event) {
        event.preventDefault();
        event.stopPropagation();

        this.fileServiceService.removeFile(this.endpoint, this.file).subscribe( res => this.changeFile.emit(null));
    }

    downloadFile (event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.download(this.endpoint, this.file).subscribe( res => {

            const binary = atob(res.content.base64);
            const array = new Uint8Array(binary.length);
            for (let i = 0;  i < binary.length;  i++ ) { array[i] = binary.charCodeAt(i); }
            const url = window.URL.createObjectURL(new Blob([array]));

            const a = document.createElement('a');
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);

            a.href = url;
            a.download = res.name;
            a.click();
        });
    }

    formatSize(size: number) {
        if (size / (1024 * 1024 * 1024) > 1 ) {
            return Math.round(size / (1024 * 1024 * 1024) * 100) / 100 + ' GB';
        } else if (size / (1024 * 1024) > 1) {
            return Math.round(size / (1024 * 1024) * 100) / 100 +  + ' MB';
        } else if (size / 1024 > 1) {
            return Math.round(size / 1024 * 100) / 100 + ' KB';
        }
        return size + ' B';
    }

    formatDate(date: string) {
        return new Date(date).toLocaleString('en-us');
    }

}
