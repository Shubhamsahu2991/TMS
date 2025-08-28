import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Project } from '../../interface/project.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../Core/Service/project-service';
import { UserDto } from '../../interface/user.model';
import { AuthService } from '../../Core/Service/auth-service';

@Component({
  selector: 'app-project-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-assign.html',
  styleUrl: './project-assign.css'
})
export class ProjectAssign implements OnInit {
  projectDropdownList: Project[] = [];
  modules: { value: number, label: string }[] = [];
  users: UserDto[] = [];

  selectedProjectId: number | null = null;
  selectedModuleId: number | null = null;
  selectedEmployeeId: number | null = null;
  selectedEmployees: UserDto[] = [];

  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProjects();
    this.loadUser();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data: Project[]) => {
        this.projectDropdownList = data;
        this.cdRef.detectChanges();
        console.log('Projects loaded:', this.projectDropdownList);
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }


  onProjectChange(projectId: number | null) {
    this.selectedModuleId = null; // reset module
    this.modules = [];
    if (projectId) {
      this.projectService.getModulesByProjectId(projectId).subscribe({
        next: (data) => {
          this.modules = data;
          this.cdRef.detectChanges();
        },
        error: (err) => console.error('Failed to load modules', err)
      });
    }
  }


  loadUser() {
    this.authService.getAllUsers().subscribe({
      next: (data: UserDto[]) => {
        this.users = data;
        this.cdRef.detectChanges();
        console.log('Users loaded:', this.users);
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }


  onEmployeeSelected(selectedId: number | null) {
    if (!selectedId) return;
    const found = this.users.find(user => user.localId === selectedId);
    if (found && !this.selectedEmployees.some(emp => emp.localId === found.localId)) {
      this.selectedEmployees.push(found);
    }
    // Reset selection after processing
    this.selectedEmployeeId = null;
  }


  removeEmployee(id: number) {
    this.selectedEmployees = this.selectedEmployees.filter(emp => emp.localId !== id);
  }

  trackById(index: number, item: UserDto) {
    return item.localId;
  }

  onSubmit() {
    if (!this.selectedProjectId ||!this.selectedModuleId || this.selectedEmployees.length === 0) {
      alert('Please select a project and at least one employee.');
      return;
    }

    const payload = {
      projectID: this.selectedProjectId,
      moduleID: this.selectedModuleId,
      userIDs: this.selectedEmployees.map(user => user.localId)
    };

    this.projectService.assignUsersToProject(payload).subscribe({
      next: () => {
        alert('Users assigned successfully!');
        this.selectedProjectId = null;
        this.selectedEmployeeId = null;

        this.loadProjects();
        this.loadUser();
        this.selectedEmployees = [];
        this.cdRef.detectChanges();

      },
      error: (err) => {
        console.error('Error assigning users:', err);
        alert('Assignment failed.');
      }
    });
  }

}

