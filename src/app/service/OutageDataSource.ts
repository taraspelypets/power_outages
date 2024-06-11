import cities from '../../assets/cities.json'
import { City } from '../model/City';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: "root",
  })
export class OutageDataSource {

    constructor(private httpClient: HttpClient ) {}

    public getOutageDataForCity(cityName: string):Observable<any> {
        let city: City = cities[cityName as keyof typeof cities];

        return this.httpClient.get(city.scheduleSource);
    }


}