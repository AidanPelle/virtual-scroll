import { of } from 'rxjs';
import { GetDataFunction } from '../interfaces/get-data-function';
import { CompleteDataSource } from './complete-data-source';

describe('CompleteDataSource', () => {
  let source: CompleteDataSource<number>

  beforeEach(async () => {
    
    source = new CompleteDataSource(getData);
  });

  it('should create', () => {
    expect(source).toBeTruthy();
  });
});

const getData: GetDataFunction<number> = () => {
    return of([1, 2, 3]);
}