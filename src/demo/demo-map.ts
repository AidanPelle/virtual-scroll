import { Type } from "@angular/core"
import { ColumnWidthsDemoComponent } from "./components/column-widths-demo/column-widths-demo.component"
import { CompleteListDemoComponent } from "./components/complete-list-demo/complete-list-demo.component"
import { ContentAlignmentDemoComponent } from "./components/content-alignment-demo/content-alignment-demo.component"
import { BasicDemoComponent } from "./components/basic-demo/basic-demo.component"
import { DynamicHeightDemoComponent } from "./components/dynamic-height-demo/dynamic-height-demo.component"
import { ModifyDataDemoComponent } from "./components/modify-data-demo/modify-data-demo.component"
import { PaginatedDemoComponent } from "./components/paginated-demo/paginated-demo.component"
import { ResizableDemoComponent } from "./components/resizable-demo/resizable-demo.component"
import { ResponsiveColumnEnablingDemoComponent } from "./components/responsive-column-enabling-demo/responsive-column-enabling-demo.component"
import { StickyColumnDemoComponent } from "./components/sticky-column-demo/sticky-column-demo.component"
import { ColumnSelectorDemoComponent } from "./components/column-selector-demo/column-selector-demo.component"

type DemoComponent = {
    [route: string]: {
        title: string,
        subtitle: string,
        component: Type<unknown>
    }
};

export const DEMO_COMPONENTS: DemoComponent  = {
    "basic": {
        title: "Basic Configuration",
        subtitle: "A minimum setup in order to produce a working list.",
        component: BasicDemoComponent,
    },
    "column-selector": {
        title: "Column Selector",
        subtitle: "Allows a user to enable, disable, or reorder columns to their individual preference.",
        component: ColumnSelectorDemoComponent,
    },
    "column-widths": {
        title: "Column Widths",
        subtitle: "Column widths can be defined as a fraction, a fixed width (px), a min/max width (px), or some combination.",
        component: ColumnWidthsDemoComponent,
    },
    "complete-list": {
        title: "Complete List",
        subtitle: "A minimum setup in order to produce a working list.",
        component: CompleteListDemoComponent,
    },
    "content-alignment": {
        title: "Content Alignment",
        subtitle: "Specify if you want content to be left, center or right aligned for a given column.",
        component: ContentAlignmentDemoComponent,
    },
    "dynamic-height": {
        title: "Dynamic Height",
        subtitle: "Resize the viewport and the virtual list will grow/shrink accordingly.",
        component: DynamicHeightDemoComponent,
    },
    "modify-data": {
        title: "Modifying List Data",
        subtitle: "When using a Custom DataSource, we can append/remove items in the list, which will automatically be caught by Virtual Scroll.",
        component: ModifyDataDemoComponent,
    },
    "paginated": {
        title: "Paginated List",
        subtitle: "A paginated list, first retrieving a data count, followed by only the relevant chunks of data.",
        component: PaginatedDemoComponent,
    },
    "resizable": {
        title: "Resizable Columns",
        subtitle: "A minimum setup in order to produce a working list.",
        component: ResizableDemoComponent,
    },
    "responsive-column-enabling": {
        title: "Responsive Columns",
        subtitle: "Columns can be enabled/disabled for different screen widths, for this example we're using 1000px and 1400px as breakpoints.",
        component: ResponsiveColumnEnablingDemoComponent,
    },
    "sticky-column": {
        title: "Sticky Column",
        subtitle: "When the screen width is too small to fit all the columns on-screen, the column designated as sticky will 'stick' to either side of the viewport.",
        component: StickyColumnDemoComponent,
    },
}