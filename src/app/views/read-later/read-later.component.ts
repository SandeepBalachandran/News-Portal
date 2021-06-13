import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from 'src/services/news.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-read-later',
    templateUrl: './read-later.component.html',
    styleUrls: ['./read-later.component.scss']
})
export class ReadlaterComponent implements OnInit, OnDestroy {

    constructor(private newsService: NewsService, private toastr: ToastrService) { }
    articles: any[] = [];
    articleSubscription$: any;
    sectionSubscription$: any;
    sections: any[] = [];
    tempArticles: any[] = [];
    selectedSection: any = 'All';
    articleLength: any;
    page = 0;
    limit = 10;
    totalArticles: any;

    pagesArray: any[] = [];
    pages: number;

    ngOnInit(): void {
        this.loadData();
    }
    loadData(): void {
        this.loadArticles();
        this.loadSections();
    }

    onPaginationChange(event): void {
        this.page = event.page;
        this.loadArticles();
    }

    loadArticles(): void {
        const body = {
            page: this.page,
            limit: this.limit
        };
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const len = userDetails.length;
        for (let i = 0; i <= len; i++) {
            if (userDetails[i].email === currentUser.email) {
                this.totalArticles = userDetails[i].savedItems;
                this.articleLength = userDetails[i].savedItems.length;
                this.tempArticles = JSON.parse(JSON.stringify(this.totalArticles));
                this.articles = this.totalArticles.slice(this.page * this.limit, this.page * this.limit + this.limit);
                break;
            }
        }
    }

    loadSections(): void {
        const body = {
            page: 0,
            limit: 100
        };
        this.sectionSubscription$ = this.newsService.getSections(body).subscribe((result) => {
            const data = result;
            if (data.results.length !== 0) {
                this.sections = data.results;

            } else {

            }
        });
    }

    onSectionClick(item): void {
        this.selectedSection = item.display_name;
        this.articles = this.tempArticles;
        if (item.display_name !== 'All') {
            const len = this.articles.length;
            const newAr = [];
            for (let i = 0; i < len; i++) {
                if (this.articles[i].section === item.display_name) {
                    newAr.push(this.articles[i]);
                }
            }
            this.articles = newAr;
            this.articleLength = this.articles.length;
        }

    }

    goToArticle(article): void {
        window.open(article.url, '_blank');
    }

    getThumbnail(array): string {
        if (array) {
            return array.find(ele => ele.format === 'Standard Thumbnail').url;
        } else {
            return 'https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png';
        }
    }

    remove(item): void {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        const len = userDetails.length;
        loop1: for (let i = 0; i <= len; i++) {
            if (userDetails[i].email === currentUser.email) {
                const savedItemsLength = userDetails[i].savedItems.length;
                loop2: for (let j = 0; j < savedItemsLength; j++) {
                    if (userDetails[i].savedItems[j].created_date === item.created_date) {
                        userDetails[i].savedItems.splice(j, 1);
                        localStorage.setItem('userDetails', JSON.stringify(userDetails));
                        this.toastr.success('Success', 'Removed from Read later');
                        this.loadArticles();
                        break loop2;
                    }
                }
            }
            break loop1;
        }
    }

    ngOnDestroy(): void {
        // this.articleSubscription$.unsubscribe();
        // this.sectionSubscription$.unsubscribe();
    }
}
