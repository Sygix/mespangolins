import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pangolin, Role } from 'src/app/shared/Pangolin';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PangolinService } from 'src/app/shared/services/pangolin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  @Input() currentUser!: Pangolin;
  roles = Object.values(Role);

  constructor(
    private pangolinService: PangolinService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void{
    this.pangolinService.getMyPangolinProfile()
      .subscribe((res) => {
        this.currentUser = res;
      });
  }

  saveProfile(): void{
    this.pangolinService.updateProfile(this.currentUser)
      .subscribe();
  }

  delProfile(): void{
    this.pangolinService.deleteProfile()
      .subscribe((res) => {
        this.authService.doLogout();
        this.router.navigate(['login']);
      });
  }
}
