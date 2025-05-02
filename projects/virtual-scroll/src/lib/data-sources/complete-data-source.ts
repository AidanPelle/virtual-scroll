import { take, timeout } from "rxjs";
import { BaseDataSource } from "./base-data-source";
import { GetDataFunction } from "../interfaces/get-data-function";
import { REQUEST_TIMEOUT_DURATION } from "../constants";

export class CompleteDataSource<T> extends BaseDataSource<T> {
    
    override data: T[] = [];

    private getData!: GetDataFunction<T>;

    constructor(
        getData: GetDataFunction<T>,
    ) {
        super();
        this.getData = getData;
        this.handleDataRequests();
    }

    handleDataRequests(): void {
        this.getData().pipe(timeout(REQUEST_TIMEOUT_DURATION), take(1))
            .subscribe({
                next: data => {
                    this.data = data;
                    this.dataListener.next(this.data);
                    this.isLoading.next(false);
                },
                error: error => {
                    this.isLoading.next(false);
                    console.log("error occured retrieving data:", error);
                }
            });
    }
}