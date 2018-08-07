import { Injectable } from '@angular/core';
import { HttpClient } from '../../../services/http-client.service';
import { Observable } from 'rxjs';
import {Statistic} from "../../../model/statistic";

@Injectable()
export class DiagramService {

  constructor(private http: HttpClient) {
  }

  getDiagram(key: string): Observable<any> {
      const options = {
          responseType: 'text' as 'text'
      };
      return this.http.get(`api/v1/diagram/${key}`, <any>options);
  }

  getStatistics(key: string): Observable<Statistic[]> {
    return this.http.get<Statistic[]>(`api/v1/statistics/${key}`);
  }
}
