import { takeUntil, timer } from "rxjs";
import { BaseDataSource } from "./base-data-source";
import { IterableDiffer } from "../iterable-differ/iterable-differ";

export class CustomDataSource<T> extends BaseDataSource<T> {
    
    override data: T[] = [];
    
    constructor(
        newData: T[],
    ) {
        super();
        this.data = newData;
        this.isLoading.next(false);
        this._handleChangeDetection();
    }


    /** Handles triggering refreshes on changes to the rows and underlying data. */
    private _handleChangeDetection() {
        const iterableDiffer = new IterableDiffer();
        timer(0, 500).pipe(takeUntil(this._onDestroy)).subscribe(() => {
            if (iterableDiffer.diff(this.data))
                this.dataListener.next(this.data);
        });
    }
}