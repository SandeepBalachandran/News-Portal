import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewsService } from 'src/services/news.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  articles: any[] = [];
  articleSubscription$: any;
  sectionSubscription$: any;
  sections: any[] = [];
  tempArticles: any[] = [];
  selectedSection: any = 'All';
  totalArticles: any;
  articleLength: any;
  page = 0;
  limit = 100;

  constructor(private newsService: NewsService, private toastr: ToastrService) { }

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
    this.articleSubscription$ = this.newsService.getArticles(body).subscribe((result) => {
      const data = result;
      if (data.results.length !== 0) {
        this.articles = data.results;
        this.articleLength = data.num_results;
        this.tempArticles = JSON.parse(JSON.stringify(this.articles));

      } else {
      }
    });
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

  readLater(item): void {
    console.log(item);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const len = userDetails.length;
    for (let i = 0; i <= len; i++) {
      if (userDetails[i].email === currentUser.email) {
        userDetails[i].savedItems.push(item);
        localStorage.setItem('userDetails', JSON.stringify(userDetails))
        this.toastr.success('Success', 'Added to Read later');
        return;
      }
    }
  }

  ngOnDestroy(): void {
    // this.articleSubscription$.unsubscribe();
    // this.sectionSubscription$.unsubscribe();
  }

}
