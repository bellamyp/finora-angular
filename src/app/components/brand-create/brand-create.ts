import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { BrandCreateDto } from '../../dto/brand-create.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './brand-create.html',
  styleUrl: './brand-create.scss',
})
export class BrandCreate implements OnInit {

  brandForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      url: ['']
    });
  }

  submit() {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched();
      return;
    }

    const payload: BrandCreateDto = this.brandForm.value;

    this.brandService.createBrand(payload).subscribe({
      next: () => {
        alert('Brand created successfully!');
        this.router.navigate(['/transaction-update']);
      },
      error: () => alert('Failed to create brand.')
    });
  }

  goToAddTransactions() {
    this.router.navigate(['/transaction-update']);
  }
}
