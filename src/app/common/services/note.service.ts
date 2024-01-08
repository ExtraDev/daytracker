import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Note } from 'src/app/common/models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private baseUrl = 'http://localhost:3000/notes'

  constructor(private httpClient: HttpClient) { }

  public getNotes$(): Observable<Note[] | undefined> {
    return this.httpClient.get<Note[] | undefined>(this.baseUrl).pipe(
      tap((notes) => console.log(notes))
    );
  }

  public getNoteForDay$(dayId: number): Observable<Note[] | undefined> {
    return this.httpClient.get<Note[] | undefined>(`${this.baseUrl}?dayId=${dayId}`).pipe();
  }

  public postNote$(note: Note): Observable<Note> {
    return this.httpClient.post<Note>(this.baseUrl, note).pipe();
  }

  public updateNote$(note: Note): Observable<Note> {
    return this.httpClient.put<Note>(this.baseUrl, note).pipe();
  }
}
