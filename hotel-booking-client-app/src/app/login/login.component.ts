import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    userName: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  userName?: string;

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.userName = this.storageService.getLoggedUserName();
      this.roles = this.storageService.getLoggedUserRoles();
    }
  }

  onSubmit(): void {
    const { userName, password } = this.form;

    this.authService.login(userName, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.userName = this.storageService.getLoggedUserName();

        this.reloadPage();
      },
      error: (err) => {
        //console.log('# ' + JSON.stringify(err));
        if (err.status == 403) this.errorMessage = 'Username is not registred.';
        else if (err.error != null) this.errorMessage = err.error.message;

        this.isLoginFailed = true;
      },
      complete: () => {
        //console.log('# complete #');
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
