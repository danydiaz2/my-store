import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  profile: User | null = null;
  categories: Category[] = [];

  constructor(private storeService: StoreService, private authService: AuthService,
              private categoriesService: CategoriesService, private productsService: ProductsService) {}

  ngOnInit(): void {
      this.storeService.myCart$.subscribe(products => {
        this.counter = products.length;
      });
      this.getAllCategories()
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  login() {
    this.authService.loginAndGet('dany@gmail.com', '1212')
    .subscribe( user => {
      //Mala practica callback hell, ya lo hace el método loginAndGet con switchmap
      // this.token = rta.access_token;
      // this.getProfile();
      this.profile = user;
    })
  }

  // getProfile() {
  //   this.authService.profile(this.token)
  //   .subscribe(user => {
  //     this.profile = user;
  //   })
  // }

  getAllCategories() {
    this.categoriesService.getAll()
    .subscribe( data => {
      this.categories = data;
    })
  }

}
