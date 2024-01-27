import { Widget } from "./widget.model";

export interface Day {
    id?: number,
    date?: string,
    name?: string,
    widgets?: Widget[]
}