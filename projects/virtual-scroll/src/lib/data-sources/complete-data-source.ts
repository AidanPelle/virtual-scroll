import { take, timeout } from "rxjs";
import { BaseDataSource } from "./base-data-source";
import { GetDataFunction } from "../interfaces/get-data-function";
import { REQUEST_TIMEOUT_DURATION } from "../constants";

export class CompleteDataSource<T> extends BaseDataSource<T> {
    
    override data: T[] = [];

    /** The user-provided function for asynchronously retrieving the full set of data. */
    private _getData!: GetDataFunction<T>;

    constructor(
        getData: GetDataFunction<T>,
    ) {
        super();
        this._getData = getData;
        this._handleDataRequests();
    }

    /** Handles connecting to the asynchronous data, loading it into the class and emitting to cdk-virtual-scroll-viewport. */
    private _handleDataRequests(): void {
        this._getData().pipe(timeout(REQUEST_TIMEOUT_DURATION), take(1))
            .subscribe({
                next: data => {
                    this.data = data;
                    this.dataListener.next(this.data);
                    this.isLoading.next(false);
                },
                error: error => {
                    this.isLoading.next(false);
                    console.error("error occured retrieving data:", error);
                }
            });
    }
}