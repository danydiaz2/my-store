import { Component } from '@angular/core';
import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { FilesService } from './services/files.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  imgParent = "";
  token = '';
  imgRta = '';

  constructor(private authService: AuthService, private userService: UsersService,
              private filesService: FilesService) {}

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

  downloadPdf() {
    this.filesService.getFile('my.pdf', 'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf', 'application/pdf')
    .subscribe()
  }

  onUpload(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file){
      this.filesService.uploadFile(file)
    .subscribe(rta => {
      this.imgRta = rta.location;
    })
    }
  }
}
