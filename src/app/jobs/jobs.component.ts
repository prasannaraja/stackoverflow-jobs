import * as xml2js from 'xml2js';

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { StackOverFlowJobs } from 'src/models/rss';
import { parse } from 'path';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  private proxyPrefix = '/proxy';
  private location = 'sydney';
  private query = `location=${this.location}`;
  private path = 'jobs/feed';

  constructor(private http: HttpClient) {}

  private get sydneyJobsUrl(): string {
    return `${this.proxyPrefix}/${this.path}?${this.query}`;
  }

  private get allJobsUrl(): string {
    return `${this.proxyPrefix}/${this.path}`;
  }

  private get stackOverflowJobs$(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json',
    };
    return this.http.get<any>(this.allJobsUrl, httpOptions);
  }

  ngOnInit(): void {
    this.stackOverflowJobs$.subscribe(
      (data) => {
        const p: xml2js.Parser = new xml2js.Parser();
        p.parseString(data, (err: any, result: any) => {
          if (err) {
            throw err;
          }
          const jobs: StackOverFlowJobs = result as StackOverFlowJobs;
          console.log(jobs.rss);
        });
      },
      (error) => {
        console.log(error, 'err');
      }
    );
  }
}
