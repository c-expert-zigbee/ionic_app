import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'amFromUnix'
})
export class AmFromUnixPipe implements PipeTransform {
  transform(date: any, ...args: unknown[]): unknown {
    let nowMoment = moment(new Date(), 'X');
    let postMoment = moment.unix(date);
    if (nowMoment.diff(postMoment, 'seconds') < 10) {
      return 'Now';
    } else {
      return postMoment
        .fromNow()
        .replace(/ hours ago/g, 'h ago')
        .replace(/ hour ago/g, ' h ago')
        .replace(/ minutes ago/g, 'mins ago')
        .replace(/ minute ago/g, ' min ago')
        .replace(/ day ago/g, ' d ago')
        .replace(/ days ago/g, 'd ago');
    }
  }
}
