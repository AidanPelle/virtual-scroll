/** A template defining the context accessible by the EmbeddedViewRef for a given row. */
export interface RowContext<T> {
    $implicit: T;
    index: number;
}