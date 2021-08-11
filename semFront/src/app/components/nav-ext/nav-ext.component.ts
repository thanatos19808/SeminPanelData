import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav-ext',
  templateUrl: './nav-ext.component.html',
  styleUrls: ['./nav-ext.component.css']
})
export class NavExtComponent implements OnInit {

  constructor(
    private router: Router
    ) { }

  ngOnInit() {
  }

  onLogin(){   
    this.router.navigate(['/login']);
  }

  myFunction() {
    var element = document.getElementById("body");
    element.classList.toggle("sidebar-is-reduced");
    element.classList.toggle("sidebar-is-expanded");
    var element2 = document.getElementById("hamburger");
    element2.classList.toggle("is-opened");
 }

}
