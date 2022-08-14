import { TamUng } from './tam-ung.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseClient } from '../helper/client';
import { TAM_UNG_ROUTE } from '../helper/constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TamUngService extends BaseClient<TamUng> {

  constructor(http: HttpClient) {
    super(http, TAM_UNG_ROUTE);
  }

  async tinhPhanTramTamUng(maBA: string, giaTri: number): Promise<number> {
    return this.http.get<number>(`${environment.apiUrl}/${TAM_UNG_ROUTE}/phan-tram?maBA=${maBA}&giaTri=${giaTri}`).toPromise();
  }
}
