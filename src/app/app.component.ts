import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from './services/list.service';
import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import { Type } from '@models/type.enum';
import { FormControl } from '@angular/forms';
import { ProgressBarSection } from '@models/progress-bar';
import { ListItem } from '@models/list-item';

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
      tap(([list]) => this._setProgressbar(list)),
      map(([list, searchTerm]) =>
        !!Object.values(list).flat().length
        ? list.filter((item: ListItem) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : list
      ),
      map((list: ListItem[]) =>
        !!Object.values(list).flat().length ? this._listService.groupBy(list, 'type') : list
      ),
    );
  public readonly Type: typeof Type = Type;
  filterInput: FormControl = new FormControl('');
  sections: ProgressBarSection[] = [
    { value: 0, customClass: 'inprogress', type: Type.Inprogress },
    { value: 0, customClass: 'warn', type: Type.Postponed  },
    { value: 0, customClass: 'complete', type: Type.Complete  },
  ];

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
      .subscribe((res: string) => this.filterSubject$.next(res));
  }

  private _getData(): void {
    this._listService.getData()
      .pipe(takeUntil(this._unsub))
      .subscribe();
  }

  public onReset(): void {
    this._listService.onReset();
  }

  private _setProgressbar(list: ListItem[]): void {
    const allTasks = list.length;
    const perTask = 100 / allTasks;
    const groupingTasks = !!Object.values(list).flat().length ? this._listService.groupBy(list, 'type') : null;

    if (!!groupingTasks) {
      if (!!groupingTasks[Type.Inprogress]?.length) {
        this._updateProgressbarSection(Type.Inprogress, perTask, groupingTasks[Type.Inprogress].length, 'inprogress');
      } else {
        this._clearProgressbarSection(Type.Inprogress, 'inprogress');
      }

      if (!!groupingTasks[Type.Postponed]?.length) {
        this._updateProgressbarSection(Type.Postponed, perTask, groupingTasks[Type.Postponed].length, 'warn');
      } else {
        this._clearProgressbarSection(Type.Postponed, 'warn');
      }

      if (!!groupingTasks[Type.Complete]?.length) {
        this._updateProgressbarSection(Type.Complete, perTask, groupingTasks[Type.Complete].length, 'complete');
      } else {
        this._clearProgressbarSection(Type.Complete, 'complete');
      }
    } else {
      this._clearProgressbarSection(Type.Inprogress, 'inprogress');
      this._clearProgressbarSection(Type.Postponed, 'warn');
      this._clearProgressbarSection(Type.Complete, 'complete');
    }
  }

  private _updateProgressbarSection(sectionType: Type, perTask: number, arrLen: number, customClass: string): void {
    const index = this.sections.findIndex(({ type }) => type === sectionType);
    const newRow: ProgressBarSection = {
      value: perTask * arrLen,
      customClass: customClass,
      type: sectionType,
    };

    this.sections[index] = newRow;
  }

  private _clearProgressbarSection(sectionType: Type, customClass: string): void {
    const index = this.sections.findIndex(({ type }) => type === sectionType);
    const newRow = {
      value: 0,
      customClass: customClass,
      type: sectionType,
    };

    this.sections[index] = newRow;
  }

  ngOnDestroy(): void {
    this._unsub.next();
    this._unsub.complete();
  }
}
