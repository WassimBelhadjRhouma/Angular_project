import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type Maps = typeof google.maps;
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient,
  ) { }

  getAllAboutTunisia(): Promise<any> {
    return new Promise((resolve, reject) => {
      // axios.fetch('')

      this.http.get('https://andruxnet-world-cities-v1.p.rapidapi.com/',

        {
          params: {
            "query": "tunisia",
            "searchby": "country"
          },
          headers: {
            'x-rapidapi-key': '18eb763c37mshfee63820b47a1a9p1f6400jsn9c8593787d9f',
            'x-rapidapi-host': 'andruxnet-world-cities-v1.p.rapidapi.com'
            // "useQueryString": "true"
          }
        })
        .toPromise()
        .then((response) => {

          resolve(response);
        })
        .catch((error) => {
          console.log(error)
          reject(error);
        });
    });
  }
  getCities(state: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // axios.fetch('')
      this.http.get('https://andruxnet-world-cities-v1.p.rapidapi.com/',

        {
          params: {
            "query": state,
            "searchby": "state"
          },
          headers: {
            'x-rapidapi-key': '18eb763c37mshfee63820b47a1a9p1f6400jsn9c8593787d9f',
            'x-rapidapi-host': 'andruxnet-world-cities-v1.p.rapidapi.com'
            // "useQueryString": "true"
          }
        })
        .toPromise()
        .then((response) => {

          resolve(response);
        })
        .catch((error) => {
          console.log(error)
          reject(error);
        });
    });
  }

}
