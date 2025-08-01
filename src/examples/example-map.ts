import { Type } from "@angular/core"
import { BasicExampleComponent } from "./components/basic-example/basic-example.component";
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
import { DefaultLoadingExampleComponent } from "./components/default-loading-example/default-loading-example.component";
import { AsyncDataSourceExampleComponent } from "./components/async-data-source-example/async-data-source-example.component";
import { ShowHeaderExampleComponent } from "./components/show-header-example/show-header-example.component";
import { ShowFooterExampleComponent } from "./components/show-footer-example/show-footer-example.component";
import { CustomFooterExampleComponent } from "./components/custom-footer-example/custom-footer-example.component";
import { FlexExampleComponent } from "./components/flex-example/flex-example.component";
import { LoadingTemplateExampleComponent } from "./components/loading-template-example/loading-template-example.component";
import { EmptyStateTemplateExampleComponent } from "./components/empty-state-template-example/empty-state-template-example.component";
import { TrackByExampleComponent } from "./components/track-by-example/track-by-example.component";
import { MinMaxWidthsExampleComponent } from "./components/min-max-widths-example/min-max-widths-example.component";
import { FixedWidthExampleComponent } from "./components/fixed-width-example/fixed-width-example.component";
import { ActiveColumnExampleComponent } from "./components/active-column-example/active-column-example.component";
import { CellContextExampleComponent } from "./components/cell-context-example/cell-context-example.component";
import { SortExampleComponent } from "./components/sort-example/sort-example.component";
import { CustomHeaderCellExampleComponent } from "./components/custom-header-cell-example/custom-header-cell-example.component";
import { CustomRowExampleComponent } from "./components/custom-row-example/custom-row-example.component";
import { FilteringExampleComponent } from "./components/filtering-example/filtering-example.component";
import { StreamExampleComponent } from "./components/stream-example/stream-example.component";

type Example = {
    [route: string]: {
        title: string,
        subtitle: string,
        component: Type<unknown>
    }
};

export const EXAMPLE_COMPONENTS: Example  = {
    "active-column": {
        title: "Active Columns",
        subtitle: "Columns can be initialized as inactive, hiding them from the user. This can be useful for re-using tables, or hiding extraneous information intially.",
        component: ActiveColumnExampleComponent,
    },
    "async-data-source": {
        title: "Asynchronous DataSource",
        subtitle: "Display a default loading state while the component waits for a dataSource to be provided.",
        component: AsyncDataSourceExampleComponent,
    },
    "basic": {
        title: "Basic Configuration",
        subtitle: "A minimum setup in order to produce a working list.",
        component: BasicExampleComponent,
    },
    "cell-context": {
        title: "Cell Context",
        subtitle: "When defining a cell, we have access to a number of values in the context,"
            + " such as the list item associated with the row, the row/cell indices, and the column name",
        component: CellContextExampleComponent,
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
    "custom-footer": {
        title: "Custom Footer",
        subtitle: "Using the footer metadata we can implement a customized footer to display information about the current scroll position.",
        component: CustomFooterExampleComponent,
    },
    "custom-header-cell": {
        title: "Custom Header Cell",
        subtitle: "We can provide templates for custom header cells to be rendered instead of the default, to apply our own directives and styling.",
        component: CustomHeaderCellExampleComponent,
    },
    "custom-row": {
        title: "Custom Row",
        subtitle: "When defining a table, we can pass in a custom row to override the default template for a row in the list, or for our header row."
            + " This can be useful for adding click events or row-level styling."
            + ' The classes "vs-row" and "vs-default-header-row" can be applied to the custom row or header in order to apply the default styling.',
        component: CustomRowExampleComponent,
    },
    "default-loading": {
        title: "Default Loading",
        subtitle: "Display a default loading state while the user retrieves the dataSource.",
        component: DefaultLoadingExampleComponent,
    },
    "dynamic-height": {
        title: "Dynamic Height",
        subtitle: "Resize the viewport and the virtual list will grow/shrink accordingly.",
        component: DynamicHeightExampleComponent,
    },
    "empty-state-template": {
        title: "Empty State Template",
        subtitle: "Customize the empty state displayed to users when loading is complete, and the list is of length 0.",
        component: EmptyStateTemplateExampleComponent,
    },
    "filtering": {
        title: "Filtering Data",
        subtitle: "Filtering functions that run against the dataSource will update the list to use the filtered list.",
        component: FilteringExampleComponent,
    },
    "fixed-width": {
        title: "Fixed Width",
        subtitle: "When defining a column, we can specify a fixed width (in pixels) to make a column take a static width, without responding to screen size.",
        component: FixedWidthExampleComponent,
    },
    "flex": {
        title: "Flex Fractions",
        subtitle: "By modifying the flex property, columns can expand to take up varying fractions of the available space.",
        component: FlexExampleComponent,
    },
    "item-size": {
        title: "Item Size",
        subtitle: "Customize the size of a row to some value in pixels.",
        component: ItemSizeExampleComponent,
    },
    "loading-template": {
        title: "Loading Template",
        subtitle: "Customize the loading animation displayed to users.",
        component: LoadingTemplateExampleComponent,
    },
    "min-max-widths": {
        title: "Min/Max Widths",
        subtitle: "When defining a column, we can specify minimum and maximum widths (in pixels) as boundaries for growing/shrinking with screen size.",
        component: MinMaxWidthsExampleComponent,
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
    "show-header": {
        title: "Show Header",
        subtitle: "The header can be disabled if unwanted, such as displaying in a modal or implementing a custom header.",
        component: ShowHeaderExampleComponent,
    },
    "show-footer": {
        title: "Show Footer",
        subtitle: "The footer can be disabled if unwanted, such as implementing a custom footer.",
        component: ShowFooterExampleComponent,
    },
    "small-content": {
        title: "Small Content",
        subtitle: "When the content (itemSize * rowCount) is less than the height of the table, the table will shrink to fit the rows instead.",
        component: SmallContentExampleComponent,
    },
    "sorting": {
        title: "Sorting Data",
        subtitle: "Sorting functions that run against the dataSource will update the list to use the sorted order.",
        component: SortExampleComponent,
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
    "stream": {
        title: "Streaming Data",
        subtitle: "A dataSource for Virtual Scroll that's defined as an observable, emitting data and updates to the component over time.",
        component: StreamExampleComponent,
    },
    "track-by": {
        title: "Track By Function",
        subtitle: "A custom tracking function can be supplied for the table (like ngFor), to keep track of which rows need to be rendered.",
        component: TrackByExampleComponent,
    },
}