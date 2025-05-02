import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, Subject } from "rxjs";

export abstract class BaseDataSource<T> extends DataSource<T> {
    public dataListener = new BehaviorSubject<T[]>([]);
    
    protected isLoading = new BehaviorSubject<boolean>(true);
    public loading$ = this.isLoading.asObservable();

    /**
     * Handles cleaning up any running subscriptions when the dataSource is discarded
     */
    protected _onDestroy = new Subject<void>();

    public data: T[] = [];

    get length(): number {
        return this.data.length;
    }

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