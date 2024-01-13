import { Widget } from "./widget.model";

export interface Note extends Widget {
    id?: number,
    note?: string
}