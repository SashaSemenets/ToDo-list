import { Injectable } from '@angular/core';
import { ListItem } from '@models/list-item';
import { Type } from '@models/type.enum';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const data: ListItem[] = [
      { id: 1, name: 'Get Cami some Crocs', type: Type.Inprogress },
      { id: 2, name: 'Finish unit tests', type: Type.Inprogress },
      { id: 3, name: 'Book flight for Madrid', type: Type.Postponed },
    ];

    return {data};
  }
}
