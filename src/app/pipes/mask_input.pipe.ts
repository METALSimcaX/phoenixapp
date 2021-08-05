import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask_input'
})
export class MaskInputPipe implements PipeTransform {
  transform(value: string): any {
    if (value === undefined) {
      return value;
    }
    var first_part = value.slice(6);
    var second_part = value.slice(7, value.length);
    first_part = '*'.repeat(first_part.length);
    return first_part + second_part;
  }
}
