import { Component, OnInit, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { User } from '../../../core/models/user.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule
  ]
})
export class UserListComponent implements OnInit {
  // Signals for reactive state
  users = signal<User[]>([]);
  searchTerm = signal<string>('');
  selectedFilters = signal<string[]>([]);
  currentPage = signal<number>(1);
  pageSize = 5;

  // Filter options for multi-select
  filterOptions = [
    { value: 'hasCompany', label: 'Has Company' },
    { value: 'hasCity', label: 'Has City' },
    { value: 'hasPhone', label: 'Has Phone' },
    { value: 'hasWebsite', label: 'Has Website' }
  ];

  // Form controls
  searchControl = new FormControl('');
  filterControl = new FormControl<string[]>([]);

  // Computed signal for filtered users
  filteredUsers = computed(() => {
    const users = this.users();
    const search = this.searchTerm().toLowerCase();
    const filters = this.selectedFilters();

    return users.filter(user => {
      // Apply search filter
      const matchesSearch = !search || 
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.username.toLowerCase().includes(search);
      
      // Apply multi-select filters (all selected filters must match)
      let matchesFilters = true;
      if (filters.length > 0) {
        matchesFilters = filters.every(filter => {
          switch(filter) {
            case 'hasCompany':
              return !!(user.company && user.company.name);
            case 'hasCity':
              return !!(user.address && user.address.city);
            case 'hasPhone':
              return !!user.phone;
            case 'hasWebsite':
              return !!user.website;
            default:
              return true;
          }
        });
      }
      
      return matchesSearch && matchesFilters;
    });
  });

  // Computed signal for paginated users
  paginatedUsers = computed(() => {
    const filtered = this.filteredUsers();
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    return filtered.slice(start, start + this.pageSize);
  });

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load users first
    this.apiService.getUsers().subscribe((users: User[]) => {
      this.users.set(users);
      
      // Restore state from sessionStorage if returning from detail page
      const savedState = sessionStorage.getItem('userListState');
      if (savedState) {
        const state = JSON.parse(savedState);
        this.searchControl.setValue(state.search || '', { emitEvent: false });
        this.filterControl.setValue(state.filters || [], { emitEvent: false });
        this.searchTerm.set(state.search || '');
        this.selectedFilters.set(state.filters || []);
        this.currentPage.set(state.page || 1);
        sessionStorage.removeItem('userListState'); // Clear after restoring
      }
    });

    // Listen to search changes
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      this.searchTerm.set(val || '');
      this.currentPage.set(1);
    });

    // Listen to filter changes
    this.filterControl.valueChanges.subscribe(val => {
      this.selectedFilters.set(val || []);
      this.currentPage.set(1);
    });
  }

  setPage(page: number): void {
    this.currentPage.set(page);
  }

  viewUserDetail(user: User): void {
    // Save current filter state to sessionStorage
    const state = {
      search: this.searchTerm(),
      filters: this.selectedFilters(),
      page: this.currentPage()
    };
    sessionStorage.setItem('userListState', JSON.stringify(state));
    
    // Navigate with user data in state
    this.router.navigate(['/users/user-detail', user.id], {
      state: { user }
    });
  }
}
