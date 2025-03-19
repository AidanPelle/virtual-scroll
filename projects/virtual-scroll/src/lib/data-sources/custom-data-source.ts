import { CollectionViewer } from "@angular/cdk/collections";
import { Observable } from "rxjs";
import { BaseDataSource } from "./base-data-source";

export class CustomDataSource<T> extends BaseDataSource<T> {
    override data: T[] = [];
    
    constructor(
        newData: T[],
    ) {
        super();
        this.data = newData;
        this.dataListener.next(newData);
    }
    
    connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
        return this.dataListener;
    }

    disconnect(collectionViewer: CollectionViewer): void {

    }
    
}