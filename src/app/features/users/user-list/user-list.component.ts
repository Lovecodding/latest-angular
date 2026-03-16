import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false,
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchControl = new FormControl('');
  page = 1;
  pageSize = 5;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Restore state from query params
    this.route.queryParamMap.subscribe(params => {
      const search = params.get('search') || '';
      const page = +(params.get('page') || 1);
      this.searchControl.setValue(search, { emitEvent: false });
      this.page = page;
      this.applyFilter();
    });
    this.apiService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.applyFilter();
    });
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith('')
    ).subscribe(val => {
      this.page = 1;
      this.updateQueryParams();
      this.applyFilter();
    });
  }

  applyFilter(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.username.toLowerCase().includes(search)
    );
  }

  get paginatedUsers(): User[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  setPage(page: number): void {
    this.page = page;
    this.updateQueryParams();
  }

  updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchControl.value || '',
        page: this.page
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}
