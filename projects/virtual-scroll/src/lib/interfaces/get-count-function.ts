import { Observable } from "rxjs";

/**
 * This interface is for ensuring type-safety inside wh-virtual-scroll on the function
 * for getting the count for a list when using the paginated data strategy.
 */
export type GetCountFunction = () => Observable<number>;
