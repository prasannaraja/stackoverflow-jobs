import * as xml2js from 'xml2js';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { Channel, Rss, StackOverFlowJobs } from 'src/models/rss';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { concatMap, delay, map, switchMap, tap } from 'rxjs/operators';
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
  public loading$ = new BehaviorSubject<boolean>(false);
  public jobsSubject = new BehaviorSubject<Channel[]>([]);
  public jobsTreeSubject = new BehaviorSubject<TreeNode[]>([]);

  constructor(private http: HttpClient) {}

  private get sydneyJobsUrl(): string {
    return `${this.proxyPrefix}/${this.path}?${this.query}`;
  }

  private get allJobsUrl(): string {
    return `${this.proxyPrefix}/${this.path}`;
  }

  public get stackOverflowJobs$(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json',
    };
    return this.http.get<any>(this.allJobsUrl, httpOptions);
  }

  private get jobs$(): Observable<Channel[]> {
    return this.stackOverflowJobs$.pipe(
      tap(() => this.loading$.next(true)),
      map((data) => this.mapXmlToJson(data))
    );
  }

  private mapXmlToJson(data: any): Channel[] {
    const channel$ = new BehaviorSubject<Channel[]>([]);
    const p: xml2js.Parser = new xml2js.Parser();
    p.parseString(data, (err: any, result: any) => {
      if (err) {
        throw err;
      }
      this.loading$.next(false);
      const jsonData = result as StackOverFlowJobs;
      channel$.next(jsonData.rss.channel);
    });
    return channel$.value;
  }

  ngOnInit(): void {
    const jobsTree$ = this.jobs$.pipe(
      switchMap((ch) => {
        this.jobsSubject.next(ch);
        return this.getTreeNodes(ch);
      })
    );

    jobsTree$.subscribe((nodes) => {
      this.jobsTreeSubject.next(nodes);
      this.loading$.next(false);
    });
  }

  getTreeNodes(ch: Channel[]) {
    return ch.map((c) =>
      c.item.map((i) => {
        console.log(i);
        return {
          label: i.title[0],
          data: 'Documents Folder',
          expandedIcon: 'pi pi-folder-open',
          collapsedIcon: 'pi pi-folder',
          children: [],
        };
      }) as TreeNode[]
    );

    // return this.http
    //   .get<any>('assets/files.json')
    //   .toPromise()
    //   .then((res) => <TreeNode[]>res.data);
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
