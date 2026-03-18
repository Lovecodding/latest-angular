import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class UserDetailComponent implements OnInit {
  user: User | any = null;
  loading = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get user from navigation state (passed from parent)
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || window.history.state;
    console.log('navigation: ', navigation, window.history.state);
    
    if (state && state['user']) {
      this.user = state['user'];
      this.loading = false;
    } else {
      // No data available, navigate back to list
      this.loading = false;
      this.router.navigate(['/users/user-list']);
    }
  }

  goBack(): void {
    this.router.navigate(['/users/user-list']);
  }
}
