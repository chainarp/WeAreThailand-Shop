import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Router } from '@angular/router';

import { SharingDataServiceProvider } from  '../../services/sharing-data-service/sharing-data.service';
import { UserInfo } from '../../services/app-data-model/app-data-model';
//const swal = require('sweetalert');
import swal from 'sweetalert2';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  siteVal: any;
  users: Array<UserInfo>;
  usersData: FirebaseListObservable<any>;

  constructor(public af: AngularFireDatabase, public router: Router, public sharingDataServiceProvider:SharingDataServiceProvider) {
    this.usersData = af.list('/users', {
      query: {
        orderByChild: 'email',
        equalTo: sharingDataServiceProvider.currentUser.email
      }
    });
    this.usersData.subscribe((res) => {
      this.users = res;
      //console.log("UsersComponent.this.users.length="+this.users.length);
    })
  }

  usersShow(key) {
    this.router.navigate(['/users/viewUser', key]);
  }

  usersEdit(key) {
    this.router.navigate(['/users/editUser', key]);
  }

  getUsersByName(ev: any) {
    console.log("getUsersByName(" + JSON.stringify(ev) + ") ");
    let val = ev;
    this.usersData = this.af.list('/users', {
      query: {
        orderByChild: 'name',
        startAt: val.charAt(0).toUpperCase() + val.slice(1),
        endAt: val.charAt(0).toUpperCase() + val.slice(1) + '\uf8ff'
      }
    });
    this.usersData.subscribe((data) => {
      this.users = data;
    });


  }

  getUsersByEmail(ev: any) {
    console.log("getUsersByEmail(" + JSON.stringify(ev) + ") ");
    let val = ev;
    this.usersData = this.af.list('/users', {
      query: {
        orderByChild: 'email',
        startAt: val.charAt(0).toUpperCase() + val.slice(1),
        endAt: val.charAt(0).toUpperCase() + val.slice(1) + '\uf8ff'
      }
    });
    this.usersData.subscribe((data) => {
      this.users = data;
    });
  }

  usersDelete(key: any) {
    /*
    swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      closeOnConfirm: false,
      closeOnCancel: false
    }, (isConfirm) => {
      if (isConfirm) {
        this.usersData.remove(key).then((res) => {
          swal('Deleted!', 'User Deleted Successfully!', 'success');
        })
      } else {
        swal('Cancelled', 'Your data is safe :)', 'error');
      }
    });
    */
  }

}