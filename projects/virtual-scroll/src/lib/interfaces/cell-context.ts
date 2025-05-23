/** A template defining the context accessible by the EmbeddedViewRef for a given cell. */
export interface CellContext<T> {
    item: T;
    columnName: string;
    cellIndex: number;
}