import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Core/Service/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  userRole : string | null = null;
  @Input() isOpen: boolean = true;
  @Output() closeSidebarEvent = new EventEmitter<void>();

  constructor(private authService: AuthService , private cdRef: ChangeDetectorRef) {}
  ngOnInit() {
    this.getrole();
  }

  getrole() {
    debugger
      this.authService.role$.subscribe(role => {
      this.userRole = role;
      this.cdRef.detectChanges();
    });
  }

  closeSidebar() {
    this.closeSidebarEvent.emit();
  }
}
