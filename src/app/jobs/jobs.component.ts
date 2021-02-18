import { Component, OnInit } from '@angular/core';
import { catchError, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { of } from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  private location = 'sydney';
  private stackOverFlowJobsRssFeedUrl = `http://careers.stackoverflow.com/jobs/feed?location=${this.location}`;
  
  constructor(private http: HttpClient) { }

  private getData$(url: string): Observable<any> {
    return this.http.get<any>(url);
  }
    
  private get stackOverflowJobs$(): Observable<any> {
    return fromFetch(this.stackOverFlowJobsRssFeedUrl, {
      selector: response => response.json()
    });
  }

  private get gitHubJobs$(): Observable<any> {
    return fromFetch('https://jobs.github.com/positions.json?page=1', {
      selector: response => response.json()
    });
  }
  
  ngOnInit(): void {

    // basic http get request
    this.getData$(this.stackOverFlowJobsRssFeedUrl)
      .subscribe((x) => {
        console.log(x);
      });
    
    //rxjs fetch method - stackoverflow
    this.stackOverflowJobs$.subscribe({
      next: result => console.log('stackoverflow jobs:',result),
      complete: () => console.log('stackoverflow done')
    });

    //rxjs fetch method - githubjobs
    this.gitHubJobs$.subscribe({
      next: result => console.log('github jobs:',result),
      complete: () => console.log('github done')
    });
  }
}
