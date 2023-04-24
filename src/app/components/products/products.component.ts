import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products : Product[] = [];
  showProductDetail = false;
  productChosen: Product = {
    id:'',
    title: "",
    images: [],
    price: 0,
    description: "",
    category: {
      id: '',
      name: ''
    }

  };

  constructor( private storeService: StoreService, private productsService: ProductsService){
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
     this.productsService.getAllProducts()
     .subscribe(data => {
      console.log(data);
      this.products = data 
     }) 
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.productsService.getProduct(id)
    .subscribe(data => {
      this.toggleProductDetail()
     this.productChosen = data;
    })
  }
}
