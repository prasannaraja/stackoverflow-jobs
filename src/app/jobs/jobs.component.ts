import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, bindNodeCallback } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { fromFetch } from 'rxjs/fetch';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  private proxyPrefix = '/proxy';
  private location='sydney'
  private query = `location=${this.location}`;
  private path = 'jobs/feed';

  constructor(private http: HttpClient) { }
    
  private get stackOverflowJobs$(): Observable<any> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', }), responseType: 'text' as 'json' };
    const proxyURL = `${this.proxyPrefix}/${this.path}?${this.query}`;
    return this.http.get<any>(proxyURL, httpOptions);
  }
   
  ngOnInit(): void {

    this.stackOverflowJobs$
      .subscribe(console.log);
  }
}
