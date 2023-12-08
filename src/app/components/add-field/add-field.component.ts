import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss']
})
export class AddFieldComponent {
  itemControl: FormControl = new FormControl('');

  constructor(private readonly _listService: ListService) {}

  public addItem(): void {
    const { value } = this.itemControl;

    this._listService.addItem(value);
    this.itemControl.reset();
  }
}
