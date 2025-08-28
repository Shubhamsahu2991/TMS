 
import { Header } from "../header/header";
import { Footer } from "../footer/footer";
import { RouterModule, RouterOutlet } from '@angular/router';
import { Component, ViewChild, ViewContainerRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Taskmodal } from '../../Core/Service/taskmodal';
import { Task } from "../../Pages/task/task";
import { Sidebar } from "../sidebar/sidebar";
import { CommonModule } from "@angular/common";
 

@Component({
  selector: 'app-layout',
  imports: [Header, Footer, RouterOutlet, CommonModule, Sidebar , RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout implements OnInit {
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  
  // Sidebar state - closed by default on mobile
  isSidebarOpen: boolean = false;

  constructor(
    private modalService: Taskmodal,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only check screen size if we're in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      // Listen for window resize events
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  checkScreenSize() {
    if (isPlatformBrowser(this.platformId) && window.innerWidth >= 768) {
      // Desktop: sidebar open by default
      this.isSidebarOpen = true;
    } else {
      // Mobile: sidebar closed by default
      this.isSidebarOpen = false;
    }
  }

  // Toggle sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Close sidebar (for mobile)
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  ngAfterViewInit() {
    this.modalService.showModal$.subscribe(() => {
      this.modalContainer.clear();
      const componentRef = this.modalContainer.createComponent(Task);
      componentRef.instance.close.subscribe(() => {
        componentRef.destroy();
      });
    });
  }
}
