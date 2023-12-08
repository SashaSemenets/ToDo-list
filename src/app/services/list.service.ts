import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Type } from '@models/type.enum';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private dataUrl = 'api/data';
  private initialValue = {
    [Type.Inprogress]: [],
    [Type.Postponed]: [],
    [Type.Complete]: [],
  };
  public list$: BehaviorSubject<any> = new BehaviorSubject(this.initialValue);
  public readonly Type: typeof Type = Type;

  constructor(private http: HttpClient) { }

  public getData(): Observable<any> {
    return this.http.get(this.dataUrl)
      .pipe(tap((res: any) => this.list$.next(res)));
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
    const listByType = list[type];
    const formattedList = listByType.filter((item: any) => item.id !== id);

    this.list$.next({
      ...list,
      [type]: formattedList,
    });
  }

  public onPropose(id: number, type: Type): void {
    const list = this.list$.getValue();
    const listByType = list[type];
    const postponedList = list[Type.Postponed] || [];
    const selectedItem = listByType.find((item: any) => item.id === id);
    const formattedList = listByType.filter((item: any) => item.id !== id);

    this.list$.next({
      ...list,
      [type]: formattedList,
      [Type.Postponed]: [
        ...postponedList,
        {
          ...selectedItem,
          type: Type.Postponed,
        },
      ]
    });
  }

  public onComplete(id: number, type: Type): void {
    const list = this.list$.getValue();
    const listByType = list[type];
    const completeList = list[Type.Complete] || [];
    const selectedItem = listByType.find((item: any) => item.id === id);
    const formattedList = listByType.filter((item: any) => item.id !== id);

    this.list$.next({
      ...list,
      [type]: formattedList,
      [Type.Complete]: [
        ...completeList,
        {
          ...selectedItem,
          type: Type.Complete,
        },
      ]
    });
  }

  public onReset(): void {
    this.list$.next(this.initialValue);
  }

  public addItem(name: string): void {
    const list = this.list$.getValue();
    const listArr: any = Object.values(list).flat().sort((a: any, b: any) => a.id - b.id);
    const lastItem = listArr[listArr.length - 1];
    const { id: lastItemId } = lastItem;
    const newItem = { id: lastItemId+1, name, type: Type.Inprogress };
    const inProgressList = list[Type.Inprogress] || [];

    this.list$.next({
      ...list,
      [Type.Inprogress]: [
        ...inProgressList,
        newItem,
      ]
    });
  }
}
