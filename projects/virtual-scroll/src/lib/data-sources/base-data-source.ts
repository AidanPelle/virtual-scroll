import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from "rxjs";

export abstract class BaseDataSource<T> extends DataSource<T> {
    dataListener = new BehaviorSubject<T[]>([]);
    
    data: T[] = [];

    get length(): number {
        return this.data.length;
    }
}