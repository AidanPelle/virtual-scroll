import { IterableDiffer } from './iterable-differ';

describe('IterableDiffer', () => {
  let differ: IterableDiffer<number>;

  beforeEach(async () => {
    
    differ = new IterableDiffer();
  });

  it('should create', () => {
    expect(differ).toBeTruthy();
  });

  it('should not expect changes from empty array', () => {
    const changes = differ.diff([]);
    expect(changes).toBeFalsy();
  })

  it('should expect changes', () => {
    const changes = differ.diff([0]);
    expect(changes).toBeTruthy();
  });

  it('should expect changes in array of same length with different values', () => {
    differ.diff([1, 2, 3]);
    const changes = differ.diff([1, 2, 4]);
    expect(changes).toBeTruthy();
  });
});
