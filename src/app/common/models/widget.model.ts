export enum Widget_Type {
    Date,
    Timer,
    Todolist,
    Note
}

export interface Widget {
    name?: string,
    type: Widget_Type
}