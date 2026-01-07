import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PaginationData {
  content: any[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() pagination: PaginationData | null = null;
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  goToPage(page: number | string): void {
    // Don't navigate if page is ellipsis or not a valid number
    if (page === '...' || typeof page !== 'number') {
      return;
    }
    
    if (page >= 0 && page < (this.pagination?.totalPages || 0) && page !== this.pagination?.pageNumber) {
      this.pageChange.emit(page);
    }
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    if (newSize !== this.pagination?.pageSize) {
      this.pageSizeChange.emit(newSize);
    }
  }

  getPageNumbers(): (number | string)[] {
    if (!this.pagination) return [];
    
    const currentPage = this.pagination.pageNumber;
    const totalPages = this.pagination.totalPages;
    const delta = 2; // Number of pages to show on each side
    
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l;

    for (let i = Math.max(0, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 0) {
      rangeWithDots.push(0, '...');
    } else {
      rangeWithDots.push(0);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages - 1);
    } else if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(totalPages - 1);
    } else if (rangeWithDots[rangeWithDots.length - 1] !== totalPages - 1) {
      rangeWithDots.push(totalPages - 1);
    }

    return rangeWithDots;
  }

  getStartItem(): number {
    if (!this.pagination) return 0;
    return this.pagination.pageNumber * this.pagination.pageSize + 1;
  }

  getEndItem(): number {
    if (!this.pagination) return 0;
    const end = (this.pagination.pageNumber + 1) * this.pagination.pageSize;
    return Math.min(end, this.pagination.totalElements);
  }
}
