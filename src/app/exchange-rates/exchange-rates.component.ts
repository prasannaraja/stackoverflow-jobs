import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'exchange-rates',
  templateUrl: './exchange-rates.component.html',
  styleUrls: ['./exchange-rates.component.scss'],
})
export class ExchangeRatesComponent implements OnInit {
  public exchangeRate$: Observable<any>;
  public rates = new BehaviorSubject<any[]>([]);
  public loading = new BehaviorSubject<boolean>(false);
  public error = new BehaviorSubject<any>(undefined);

  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.apollo
      .watchQuery({
        query: gql`
          {
            rates(currency: "USD") {
              currency
              rate
            }
          }
        `,
      })
      .valueChanges.subscribe((x: any) => {
        this.rates.next(x?.data?.rates);
          this.loading.next(x.loading);
          this.error.next(x.error);
      });
  }
}
