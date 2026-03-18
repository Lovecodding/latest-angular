import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule
  ]
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
    // Load users first
    this.apiService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      
      // Restore state from sessionStorage if returning from detail page
      const savedState = sessionStorage.getItem('userListState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.searchControl.setValue(state.search || '', { emitEvent: false });
        this.page = state.page || 1;
        sessionStorage.removeItem('userListState'); // Clear after restoring
      }
      this.applyFilter();
    });

    // Listen to search changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      this.page = 1;
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
  }

  viewUserDetail(user: User): void {
    // Save current filter state to sessionStorage
    const state = {
      search: this.searchControl.value || '',
      page: this.page
    };
    sessionStorage.setItem('userListState', JSON.stringify(state));
    
    // Navigate with user data in state
    this.router.navigate(['/users/user-detail', user.id], {
      state: { user }
    });
  }
}
