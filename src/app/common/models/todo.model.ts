import { Widget } from "./widget.model";

export enum Status {
    Todo = 'Todo',
    InProgress = 'In Progress',
    Done = 'Done'
}

export interface Todo extends Widget {
    name?: string,
    status?: Status,
    timed?: boolean,
    elapsed?: number // seconds
}