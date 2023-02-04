import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private roles: string[] = [];
  userName?: string;
  isLoggedIn = false;
  showAreaForRoleAdmin = false;
  showAreaForRoleUser = false;

  eventBusSub?: Subscription;

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isTokenExpired()) {
      this.storageService.clean();
      window.location.reload();
    }

    this.isLoggedIn = this.storageService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userName = this.storageService.getLoggedUserName();
      this.roles = this.storageService.getLoggedUserRoles();

      //set flags for area authorization by roles
      this.showAreaForRoleAdmin = this.roles.includes('ROLE_ADMIN');
      this.showAreaForRoleUser = this.roles.includes('ROLE_USER');
    }
    /*
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
    */
  }

  logout(): void {
    this.storageService.clean();
    window.location.reload();
  }
}
