import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Module, Project } from '../../interface/project.model';
import { ProjectService } from '../../Core/Service/project-service';
import { AuthService } from '../../Core/Service/auth-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { priorityDto, StatusDto, UserDto } from '../../interface/user.model';
import { TaskService } from '../../Core/Service/task-service';

@Component({
  selector: 'app-task',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task implements OnInit {
 
  //  Task model, open close
  @Output() close = new EventEmitter<void>();
  userID: string | null = null;
  closeModal() {
    this.close.emit();
  }

  taskForm!: FormGroup;
  selectedProjectId: number | null = null;
  selectedModuleId: number | null = null;
  selectedEmployeeId: number | null = null;
  projectDropdownList: Project[] = [];
  modules: { value: number, label: string }[] = [];
  StatusList: StatusDto[] = [];
  prioritiesList: priorityDto[] = [];
  users: UserDto[] = [];
  filteredUsers: UserDto[] = [];

  



  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadUser();
    this.loadprioritiesList();
    this.loadStatusList();
    this.initializeForm();
    this.authService.userID$.subscribe(userID => {
      this.userID = userID;
    });
    console.log('User ID:', this.userID);
    this.initializeFormListeners();
  }
   private initializeForm() {
    this.taskForm = this.fb.group({
      projectId: [null, Validators.required],
      moduleId: [null, Validators.required],
      AssignedTo: [null, Validators.required],
      AssignedDate: [null, Validators.required],
      DueDate: [null, Validators.required],
      statusId: [null, Validators.required],
      priorityId: [null, Validators.required],
      title: ['', Validators.required],
      description: [''],
    });
  }





  onsubmit() {
    debugger;
  if (this.taskForm.invalid) {
    this.taskForm.markAllAsTouched();
    return;
  }

  const dto = this.taskForm.value;
  dto.assignedBy = this.userID; // Optionally set logged-in user
  
  this.taskService.createTask(dto).subscribe({
    next: (res) => {
      alert('Task Created Successfully!');
      this.taskForm.reset();
      this.closeModal();
    },
    error: (err) => {
      console.error('Error creating task', err);
      alert('Failed to create task');
    }
  });
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

  loadprioritiesList() {
    this.taskService.priorities().subscribe({
      next: (data: priorityDto[]) => {
        this.prioritiesList = data;
        this.cdRef.detectChanges();
        console.log('prioritiesList loaded:', this.prioritiesList);
      },
      error: (err) => console.error('Failed to prioritiesList users', err)
    });
  }


  loadStatusList() {
    this.taskService.Status().subscribe({
      next: (data: StatusDto[]) => {
        this.StatusList = data;
        this.cdRef.detectChanges();
        console.log('StatusList loaded:', this.StatusList);
      },
      error: (err) => console.error('Failed to StatusList  ', err)
    });
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


 

  // ✅ Function to handle reactive form value changes & API calls
initializeFormListeners() {
  // Load modules if default projectId already selected
  const defaultProjectId = this.taskForm.get('projectId')?.value;
  if (defaultProjectId) {
    this.loadModules(defaultProjectId);
  }

  // Listen for project changes
  this.taskForm.get('projectId')?.valueChanges.subscribe((id: number) => {
    if (id) {
      this.loadModules(id);
    } else {
      this.modules = [];
      this.selectedModuleId = null;
      this.filteredUsers = [];
    }
  });

  // Listen for module changes & filter users automatically
  this.taskForm.get('moduleId')?.valueChanges.subscribe((moduleId: number) => {
    this.filterUsersByModule(moduleId);
  });
}

// ✅ Load modules API
loadModules(projectId: number) {
  if (!projectId || isNaN(projectId)) return;

  this.projectService.getModulesByProjectId(projectId).subscribe({
    next: (data) => {
      this.modules = data;
      this.cdRef.detectChanges();
    },
    error: (err) => console.error('Failed to load modules', err)
  });
}

// ✅ Filter users based on selected moduleId
filterUsersByModule(moduleId: number | null) {
  if (moduleId) {
    this.taskService.getUserIdsByModule(moduleId).subscribe({
      next: (userIds: number[]) => {
        this.filteredUsers = this.users.filter(u => userIds.includes(u.localId));
        this.cdRef.detectChanges();
        console.log('Filtered Users:', this.filteredUsers);
      },
      error: (err) => console.error('Failed to fetch user IDs by module', err)
    });
  } else {
    this.filteredUsers = [];
  }
}





}
