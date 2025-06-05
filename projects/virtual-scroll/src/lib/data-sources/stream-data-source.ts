import { Observable, takeUntil, tap } from "rxjs";
import { BaseDataSource } from "./base-data-source";

export class StreamDataSource<T> extends BaseDataSource<T> {

    constructor(
        data$: Observable<T[]>,
    ) {
        super();
        this.isLoading.next(true);
        data$.pipe(
            takeUntil(this._onDestroy),
            tap(list => {
                this.data = list;
                this.isLoading.next(false);
                this.dataListener.next(this.data);
            }),
        ).subscribe();
    }
}