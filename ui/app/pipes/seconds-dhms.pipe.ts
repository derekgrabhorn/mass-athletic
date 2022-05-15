import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToDHMS'
})
export class SecondsDhmsPipe implements PipeTransform {

  transform(seconds: number): any {
    var d = Math.floor(seconds / (3600*24));
    var h = Math.floor(seconds % (3600*24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    
    var dDisplay = d > 0 ? d + (d == 1 ? "D " : "D ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? "H " : "H ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? "M " : "M ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? "S" : "S") : "";
    return(dDisplay + hDisplay + mDisplay + sDisplay);
  }

}