import { combineLatestWith, map, Observable, shareReplay } from 'rxjs';

export class UtilityService {

  static mapRowBufferToPx(rowBuffer: Observable<number>, itemSize: Observable<number>) {
    return rowBuffer.pipe(
      combineLatestWith(itemSize),
      map(([rowBuffer, itemSize]) => {
        return rowBuffer * itemSize;
      }),
      shareReplay(1),
    );
  }
}
