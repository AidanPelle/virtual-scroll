import { Observable } from "rxjs";

/**
 * This interface is for providing type-safety and intellisense on the getData
 * function provided to wh-virtual-scroll.
 */
export type GetDataFunction<T> = () => Observable<T[]>;