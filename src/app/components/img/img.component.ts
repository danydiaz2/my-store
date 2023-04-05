import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-img',
  templateUrl: './img.component.html',
  styleUrls: ['./img.component.css']
})
export class ImgComponent {

  @Input() img: string = "";
  @Output() loaded = new EventEmitter<string>() 
  imageDefault = "./assets/images/default.png"

  constructor() {}

  imgError(){
    this.img = this.imageDefault;
  }

  imgLoaded() {
    console.log('loaded');
    this.loaded.emit(this.img);
  }
}
