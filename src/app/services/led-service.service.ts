import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LedService {
  private apiUrl = 'http://raspberrypi:8000';

  constructor(private http: HttpClient) {}

  setLEDState(key: string, state: boolean): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${key}/set`,
      { state },
      { observe: 'response' }
    );
  }
}
