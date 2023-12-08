import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from './services/list.service';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';
import { Type } from '@models/type.enum';
import { FormControl } from '@angular/forms';

const DEBOUNCE_MS = 500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  private _unsub: Subject<void> = new Subject<void>();
  private filterSubject$ = new BehaviorSubject<string>('');
  public list$ = combineLatest([
    this._listService.list$,
    this.filterSubject$,
  ])
    .pipe(
      map(([list, searchTerm]) =>
        !!Object.values(list).flat().length
        ? list.filter((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : list
      ),
      map((list: any) =>
        !!Object.values(list).flat().length ? this._listService.groupBy(list, 'type') : list
      ),
    );
  public readonly Type: typeof Type = Type;
  filterInput: FormControl = new FormControl('');

  constructor (private readonly _listService: ListService) {}

  ngOnInit(): void {
    this._getData();
  }

  ngAfterViewInit(): void {
    this.filterInput.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        takeUntil(this._unsub),
      )
      .subscribe(res => this.filterSubject$.next(res));
  }

  private _getData(): void {
    this._listService.getData()
      .pipe(takeUntil(this._unsub))
      .subscribe();
  }

  public onReset(): void {
    this._listService.onReset();
  }

  ngOnDestroy(): void {
    this._unsub.next();
    this._unsub.complete();
  }
}
