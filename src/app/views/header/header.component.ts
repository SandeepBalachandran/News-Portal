import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from 'src/services/news.service';
import { specialCharacterValidator } from '../auth/validator';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    currentUser: any;

    constructor(private formBuilder: FormBuilder, private toastr: ToastrService,
                private custom: specialCharacterValidator, private newsService: NewsService,
                public router: Router) { }
    loginForm: FormGroup;
    profileForm: FormGroup;
    loginSubmitted = false;
    profileSubmitted = false;

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
}
