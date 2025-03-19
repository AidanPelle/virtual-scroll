import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject } from "rxjs";

export abstract class BaseDataSource<T> extends DataSource<T> {
    abstract dataListener: BehaviorSubject<T[]>;
}