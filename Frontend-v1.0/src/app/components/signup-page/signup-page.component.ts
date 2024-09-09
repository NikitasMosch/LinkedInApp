import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';


@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent {
  title = 'Frontend-v1.0';
  email: string = '';
  password: string = '';
  passwordConf: string = '';
  name: string = '';
  surname: string = '';
  phone: string = '';
  role: string = 'ROLE_USER';  // Default to "User"
  
  msg: string = '';

  constructor(private router: Router, private userService: UserService) {} //for usage in this.router.navigate


  showPassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = 'text';  //so that it is visible
    setTimeout(() => passwordInput.type = 'password', 2000);  //set a timer for the time the password will show
  }
  showPasswordConf() {
    const passwordInput = document.getElementById('passwordConf') as HTMLInputElement;
    passwordInput.type = 'text';  //so that it is visible
    setTimeout(() => passwordInput.type = 'password', 2000);  //set a timer for the time the password will show
  }

  SignUp() {
    //Redirect to the sign-up page
    console.log("On sign up is called")
    if (this.email === '' || this.password === '' || this.name === '' || this.surname === '' || this.passwordConf === '' || this.phone === '' || this.role === '') {
      this.msg = 'Please enter all fields';

      setTimeout(() => this.msg = '', 3000);  //set a timer for the time the error will show
    } else if (this.password !== this.passwordConf) {
      this.msg = 'Passwords do not match';
      setTimeout(() => this.msg = '', 3000);  // Clear the message after 3 seconds
    } else {
      //logic here
      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
        roles: this.role,  // Use the selected role
        // Add other fields like surname, phone, etc., if they exist in backend
      };

      // Use UserService to send a signup request
      this.userService.signup(user).subscribe(
        (response: string) => {
          console.log('User added successfully', response);
          this.msg = 'Signup successful! Redirecting to login...';
          setTimeout(() => {
            this.msg = '';
            this.router.navigate(['../login-page']);  // Redirect to login page
          }, 2000);
        },
        (error) => {
          console.error('Error adding user', error);
          console.log('Status:', error.status);
          console.log('Message:', error.message);
          console.log('Error body:', error.error);
          
          this.msg = 'Signup failed! Please try again.';
          setTimeout(() => this.msg = '', 3000);  // Clear the message after 3 seconds
        }
      );

      //Clear the form fields
      this.email = '';
      this.password = '';
      this.name ='';
      this.surname = '';
      this.password = '';
      this.passwordConf = '';
      this.phone = '';
      this.role = 'ROLE_USER';  // Reset to default role

      // //For now it redirects to login page
      // console.log('Redirect to login-page');
      // this.router.navigate(['../login-page']);
    }

    console.log('Sign-up User');
  }
}