import { delay, filter, map, merge, Observable, of, switchMap, take, takeUntil, tap, timeout } from "rxjs";
import { BaseDataSource } from "./base-data-source";
import { PAGE_SIZE, RENDER_DELAY, REQUEST_TIMEOUT_DURATION } from "../constants";
import { GetPageOfDataFunction } from "../interfaces/get-page-of-data-function";
import { CollectionViewer, ListRange } from "@angular/cdk/collections";
import { GetCountFunction } from "../interfaces/get-count-function";

enum PageMetadata {
    IN_PROGRESS,
    CACHED,
}

export class PaginatedDataSource<T> extends BaseDataSource<T> {

    /**
     * The actual data being displayed on screen. Since this list is paginated, we use a sparse array for portions not
     * yet fetched in order to save memory usage.
     */
    override data: T[] = [];

    /** 
     * Whenever the data for a row is loaded, the row is re-rendered by cdk-virtual-scroll-viewport, so we want to
     * skip the next loading animation (to avoid any jitter) when rendering. This list contains which rows we
     * want to skip the animation for.
     * 
     * In order to reduce memory usage on large lists, this object is a sparse array.
     */
    public skipLoadAnimations: boolean[] = [];

    /**
     * Handles tracking the state of pages that would be fetched from the remote source, to avoid duplicate calls.
     * 
     * In order to reduce memory usage on large lists, this object is a sparse array.
     */
    pageMetadata: PageMetadata[] = [];

    /** This function handles retrieving a subset of the overall list, given a starting index and page size for the request. */
    private getPageOfData!: GetPageOfDataFunction<T>;

    /** This function handles retrieving the overall size of the list, so we know how large to render our table. */
    private getCount!: GetCountFunction;

    constructor(
        getPageOfData: GetPageOfDataFunction<T>,
        getCount: GetCountFunction,
    ) {
        super();
        this.getPageOfData = getPageOfData;
        this.getCount = getCount;
        this.handleDataRequests();
    }

    /** Handles running the count function and updating virtual scroll with the current loading state. */
    handleDataRequests(): void {
        this.getCount()
            .pipe(
                timeout(REQUEST_TIMEOUT_DURATION),
                take(1)
            )
            .subscribe({
                next: count => {
                    this.data = Array(count);
                    const numPages = Math.ceil(count / PAGE_SIZE);
                    this.pageMetadata = Array(numPages);
                    this.skipLoadAnimations = Array(count);

                    this.dataListener.next(this.data);
                    this.isLoading.next(false);
                },
                error: error => {
                    console.error("Error retrieving count:", error);
                    this.isLoading.next(false);
                },
            });
    }

    override connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
        let currentViewRange: ListRange = { start: -1, end: -1 };

        const viewChange$ = collectionViewer.viewChange.pipe(
            tap(viewChange => currentViewRange = viewChange),
        );

        const rowsToProcess$ = viewChange$.pipe(
            delay(RENDER_DELAY),
            switchMap(viewChange => {
                const start = Math.max(currentViewRange.start, viewChange.start);
                const end = Math.min(currentViewRange.end, viewChange.end);
                if (start > end)
                    return of();
                else {
                    const indexesToEmit = Array.from({ length: end - start + 1 }).map((_, i) => i + start);
                    return merge(indexesToEmit);
                }
            }),
        );

        rowsToProcess$.pipe(
            takeUntil(this._onDestroy),
            map(rowIndex => Math.floor(rowIndex / PAGE_SIZE)),
            filter(pageIndex => {
                // If the requested page is out of bounds of possible existing pages, we can skip the request
                if (pageIndex > this.pageMetadata.length)
                    return false;

                // If page before the requested page is not missing, and the requested page is not missing, and the page after isn't missing,
                // then we want to skip this request.
                // We add guards for the page before/after to avoid outOfBounds errors on the pages.
                if (Object.prototype.hasOwnProperty.call(this.pageMetadata, Math.max(pageIndex - 1, 0))
                    && Object.prototype.hasOwnProperty.call(this.pageMetadata, pageIndex)
                    && Object.prototype.hasOwnProperty.call(this.pageMetadata, Math.min(pageIndex + 1, this.pageMetadata.length - 1)))
                    return false;

                return true;
            }),
            map(pageIndex => {
                let rowIndex = 0;
                let chunkSize = 0;
                if (pageIndex !== 0 && !Object.prototype.hasOwnProperty.call(this.pageMetadata, pageIndex - 1)) {
                    this.pageMetadata[pageIndex - 1] = PageMetadata.IN_PROGRESS;
                    rowIndex = (pageIndex - 1) * PAGE_SIZE;
                    chunkSize += PAGE_SIZE;
                }
                if (!Object.prototype.hasOwnProperty.call(this.pageMetadata, pageIndex)) {
                    this.pageMetadata[pageIndex] = PageMetadata.IN_PROGRESS;
                    rowIndex = chunkSize > 0 ? rowIndex : pageIndex * PAGE_SIZE;
                    chunkSize += PAGE_SIZE;
                }
                if (pageIndex + 1 <= this.pageMetadata.length - 1 && !Object.prototype.hasOwnProperty.call(this.pageMetadata, pageIndex + 1)) {
                    this.pageMetadata[pageIndex + 1] = PageMetadata.IN_PROGRESS;
                    rowIndex = chunkSize > 0 ? rowIndex : (pageIndex + 1) * PAGE_SIZE;
                    chunkSize += PAGE_SIZE;
                }

                if (rowIndex + chunkSize >= this.length)
                    chunkSize = this.length - rowIndex;

                return [pageIndex, rowIndex, chunkSize];
            }),
        ).subscribe(([pageIndex, rowIndex, chunkSize]) => {
            this.getPageOfData(rowIndex, chunkSize).pipe(
                timeout(REQUEST_TIMEOUT_DURATION),
                take(1),
            ).subscribe({
                next: fetchedData => {
                    // Once we've retrieved the page of data, splice it into the cached list of data.
                    this.pageMetadata[pageIndex - 1] = PageMetadata.CACHED;
                    this.pageMetadata[pageIndex] = PageMetadata.CACHED;
                    this.pageMetadata[pageIndex + 1] = PageMetadata.CACHED;
                    this.data.splice(
                        rowIndex,
                        fetchedData.length,
                        ...fetchedData,
                    );
    
                    // Get references to the first and last items visible in the viewport.
                    const start = currentViewRange.start;
                    const end = currentViewRange.end;
    
    
                    // We only want to skip the loading animation for data that was fetched and currently exists within the rendered viewport.
                    if (rowIndex <= end && rowIndex + fetchedData.length >= start) {
    
                        const firstRenderedFetchedItem = Math.max(rowIndex, start);
    
                        // Only skip the loading animation for rows that are within the indices of the visible viewport,
                        // AND exist within this batch of fetched data.
                        this.skipLoadAnimations.splice(
                            firstRenderedFetchedItem,
                            end - firstRenderedFetchedItem,
                            ...Array(end - firstRenderedFetchedItem).fill(true),
                        );
                    }
    
                    // Emit to cdk-virtual-scroll the updated dataSource.
                    this.dataListener.next(this.data);
                },
                error: error => {
                    console.error("Error retrieving page:", error);
                    if (this.pageMetadata[pageIndex - 1] === PageMetadata.IN_PROGRESS)
                        delete this.pageMetadata[pageIndex - 1];
                    if (this.pageMetadata[pageIndex] === PageMetadata.IN_PROGRESS)
                        delete this.pageMetadata[pageIndex];
                    if (this.pageMetadata[pageIndex + 1] === PageMetadata.IN_PROGRESS)
                        delete this.pageMetadata[pageIndex];

                    // If we had deleted the pageMetadata for the last item in the array, we want to make sure the array doesn't shrink by upping the length.
                    if (pageIndex >= this.pageMetadata.length)
                        this.pageMetadata.length = pageIndex + 1;
                }
            });
        });
        return this.dataListener;
    }

    override skipLoadAnimation(_index: number): boolean {
        const skipLoadAnimation = this.skipLoadAnimations[_index] ?? false;
        delete this.skipLoadAnimations[_index];
        return skipLoadAnimation;
    }
}