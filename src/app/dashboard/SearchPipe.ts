import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SearchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(array, value: string) {
    if(value) {
      return array.filter(array => {
        if(array.rep_name) {
          return (array.rep_name.toLowerCase()).includes(value.toLowerCase());
        } else if(array.name) {
          return (array.name.toLowerCase()).includes(value.toLowerCase());
        }
      });
    } else {
      return array
    }
  }
}
