import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { Taskmodal } from '../../Core/Service/taskmodal';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Core/Service/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header implements OnInit {
  @Input() onToggleSidebar: (() => void) | undefined;
  @Input() isSidebarOpen: boolean = true;
  @Output() searchQuery = new EventEmitter<string>();
  isDropdownOpen = false;
  searchTerm: string = '';
  username: string | null = null;
  userRole: string | null = null;

  constructor(private taskModalService: Taskmodal, private router: Router) {}
  ngOnInit(): void {

    // Subscribe to username and role observables from AuthService
    this.authService.username$.subscribe(username => {
      this.username = username;
    });

    this.authService.role$.subscribe(role => {
      debugger
      this.userRole = role;
    });

    
  }

  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
  

  openAddTaskModal() {
    this.taskModalService.openModal();
  }

  onSearchChange() {
    this.searchQuery.emit(this.searchTerm);
  }

   toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    this.isDropdownOpen = false;
  }
}

}
