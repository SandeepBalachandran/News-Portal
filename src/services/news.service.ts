import { Injectable, Inject } from '@angular/core';
// import { ApiHelperService } from '../api-helper/api-helper.service';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { constants } from './constants'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class NewsService {
    apiRoot: string;
    apiKey: string;
    constructor(public http: HttpClient,) {
        this.apiRoot = `https://api.nytimes.com/svc/news/v3/content`;
        this.apiKey = `uR1j3A82i48Cvvn6A4pQRWBCIhUCIvG7`;

    }

    userDetails: any = {};
    private userSource = new BehaviorSubject(this.userDetails);
    currentUser = this.userSource.asObservable();

    changeUserData(userData: any) {
        this.userSource.next(userData);
    }


    // ============================== News API Calls =====================================================================

    getSections(body): Observable<any> {
        const url = constants.apiEndPoints.getSections.replace('{key}', this.apiKey).replace('{limit}', body.limit).replace('{page}', body.page);
        return this.http.get<any>(`${this.apiRoot}/${url}`);
    }

    getArticles(body): Observable<any> {
        const url = constants.apiEndPoints.getArticles.replace('{key}', this.apiKey).replace('{limit}', body.limit).replace('{page}', body.page);
        return this.http.get<any>(`${this.apiRoot}/all/${url}`);
    }
}
