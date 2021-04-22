import {Category} from './category';
import {Item} from './item';

export interface Catalog {
  Categories: Category[];
  Items: Item[];
}
