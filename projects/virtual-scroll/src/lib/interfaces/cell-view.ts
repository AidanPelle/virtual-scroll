import { ViewRef } from "@angular/core";

/** Handles bundling the column name for a given view with a reference to that view, for retrieving a view. */
export interface CellView {
    columnName: string;
    viewRef: ViewRef;
}