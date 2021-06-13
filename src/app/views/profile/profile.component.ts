import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/services/news.service';
import { specialCharacterValidator } from '../auth/validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private toastr: ToastrService,
    private custom: specialCharacterValidator, private newsService: NewsService,
    public router: Router) { }
  loginForm: FormGroup;
  profileForm: FormGroup;
  loginSubmitted = false;
  profileSubmitted = false;

  ngOnInit(): void {
    this.initProfileForm();
    this.getUserData();
  }

  getUserData(): void {
    // this.newsService.currentUser.subscribe(
    //   (data) => {
    //     if (Object.keys(data).length === 0) {
    //       this.router.navigate(['/auth']);
    //     } else {
    //       console.log(data)
    //       this.profileForm.controls['username'].setValue(data.username);
    //       this.profileForm.controls['email'].setValue(data.email);
    //       this.profileForm.controls['password'].setValue(data.password);
    //     }

    //   }
    // )

    const data = JSON.parse(localStorage.getItem('currentUser'));
    if (!!data) {
      this.profileForm.controls.username.setValue(data.username);
      this.profileForm.controls.email.setValue(data.email);
      this.profileForm.controls.password.setValue(data.password);
    }
  }

  initProfileForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, this.custom.charValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(20), this.custom.charValidator]],
    });
    this.profileForm.controls.email.disable();

  }

  get profileGetter() { return this.profileForm.controls; }

  onSubmit(): void {
    this.profileSubmitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    const username = this.profileForm.controls.username.value;
    const email = this.profileForm.controls.email.value;
    const password = this.profileForm.controls.password.value;

    if (localStorage.getItem('userDetails') !== null) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const user = userDetails.find(element => element.email === email);
      const len = userDetails.length;
      if (typeof user !== 'undefined') {
        // this.toastr.error('Error', 'Already Existing email');
        for (let i = 0; i < len; i++) {
          if (userDetails[i].email === email) {
            userDetails[i].username = username;
            userDetails[i].password = password;
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
            localStorage.setItem('currentUser', JSON.stringify({
              username: userDetails[i].username,
              password: userDetails[i].password,
              savedItems: userDetails[i].savedItems,
              email: userDetails[i].email
            }));
            this.toastr.success('Success', 'Updated Successfully');
            this.getUserData();
            break;
          }
        }
      }
    }

  }

  deleteAccount(): void {
    const confirmAlert = confirm('Are you sure?');
    if (confirmAlert) {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      const len = userDetails.length;
      for (let i = 0; i < len; i++) {
        if (userDetails[i].email === this.profileForm.controls.email.value) {
          userDetails.splice(i, 1);
          localStorage.setItem('userDetails', JSON.stringify(userDetails));
          this.toastr.success('Success', 'Deleted Successfully');
          this.router.navigate(['/auth']);
          break;
        }
      }
    } else {

    }
  }
  resetSignup(): void {
    this.profileSubmitted = false;
    this.profileForm.reset();
  }
}
