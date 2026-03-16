import { Component, computed, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'af-signal',
  standalone: true,
  imports: [
    MatButtonModule
  ],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss'
})
export class SignalComponent {
  firstName = signal('Viral')
  lastName = signal('Shah')
  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);

  constructor() {
    effect(() => {
      console.log('FirstName changed', this.firstName());
    });
    
    effect(() => {
      console.log('LastName changed', this.fullName());
    });
  }

  updateFirstName() {
    // this.firstName.set('Pankaj 1');
    this.firstName.update((name) => name + 1)
    // this.firstName.update(() => 'Pankaj 1')
  }


}
