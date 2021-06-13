import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NewsService } from 'src/services/news.service';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
    @Input() boundaryLinks = true;
    @Input() directionLinks = true;

    @Input() firstText = 'First';
    @Input() previousText = '« Previous';
    @Input() nextText = 'Next »';
    @Input() lastText = 'Last';
    @Input() totalItems = 50;
    @Input() itemsPerPage = 10;
    @Input() page = 0;
    @Output() pageChanged = new EventEmitter<any>();
    pagesArray: any[] = [];
    pages: number;



    constructor(private newsService: NewsService) { }

    ngOnInit(): void {
    }
    ngOnChanges(): void {
        this.calculatePages();
    }
    calculatePages(): void {
        this.pagesArray = [];
        this.pages = this.totalItems / this.itemsPerPage;
        for (let i = 0; i < this.pages; i++) {
            this.pagesArray.push(i + 1);
        }
    }
    selectPage(page): void {
        console.log(page);
        this.pageChanged.emit({
            page: page - 1,
            itemsPerPage: this.itemsPerPage,
        });
        this.page = page;
    }
}
