import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";
import { AngularFireAuth } from 'angularfire2/auth';
@Injectable()
export class LoginService {

  constructor(public af:AngularFireAuth) { }


   isAuthenticated() {
    var user = localStorage.getItem('uid') != null;
     //console.log("user"+ user); 
    if (user) {
      return true;
    } else {
      return false;
    }
  }



}

