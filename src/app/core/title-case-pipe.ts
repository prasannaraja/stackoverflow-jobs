import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titleCase' })
export class TitleCasePipe implements PipeTransform {
  public transform(input: string[] | undefined): string {
    if (!input) {
      return '';
    } else {
      return input[0].replace(/\b\w/g, (first) => first.toLocaleUpperCase());
    }
  }
}
