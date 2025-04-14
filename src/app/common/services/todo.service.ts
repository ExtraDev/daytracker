import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
    providedIn: 'root'
})
export class TodosService {
    private baseUrl = 'http://localhost:25564/todos'

    constructor(private httpClient: HttpClient) { }

    public getTodos$(): Observable<Todo[] | undefined> {
        return this.httpClient.get<Todo[] | undefined>(this.baseUrl).pipe();
    }

    public getTodoForDay$(dayId: number): Observable<Todo[] | undefined> {
        return this.httpClient.get<Todo[] | undefined>(`${this.baseUrl}?dayId=${dayId}`).pipe();
    }

    public postTodo$(note: Todo): Observable<Todo> {
        return this.httpClient.post<Todo>(this.baseUrl, note).pipe();
    }

    public updateTodo$(note: Todo): Observable<Todo> {
        return this.httpClient.put<Todo>(this.baseUrl, note).pipe();
    }
}
