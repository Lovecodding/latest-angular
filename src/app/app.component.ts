import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'af-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}

@Component({
  selector: 'logout-confirm-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>
      <p>Are you sure you want to logout?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-raised-button color="warn" [mat-dialog-close]="true">Logout</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      padding: 20px 0;
    }
    mat-dialog-actions {
      padding: 10px 0;
      gap: 10px;
    }
  `],
  standalone: false
})
export class LogoutConfirmDialog {}
