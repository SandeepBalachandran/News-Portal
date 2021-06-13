import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/services/news.service';
import { specialCharacterValidator } from './validator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private custom: specialCharacterValidator,
    public router: Router, private newsService: NewsService) { }
  loginForm: FormGroup;
  signupform: FormGroup;
  loginSubmitted = false;
  signupSubmitted = false;

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegForm();
  }

  initLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(20), this.custom.charValidator]],
    });
  }

  initRegForm(): void {
    this.signupform = this.formBuilder.group({
      username: ['1', [Validators.required, this.custom.charValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(20), this.custom.charValidator]],
    });
  }

  get loginGetter(): any { return this.loginForm.controls; }
  get signUpGetter(): any { return this.signupform.controls; }

  onLogin(): void {
    this.newsService.changeUserData({});
    console.log(this.loginForm);
    this.loginSubmitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    if (localStorage.getItem('userDetails') !== null) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if (!!userDetails) {
        const emailExistCheck = userDetails.find(element => element.email === email);
        if (typeof emailExistCheck !== 'undefined') {
          const user = userDetails.find(element => element.email === email && element.password === password);
          if (typeof user !== 'undefined') {
            this.toastr.success('Success', 'Logged In');
            const body = {
              username: user.username,
              email: user.email,
              password: user.password
            };
            this.newsService.changeUserData(body);
            window.localStorage.setItem('currentUser', JSON.stringify(body));
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Error', 'Wrong credentials');
          }
        } else {
          this.toastr.error('No user found. Please Sign Up', 'Error');
        }

      }
    } else {
      this.toastr.error('Please sign Up first', 'Error');
    }



  }
  onSignUp(): void {
    this.signupSubmitted = true;

    // stop here if form is invalid
    if (this.signupform.invalid) {
      return;
    }

    const username = this.signupform.controls.username.value;
    const email = this.signupform.controls.email.value;
    const password = this.signupform.controls.password.value;

    if (localStorage.getItem('userDetails') !== null) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const user = userDetails.find(element => element.email === email);
      if (typeof user !== 'undefined') {
        this.toastr.error('Error', 'Already Existing email');
      } else {
        this.pushDataToStorage(userDetails, username, email, password);
        this.toastr.success('Saved succesfully', 'Done');
      }
    } else {
      this.pushDataToStorage([], username, email, password);
      this.toastr.success('Saved succesfully', 'Done');
    }

  }
  pushDataToStorage(fullData, username, email, password): void {
    fullData.push({ username, email, password, savedItems: [] });
    localStorage.setItem('userDetails', JSON.stringify(fullData));
  }

  resetSignup(): void {
    this.signupSubmitted = false;
    this.signupform.reset();
  }
  resetLogin(): void {
    this.loginSubmitted = false;
    this.loginForm.reset();
  }

}
