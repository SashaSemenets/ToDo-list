import { Type } from '@models/type.enum';

export interface ProgressBarSection {
  value: number;
  type: Type;
  customClass: string;
}
