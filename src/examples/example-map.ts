import { Type } from "@angular/core"
import { BasicexampleComponent } from "./components/basic-example/basic-example.component";
import { ColumnSelectorExampleComponent } from "./components/column-selector-example/column-selector-example.component";
import { ColumnWidthsExampleComponent } from "./components/column-widths-example/column-widths-example.component";
import { CompleteListExampleComponent } from "./components/complete-list-example/complete-list-example.component";
import { ContentAlignmentExampleComponent } from "./components/content-alignment-example/content-alignment-example.component";
import { DynamicHeightExampleComponent } from "./components/dynamic-height-example/dynamic-height-example.component";
import { ModifyDataExampleComponent } from "./components/modify-data-example/modify-data-example.component";
import { PaginatedExampleComponent } from "./components/paginated-example/paginated-example.component";
import { ResizableExampleComponent } from "./components/resizable-example/resizable-example.component";
import { ResponsiveColumnEnablingExampleComponent } from "./components/responsive-column-enabling-example/responsive-column-enabling-example.component";
import { StickyColumnExampleComponent } from "./components/sticky-column-example/sticky-column-example.component";
import { CellPaddingExampleComponent } from "./components/cell-padding-example/cell-padding-example.component";
import { SmallContentExampleComponent } from "./components/small-content-example/small-content-example.component";
import { StaticHeightExampleComponent } from "./components/static-height-example/static-height-example.component";
import { ItemSizeExampleComponent } from "./components/item-size-example/item-size-example.component";
import { RowBufferExampleComponent } from "./components/row-buffer-example/row-buffer-example.component";
import { ResizeWidthExampleComponent } from "./components/resize-width-example/resize-width-example.component";

type Example = {
    [route: string]: {
        title: string,
        subtitle: string,
        component: Type<unknown>
    }
};

export const EXAMPLE_COMPONENTS: Example  = {
    "basic": {
        title: "Basic Configuration",
        subtitle: "A minimum setup in order to produce a working list.",
        component: BasicexampleComponent,
    },
    "cell-padding": {
        title: "Cell Padding",
        subtitle: "Allows a developer to modify the padding applied to each column by default.",
        component: CellPaddingExampleComponent,
    },
    "column-selector": {
        title: "Column Selector",
        subtitle: "Allows a user to enable, disable, or reorder columns to their individual preference.",
        component: ColumnSelectorExampleComponent,
    },
    "column-widths": {
        title: "Column Widths",
        subtitle: "Column widths can be defined as a fraction, a fixed width (px), a min/max width (px), or some combination.",
        component: ColumnWidthsExampleComponent,
    },
    "complete-list": {
        title: "Complete List",
        subtitle: "A list provided to virtual scroll asynchronously, rather than on initialization.",
        component: CompleteListExampleComponent,
    },
    "content-alignment": {
        title: "Content Alignment",
        subtitle: "Specify if you want content to be left, center or right aligned for a given column.",
        component: ContentAlignmentExampleComponent,
    },
    "dynamic-height": {
        title: "Dynamic Height",
        subtitle: "Resize the viewport and the virtual list will grow/shrink accordingly.",
        component: DynamicHeightExampleComponent,
    },
    "item-size": {
        title: "Item Size",
        subtitle: "Customize the size of a row to some value in pixels.",
        component: ItemSizeExampleComponent,
    },
    "modify-data": {
        title: "Modifying List Data",
        subtitle: "When using a Custom DataSource, we can append/remove items in the list, which will automatically be caught by Virtual Scroll.",
        component: ModifyDataExampleComponent,
    },
    "paginated": {
        title: "Paginated List",
        subtitle: "A paginated list, first retrieving a data count, followed by only the relevant chunks of data.",
        component: PaginatedExampleComponent,
    },
    "resizable": {
        title: "Resizable Columns",
        subtitle: "Columns that can be resized to any width by the end user (which will disable flex columns).",
        component: ResizableExampleComponent,
    },
    "resize-width": {
        title: "Resize Width",
        subtitle: "A custom width for the resize bar between columns, to make more obvious or less obtrusive.",
        component: ResizeWidthExampleComponent,
    },
    "responsive-column-enabling": {
        title: "Responsive Columns",
        subtitle: "Columns can be enabled/disabled for different screen widths, for this example we're using 1000px and 1400px as breakpoints.",
        component: ResponsiveColumnEnablingExampleComponent,
    },
    "row-buffer": {
        title: "Row Buffers",
        subtitle: "When the amount of rows rendered outside of the viewport (the buffer) falls below some minimum, it'll refill the buffer up to the maximum."
            + "For this example, please view the DOM to see changes in the buffer.",
        component: RowBufferExampleComponent,
    },
    "small-content": {
        title: "Small Content",
        subtitle: "When the content (itemSize * rowCount) is less than the height of the table, the table will shrink to fit the rows instead.",
        component: SmallContentExampleComponent,
    },
    "static-height": {
        title: "Static Height",
        subtitle: "The height of a table can be defined by a developer as a pixel value, to set as an unchanging height regardless of window size.",
        component: StaticHeightExampleComponent,
    },
    "sticky-column": {
        title: "Sticky Column",
        subtitle: "When the screen width is too small to fit all the columns on-screen, the column designated as sticky will 'stick' to either side of the viewport.",
        component: StickyColumnExampleComponent,
    },
}