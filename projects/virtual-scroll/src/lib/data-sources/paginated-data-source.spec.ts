import { firstValueFrom, of, skip, Subject } from 'rxjs';
import { PaginatedDataSource } from './paginated-data-source';
import { GetPageOfDataFunction } from '../interfaces/get-page-of-data-function';
import { GetCountFunction } from '../interfaces/get-count-function';
import { CollectionViewer, ListRange } from '@angular/cdk/collections';

describe('PaginatedDataSource', () => {
  let source: PaginatedDataSource<number>

  beforeEach(async () => {
    
    source = new PaginatedDataSource(getPageOfData, getCount);
  });

  it('should create', () => {
    expect(source).toBeTruthy();
  });

  it('should make a request for a new page', async () => {
    const indexToCheck = 5;

    const viewChange = new Subject<ListRange>()
    const mockViewer = {
      viewChange: viewChange,
    } as CollectionViewer;

    const currentData$ = source.connect(mockViewer);
    
    let currentData = await firstValueFrom(currentData$);
    expect(currentData[indexToCheck]).toBeUndefined();
    viewChange.next({start: 0, end: 5});
    currentData = await firstValueFrom(currentData$.pipe(skip(1)));
    expect(currentData[indexToCheck]).toEqual(indexToCheck);
  });
});

const getCount: GetCountFunction = () => {
    return of(1000);
}

const getPageOfData: GetPageOfDataFunction<number> = (index: number, pageSize: number) => {
    return of(Array(pageSize).fill(0).map((val, index) => index));
}