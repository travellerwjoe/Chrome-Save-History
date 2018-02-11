import { Component, OnInit } from '@angular/core';
import { Filter } from '../history.d'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  filter: Filter = {
    keyword: '',
    date: '',
  }

  constructor() { }

  ngOnInit() {
  }

  onclick(): void {
    console.log('test click')
  }
}
