import { Component, EventEmitter, Input, Output } from '@angular/core';
import { switchMap, zip } from 'rxjs';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {

  myShoppingCart: Product[] = [];
  total = 0;
  @Input() products : Product[] = [];
  // @Input() productId: string | null = null;
  @Input() 
  set productId(id : string | null) {
    if(id) {
      this.onShowDetail(id);
    }
  }
  @Output() loadMore = new EventEmitter();
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
  
  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor( private storeService: StoreService, private productsService: ProductsService){
    this.myShoppingCart = this.storeService.getShoppingCart();
  }
  


  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    this.statusDetail = 'loading';
    if (!this.showProductDetail) {
     this.showProductDetail = true
    }
    this.productsService.getProduct(id)
    .subscribe(data => {
     this.productChosen = data;
     this.statusDetail = 'success';
    }, errorMsg => {
      window.alert(errorMsg);
      this.statusDetail = 'error';
    })
  }

  readAndUpdate(id: string) {
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product) => this.productsService.update(product.id, {title: 'change'}))
    )
    .subscribe(data => {
      console.log(data);
    })
    zip( // zip ayuda a hacer dos cosas al mismo tiempo sin depender de otra peticion o respuesta
      this.productsService.getProduct(id),
      this.productsService.update(id, {title: 'nuevo'})
    )
    .subscribe(response => {
      const product = response[0];
      const update = response[1];
    })
  }

  createNewProduct() {
    const product: CreateProductDTO = {
      title: "Nuevo producto",
      description: "dfalksdflkadf",
      images: [''],
      price: 1000,
      categoryId: 2
    }
    this.productsService.create(product)
    .subscribe(data => {
      this.products.unshift(data);
    })
  }

  updateProduct() {
    const changes : UpdateProductDTO = {
      title: ' nuevo title'
    }
    const id = this.productChosen.id;
    this.productsService.update(id, changes)
    .subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products[productIndex] = data;
      this.productChosen = data;
    })
  }

  deleteProduct() {
    const id = this.productChosen.id;
    this.productsService.detele(id)
    .subscribe(() => {
      const productIndex = this.products.findIndex(item => item.id === this.productChosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    })
  }

  onLoadMore() {
    this.loadMore.emit();
  }

  // loadMore() {
  //   this.productsService.getProductsByPage(this.limit,this.offset)
  //   .subscribe(data => {
  //    console.log(data);
  //   this.products = this.products.concat(data);
  //    this.offset += this.limit 
  //   }) 
  // }

}
