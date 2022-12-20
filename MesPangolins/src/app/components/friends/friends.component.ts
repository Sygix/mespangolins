import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FriendsService } from 'src/app/shared/services/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit{

  @Input() friends!: Friends[];
  private friendSubscription: Subscription;

  constructor(private friendService: FriendsService) {
    this.friendSubscription = this.friendService.getUpdate().subscribe(() => {
      this.getFriends();
    });
  }

  ngOnInit(): void {
    this.getFriends();
  }
  
  getFriends(): void{
    this.friendService.getFriends().subscribe((res) => {
      this.friends = res;
    });
  }

  accept(id: string): void{
    this.friendService.acceptFriend(id).subscribe({
      next: (res) => {
        if(res.success) this.getFriends();
      }
    });
  }

  reject(id: string): void{
    this.friendService.rejectFriend(id).subscribe({
      next: (res) => {
        if(res.success) this.getFriends();
      }
    });
  }

  del(id: string): void{
    this.friendService.delFriend(id).subscribe({
      next: (res) => {
        if(res.success) this.getFriends();
      }
    });
  }

}

interface Friends {
  id: string,
  name: string,
  friendsStatus: number,
};