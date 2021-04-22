import { Injectable } from '@angular/core';

import { User } from '../_models/user';
import {ApitubeService} from './apitube.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiTube: ApitubeService) { }

  getAll(): any {
    // return this.apiTube.getUsers();
  }

}
