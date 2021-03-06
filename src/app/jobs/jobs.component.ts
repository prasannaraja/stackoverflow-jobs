import * as xml2js from 'xml2js';

import { BehaviorSubject, Observable } from 'rxjs';
import { Channel, StackOverFlowJobs } from 'src/models/rss';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, take, tap } from 'rxjs/operators';

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
  public job$ = new BehaviorSubject<Channel[] | undefined>([]);
  public loading$ = new BehaviorSubject<boolean>(false);

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
    return this.http.get<any>(this.sydneyJobsUrl, httpOptions);
  }

  ngOnInit(): void {
    this.stackOverflowJobs$.pipe(
      tap(() => this.loading$.next(true)),
      delay(500)
    ).subscribe(
      (data) => {
        const p: xml2js.Parser = new xml2js.Parser();
        p.parseString(data, (err: any, result: any) => {
          if (err) {
            throw err;
          }

          const jobs: StackOverFlowJobs = result as StackOverFlowJobs;

          this.job$.next(jobs.rss?.channel);
          this.loading$.next(false);

          console.log(this.job$.value);
        });
      },
      (error) => {
        console.log(error, 'err');
        this.loading$.next(false);
      }
    );
  }
}
