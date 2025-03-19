import { CollectionViewer } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { BaseDataSource } from "./base-data-source";

export class CustomDataSource<T> implements BaseDataSource<T> {
    
    dataListener = new BehaviorSubject<T[]>([]);
    
    constructor(
        data: T[],
    ) {
        this.dataListener.next(data);
    }
    connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
        return this.dataListener;
    }

    disconnect(collectionViewer: CollectionViewer): void {
        
    }
    
}