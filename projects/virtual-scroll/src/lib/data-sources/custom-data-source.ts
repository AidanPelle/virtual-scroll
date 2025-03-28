import { CollectionViewer } from "@angular/cdk/collections";
import { Observable, takeUntil, timer } from "rxjs";
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
        this.handleChangeDetection();
    }


    /**
     * Handles triggering refreshes on 
     */
    handleChangeDetection() {
        const iterableDiffer = new IterableDiffer();
        timer(0, 1_000).pipe(takeUntil(this._onDestroy)).subscribe(() => {
            if (iterableDiffer.diff(this.data))
                this.dataListener.next(this.data);
        });
    }
}