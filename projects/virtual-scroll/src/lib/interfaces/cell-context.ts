/** A template defining the context accessible by the EmbeddedViewRef for a given cell. */
export interface CellContext<T> {
    $implicit: T;
    index: number;
    columnName: string;
    cellIndex: number;
}