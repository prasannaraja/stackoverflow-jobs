import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
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
    const proxyURL = `${this.proxyPrefix}/${this.path}?${this.query}`;
    return fromFetch(proxyURL, {
      selector: response => response.json()
    });   
  }
    
  ngOnInit(): void {

    this.stackOverflowJobs$.subscribe({
      next: result => console.log('jobs:',result),
      complete: () => console.log('done')
    });
  }
}
