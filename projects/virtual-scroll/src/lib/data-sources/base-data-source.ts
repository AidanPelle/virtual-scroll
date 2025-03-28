import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Subject } from "rxjs";

export abstract class BaseDataSource<T> extends DataSource<T> {
    public dataListener = new BehaviorSubject<T[]>([]);
    
    /**
     * Handles cleaning up any running subscriptions when the dataSource is discarded
     */
    public onDestroy = new Subject<void>();

    public data: T[] = [];

    get length(): number {
        return this.data.length;
    }
}