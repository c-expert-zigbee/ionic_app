import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regionSort'
})
export class RegionPipe implements PipeTransform {
  transform(regions: Array<any>, ...args: unknown[]): Array<any> {
    return regions.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }
}
