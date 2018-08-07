import { Component, Directive, Input, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FileStorageService } from '../../services/file-storage.service';

interface FileDesc {
    uuid: String;
    name: String;
    type: String;
}

@Component({
    selector: 'file-storage-component',
    templateUrl: './file-storage.component.html',
    providers: []
})
export class FileStorageComponent implements OnInit {
    @Input() private piid: String;

    private documents: FileDesc[] = [];

    constructor(
        private fileStorageService: FileStorageService
    ) {
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.fileStorageService.list( this.piid ).subscribe( res => {
            if (!!res) {
                this.documents = res;
            }
        });
    }

    remove (uuid: String) {
        this.fileStorageService.delete( this.piid, uuid );
    }

}
