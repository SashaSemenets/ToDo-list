import { Component, Input } from '@angular/core';
import { Type } from '@models/type.enum';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() item: any;
  @Input() type: Type = Type.Inprogress;

  public readonly Type: typeof Type = Type;

  constructor(private readonly _listService: ListService) { }

  public onDelete(id: number): void {
    this._listService.deleteItem(id, this.type);
  }

  public onPropose(id: number): void {
    this._listService.onPropose(id, this.type);
  }

  public onComplete(id: number): void {
    this._listService.onComplete(id, this.type);
  }
}
