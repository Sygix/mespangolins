import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/shared/services/friends.service';
import { PangolinService } from 'src/app/shared/services/pangolin.service';

@Component({
  selector: 'app-pangolins-list',
  templateUrl: './pangolins-list.component.html',
  styleUrls: ['./pangolins-list.component.css']
})
export class PangolinsListComponent implements OnInit {

  pangolins: any[] = [];

  constructor(private pangolinService: PangolinService, private friendService: FriendsService, private router: Router) { }
  
  ngOnInit(): void {
    this.getPangolins();
  }

  getPangolins(): void{
    this.pangolinService.listPangolins().subscribe({
      next: (res) => {
        this.pangolins = res;
      }
    });
  }

  addFriend(id: string): void{
    this.friendService.addFriend(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.friendService.sendUpdate();
        }
      }
    });
  }

}
