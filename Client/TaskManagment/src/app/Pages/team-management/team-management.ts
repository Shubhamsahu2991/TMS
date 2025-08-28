import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { TeamService } from '../../Core/Service/team-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../../interface/user.model';
import { AuthService } from '../../Core/Service/auth-service';
import { DepartmentHierarchyDto } from '../../interface/team.model';
import { DepartmentHierarchy } from '../../interface/department-hierarchy.model';

@Component({
  selector: 'app-team-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './team-management.html',
  styleUrl: './team-management.css'
})
export class TeamManagement implements OnInit {

  departmentForm!: FormGroup;
  showAssignForm: boolean = false;
  showForm: boolean = false;
  Dashboard: boolean = true; // Assuming this is used to toggle the dashboard view
  successMessage: string = '';
  errorMessage: string = '';
  departments: any[] = []; // Initialize as an empty array
   hierarchy: any[] = [];

  users: UserDto[] = [];
  Segments: UserDto[] = [];

  selectedusers: UserDto[] = [];

  DepartmentId: number | null = null;
  ManagerUserId: number | null = null;
  selectedusersId: number | null = null;




  constructor(private fb: FormBuilder,
    private teamservice: TeamService,
    private Authservice: AuthService,
    private cdRef: ChangeDetectorRef) {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required],
      SegmentHeadId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadUsers();
     this.teamservice.getDepartmentHierarchy().subscribe(data => {
      this.hierarchy = this.transformData(data);
    });
  }

  toggleForm() {
    if (this.showAssignForm) {
      this.showAssignForm = false; // Hide module form if it's open
      this.Dashboard = false; // Hide dashboard if module form is open
    }
    this.Dashboard = !this.Dashboard;
    this.showForm = !this.showForm;
  }
  toggleModuleForm() {
    if (this.showForm) {
      this.showForm = false; // Hide project form if it's open
      this.Dashboard = false;
    }
    this.showAssignForm = !this.showAssignForm;
  }

  onSubmit() {
    if (this.departmentForm.valid) {
      const deptData = this.departmentForm.value; // { name: "HR" , Segments: "SegmentHead" }

      this.teamservice.insertDepartment(deptData).subscribe({
        next: (res: { message: string; }) => {
          console.log('✅ API Success:', res);
          this.successMessage = res.message;
          this.errorMessage = '';
          this.departmentForm.reset();
          this.loadDepartments(); // Reload departments after successful submission
        },
        error: (err: { error: { message: string; }; }) => {
          console.error('❌ API Error:', err);
          this.errorMessage = err.error?.message || 'Error creating department';
        }
      });
    }
  }


  loadDepartments() {
    this.teamservice.getDepartments().subscribe({
      next: (res) => {
        this.departments = res;
        console.log('Departments loaded:', this.departments);

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching departments:', err);
      }
    });
  }

  loadUsers() {
    this.Authservice.getAllUsers().subscribe({
      next: (data: UserDto[]) => {
        debugger
        this.users = data;

        this.Segments = data.filter(user => user.role == 'SegmentHead');

        this.cdRef.detectChanges();
        console.log('Users loaded:', this.users);
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }


  onEmployeeSelected(userId: number | null): void {
    if (!userId || userId === this.ManagerUserId) return;
    const selectedUser = this.users.find(u => u.localId === userId);
    if (selectedUser && !this.selectedusers.some(u => u.localId === userId)) {
      this.selectedusers.push(selectedUser);
    }
    this.selectedusersId = null; // Reset dropdown after selection
  }
  trackById(index: number, item: UserDto) {
    return item.localId;
  }

  removeEmployee(id: number) {
    this.selectedusers = this.selectedusers.filter(emp => emp.localId !== id);
  }

  onParentChanged(newParentId: number | null): void {
    this.ManagerUserId = newParentId;
    if (this.selectedusersId === newParentId) {
      this.selectedusersId = null;
    }
    this.selectedusers = this.selectedusers.filter(emp => emp.localId !== newParentId);
  }
  get filteredUsers() {
    return this.users.filter(user => user.localId !== this.ManagerUserId);
  }

  onSubmitDepartmentHierarchy() {
    const dto: DepartmentHierarchyDto = {
      DepartmentId: this.DepartmentId,
      ManagerUserId: this.ManagerUserId,
      UserIds: this.selectedusers.map(emp => emp.localId)
    };

    this.teamservice.assignRoles(dto).subscribe({
      next: (res) => {
        alert(res.message);
        this.DepartmentId = null;
        this.ManagerUserId = null;
        this.selectedusersId = 0;
        this.selectedusers = [] = [];

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert("Error while creating hierarchy");
      }
    });
  }

  transformData(data: DepartmentHierarchy[]): any[] {
    const departments: any = {};

    data.forEach(item => {
      // Department level
      if (!departments[item.departmentId]) {
        departments[item.departmentId] = {
          departmentId: item.departmentId,
          departmentName: item.departmentName,
          segmentHead: {
            id: item.segmentHeadLocalId,
            name: item.segmentHeadName,
            role: item.segmentHeadRole,
            managers: {}
          }
        };
      }

      const segmentHead = departments[item.departmentId].segmentHead;

      // Manager level
      if (!segmentHead.managers[item.managerLocalId]) {
        segmentHead.managers[item.managerLocalId] = {
          id: item.managerLocalId,
          name: item.managerName,
          role: item.managerRole,
          users: []
        };
      }

      const manager = segmentHead.managers[item.managerLocalId];

      // Users under manager
      manager.users.push({
        id: item.userLocalId,
        name: item.userName,
        role: item.userRole
      });
    });

    // Convert object → array for Angular ngFor
    return Object.values(departments).map((dept: any) => {
      dept.segmentHead.managers = Object.values(dept.segmentHead.managers);
      return dept;
    });
  }
}
