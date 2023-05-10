import { Component } from '@angular/core';
import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  imgParent = "";
  token = '';

  constructor(private authService: AuthService, private userService: UsersService) {}

  onLoaded( img : string) {
    console.log(img);
  }

  createUser() {
    this.userService.create({
      name: 'Daniel',
      email: 'dany@gmail.com',
      password: '1212'
    })
    .subscribe( rta => {
      console.log(rta);
    })
  }
}
