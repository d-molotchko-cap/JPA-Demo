import { Injectable } from '@angular/core';
import uuid from 'uuid';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable()
export class NotificationService {
    private serverUrl = 'socket'; // <endpoint> - socket 
    private stompClient;
    private subscribers = {};
    private id;

    constructor() {
        this.id = uuid.v4();
    }

    initializeWebSocketConnection() {
        const ws = new SockJS(this.serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function(frame) {
        });
    }

    notify( datatype, instance ) {
        const msg = {
            clientId: this.id,
            data: instance
        };
        this.stompClient.send('/app/send/' + datatype, {}, JSON.stringify(msg));    // <app_prefix> - /app
    }

    subscribe( datatype, callback ) {
        let list = this.subscribers[datatype];
        if ( !list ) {
            this.subscribers[datatype] = [];
            list = this.subscribers[datatype];
        }

        list.push(callback);
    }

    private propagateChanges( datatype, data ) {
        const list = this.subscribers[datatype];
        if ( list ) {
            list.forEach( callback => {
                callback(data);
            });
        }
    }
}