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
        this.handleChangeDetection();
    }


    /**
     * Handles triggering refreshes on 
     */
    handleChangeDetection() {
        const iterableDiffer = new IterableDiffer();
        timer(0, 1_000).pipe(takeUntil(this.onDestroy)).subscribe(() => {
            if (iterableDiffer.diff(this.data))
                this.dataListener.next(this.data);
        });
    }
    
    connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
        return this.dataListener;
    }

    disconnect(collectionViewer: CollectionViewer): void {

    }
    
}