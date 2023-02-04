import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    userName: null,
    password: null,
    name: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { userName, password, name } = this.form;

    this.authService.register(userName, password, name).subscribe({
      next: (data) => {
        //-- add default roles to user

        // add role to user
        this.authService.addRoleToUser(data.userName, 'ROLE_USER').subscribe({
          next: (dataRole) => {
            // role added to user
          },
          error: (err) => {
            if (err.error != null) this.errorMessage = err.error.message;
          },
        });

        // add role to user
        this.authService.addRoleToUser(data.userName, 'ROLE_ADMIN').subscribe({
          next: (dataRole) => {
            // role added to user
          },
          error: (err) => {
            if (err.error != null) this.errorMessage = err.error.message;
          },
        });

        //-- --//

        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        //console.log('# ' + JSON.stringify(err));
        if (err.status == 400) this.errorMessage = 'Username alredy exists.';
        else if (err.error != null) this.errorMessage = err.error.message;

        this.isSignUpFailed = true;
      },
    });
  }
}
