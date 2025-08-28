import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { CreateModuleDto, CreateProjectDto, Module, Project } from '../../interface/project.model';
import { ProjectService } from '../../Core/Service/project-service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css'
})
export class Projects implements OnInit {
  projects: Project[] = [];
  module: Module[]= [];
  showForm: boolean = false;
  showModuleForm: boolean = false;
  projectDropdownList: Project[] = [];

  TotalProjects: number = 0;
  ActiveProject:number = 0;
  Deactiveproject:number = 0;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  newProject: CreateProjectDto = {
    projectName: '',
    isActive: 'Y',
    description: ''
  };
  newModule: CreateModuleDto = {
    moduleName: '',
    projectId: 0,
    description: ''
    
  };



  toggleForm() {
    if (this.showModuleForm) {
      this.showModuleForm = false; // Hide module form if it's open
    }
    this.showForm = !this.showForm;
  }
   toggleModuleForm() {
    if (this.showForm) {
      this.showForm = false; // Hide project form if it's open
    }
    this.showModuleForm = !this.showModuleForm;
  }

  onSubmit() {
    if (!this.newProject.projectName || !this.newProject.isActive) {
      alert("Please fill required fields");
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: (res) => {
        console.log('Project created:', res);
        this.newProject = { projectName: '', isActive: 'Y', description: '' };
        this.loadProjects();
        this.showForm = false;
         this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error creating project:', err);
        alert("Error creating project");
      }
    });
  }



  onModuleSubmit() {
    if (!this.newModule.moduleName || !this.newModule.projectId) {
      alert("Please fill required fields");
      return;
    }

    this.projectService.createModule(this.newModule).subscribe({
      next: (res) => {
        console.log('Module created:', res);
        this.newModule = { moduleName: '', projectId: 0, description: '' };
        this.loadProjects();
        this.showModuleForm = false;
         this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error creating module:', err);
        alert("Error creating module");
      }
    });
  }


  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data: Project[]) => {
        this.projectDropdownList = data;
        console.log('Projects loaded:', this.projectDropdownList);
        this.projects = data;
        this.TotalProjects = this.projects.length;
        this.ActiveProject = this.projects.filter(p => p.isActive == 'Y').length;
        this.Deactiveproject = this.projects.filter(p => p.isActive == 'N').length;


        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }
}

