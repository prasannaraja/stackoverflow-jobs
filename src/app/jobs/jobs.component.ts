import * as xml2js from 'xml2js';

import { BehaviorSubject, Observable } from 'rxjs';
import { Channel, StackOverFlowJobs } from 'src/models/rss';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, map, switchMap, tap } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';

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
  public files1: TreeNode[] = [];

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
    this.stackOverflowJobs$
      .pipe(
        tap(() => this.loading$.next(true)),
        delay(500)
      )
      .subscribe(
        (data) => {
          const p: xml2js.Parser = new xml2js.Parser();
          p.parseString(data, (err: any, result: any) => {
            if (err) {
              throw err;
            }

            const jobs: StackOverFlowJobs = result as StackOverFlowJobs;

            this.job$.next(jobs.rss?.channel);
            this.loading$.next(false);

            // console.log(this.job$.value);
            this.customFilter(this.job$);
          });
        },
        (error) => {
          console.log(error, 'err');
          this.loading$.next(false);
        }
      );

    this.getFiles().then((files) => (this.files1 = files));
  }

  getFiles() {
    return this.http
      .get<any>('assets/files.json')
      .toPromise()
      .then((res) => <TreeNode[]>res.data);
  }

  customFilter(job$: BehaviorSubject<Channel[] | undefined>) {
    const demoFilter$ = job$.pipe(
      tap((x) => {
        console.log(x);
      }),
      map((x) =>
        x?.map((y) => {
          y.item.filter((l) =>
            l.category.filter((f) => f.indexOf('angular') === -1)
          );
        })
      ),
      tap((x) => {
        console.log(x);
      })
    );

    demoFilter$.subscribe();
  }
}
