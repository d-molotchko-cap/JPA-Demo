import { Component, Directive, Input, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FileServiceService, FileMetadata, Credential, FileContent } from '../../services/file-service.service';

@Component({
    selector: 'app-file-service-list',
    templateUrl: './file-service-list.component.html',
    providers: []
})
export class FileServiceListComponent implements OnInit {
    @Input() private endpoint: String;
    @Input() private credential: Credential;
    @Input() private folder: string;
    @Input() private label: string;
    private isLoading: boolean;

    private rows: FileMetadata[];

    constructor(
        private fileServiceService: FileServiceService
    ) {
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.isLoading = true;
        this.fileServiceService.list(this.endpoint, this.credential, this.folder).subscribe( res => {
            if (!!res) {
                this.rows = res;
            }
            this.isLoading = false;
        });
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
                    that.fileServiceService.addFile( that.endpoint, that.credential, file ).subscribe( res => that.refresh() );
                }
            };

            reader.readAsBinaryString(_file);
        }, false);
    }

    editFile (event: Event, file: FileMetadata) {
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
                    file.content = {base64: btoa(e.target['result'])};
                    that.fileServiceService.updateFile( that.endpoint, file ).subscribe( res => that.refresh() );
                }
            };

            reader.readAsBinaryString(_file);
        }, false);
    }

    removeFile (event: Event, file: FileMetadata) {
        event.preventDefault();
        event.stopPropagation();

        this.fileServiceService.removeFile(this.endpoint, file).subscribe( res => this.refresh());
    }

    downloadFile (event: Event, file: FileMetadata) {
        event.preventDefault();
        event.stopPropagation();
        this.fileServiceService.download(this.endpoint, file).subscribe( res => {

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
