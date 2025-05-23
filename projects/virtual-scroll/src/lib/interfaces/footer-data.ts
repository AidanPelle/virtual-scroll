/** A template for what data can be emitted by virtual scroll, that a developer can access for building a custom footer. */
export interface VirtualScrollFooterData {
    start: number;
    end: number;
    itemCount: number;
}