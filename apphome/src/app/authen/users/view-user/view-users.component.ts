import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireDatabase } from 'angularfire2/database';

import { UserInfo } from '../../../services/app-data-model/app-data-model';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUserComponent {




  public user: UserInfo;
  constructor(private route: ActivatedRoute, public router: Router, public af: AngularFireDatabase) {

    this.route.params.map(params => params['id']).subscribe((Id) => {
      if (Id != null) {
        this.af.object('/users/' + Id).subscribe(
          (response) => {
            this.user = response;
          }
        )
      }
    });
  }

  public getCreatedAtString(createdAt : string): string {
    return (new Date(Date.parse(this.user.createdAt))).toString();
  }
}
