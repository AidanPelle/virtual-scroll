import { Type } from "@angular/core"
import { ColumnWidthsDemoComponent } from "./components/column-widths-demo/column-widths-demo.component"
import { ModifyDataDemoComponent } from "./components/modify-data-demo/modify-data-demo.component"

export const DEMO_COMPONENTS: {[id: string]: Type<unknown>} = {
    "column-widths-demo": ColumnWidthsDemoComponent,
    "modify-data-demo": ModifyDataDemoComponent,
}