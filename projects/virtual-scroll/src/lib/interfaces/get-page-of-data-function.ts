import { Observable } from "rxjs";

/**
 * This interface is for providing type-safety and intellisense on the getPageOfData
 * function provided to wh-virtual-scroll, for when using the paginated data retrieval strategy.
 */
export type GetPageOfDataFunction<T> = (index: number, pageSize: number) => Observable<T[]>;
