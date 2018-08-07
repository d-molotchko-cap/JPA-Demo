import { Injectable } from '@angular/core';
import { HttpClient } from './http-client.service';
import { Observable } from 'rxjs';

// Data types
import { Pet } from '../model/pet';

export class GetPetByIdSOAServicePostParams {
    'pet': Pet;
}

@Injectable()
export class GetPetByIdSOAService {

    private apiURL = 'api/v1/service/GetPetByIdSOAService';

    constructor(private http: HttpClient) {}

    execute(pet: Pet): Observable<GetPetByIdSOAServicePostParams> {
        const body = {
            'pet': pet
        };
        return this.http.post<GetPetByIdSOAServicePostParams>(this.apiURL, body);
    }
}
