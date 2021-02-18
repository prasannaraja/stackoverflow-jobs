import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';

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

    // rxjs fetch method - githubjobs
    this.gitHubJobs$.subscribe({
      next: result => console.log('github jobs:',result),
      complete: () => console.log('github done')
    });

    // using proxy
    const fetchUsingProxy$ = fromFetch(`/api/jobs/feed?location=${this.location}`, {
      selector: response => response.json()
    });
    
    fetchUsingProxy$.subscribe((x) => {
      console.log(x);
    })
  }
}
