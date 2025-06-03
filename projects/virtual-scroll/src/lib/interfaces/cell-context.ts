import { RowContext } from "./row-context";

/** A template defining the context accessible by the EmbeddedViewRef for a given cell. */
export interface CellContext<T> extends RowContext<T> {
    cellIndex: number;
    columnName: string;
}