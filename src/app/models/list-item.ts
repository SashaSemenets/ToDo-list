import { Type } from '@models/type.enum';

export interface ListItem {
  id: number;
  name: string;
  type: Type;
}
