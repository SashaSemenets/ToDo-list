import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Type } from '@models/type.enum';
import { ListItem } from '@models/list-item';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private dataUrl = 'api/data';
  public list$: BehaviorSubject<ListItem[]> = new BehaviorSubject<ListItem[]>([]);
  public readonly Type: typeof Type = Type;

  constructor(private http: HttpClient) { }

  public getData(): Observable<ListItem[]> {
    return this.http.get<ListItem[]>(this.dataUrl)
      .pipe(tap((res: ListItem[]) => this.list$.next(res)));
  }

  public groupBy(array: any[], key: string) {
    return array.reduce((acc, obj) => {
      const keyValue = obj[key];
      acc[keyValue] = acc[keyValue] || [];
      acc[keyValue].push(obj);
      return acc;
    }, {});
  }

  public deleteItem(id: number, type: Type): void {
    const list = this.list$.getValue();
    const formattedList = list.filter((item: ListItem) => item.id !== id);

    this.list$.next(formattedList);
  }

  public onPropose(id: number, type: Type): void {
    const list = this.list$.getValue();

    list.map((item: ListItem) => {
      if (item.id === id) item.type = Type.Postponed;
      return item;
    });
    this.list$.next(list);
  }

  public onComplete(id: number, type: Type): void {
    const list = this.list$.getValue();

    list.map((item: ListItem) => {
      if (item.id === id) item.type = Type.Complete;
      return item;
    });
    this.list$.next(list);
  }

  public onReset(): void {
    this.list$.next([]);
  }

  public addItem(name: string): void {
    const list = this.list$.getValue();
    const listArr: ListItem[] = Object.values(list).flat().sort((a: ListItem, b: ListItem) => a.id - b.id);
    const lastItem = listArr[listArr.length - 1];
    const { id: lastItemId } = lastItem;
    const newItem = { id: lastItemId+1, name, type: Type.Inprogress };

    list.push(newItem);
    this.list$.next(list);
  }
}
