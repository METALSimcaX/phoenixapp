import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  ipsw = "";

  constructor() {
    this.ipsw = localStorage.getItem("ipsw")
   }


  ngOnInit(): void {
  }

  save(){
    if(this.ipsw != undefined && this.ipsw != ""){
      localStorage.setItem("ipsw", this.ipsw);
    }
    
  }

} 
