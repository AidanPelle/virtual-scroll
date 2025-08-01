import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export abstract class BaseDataSource<T> extends DataSource<T> {
    /** Handles releasing updates of the data to cdk-virtual-scroll-viewport for re-render. */
    public readonly dataListener = new BehaviorSubject<T[]>([]);
    
    /** The array of actual data to render in cdk-virtual-scroll-viewport. */
    data: T[] = [];

    /** The loading state as defined by the implementations of the BaseDataSource, for handling asynchronous data retrieval. */
    protected readonly isLoading = new BehaviorSubject<boolean>(true);

    /** A readonly observable for listening to the dataSource's loading state. */
    public readonly loading$ = this.isLoading.asObservable();

    /** Handles emitting when the number of rows in the list has changed. */
    protected readonly dataSizeChange = new BehaviorSubject<void>(undefined);

    /** A reaonly observable for listening to when the size of the list has changed. */
    public readonly dataSizeChange$ = this.dataSizeChange.asObservable();

    /** Handles cleaning up any running subscriptions when the dataSource is discarded. */
    protected readonly _onDestroy = new Subject<void>();    

    /** The total size of the data array. */
    get length(): number {
        return this.data.length;
    }

    /** Handles if we want to skip the loading animation for a row when rendering, default is false. */
    skipLoadAnimation(_index: number): boolean {
        return false;
    }

    /** Handles cleanup of any listening observables, and the disconnect. */
    onDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
        this.dataListener.complete();
    }

    override connect(_collectionViewer: CollectionViewer): Observable<readonly T[]> {
        return this.dataListener;
    }

    override disconnect(_collectionViewer: CollectionViewer): void { }
}