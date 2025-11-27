import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationService } from '../../services/location.service';
import { LocationCreateDto } from '../../dto/location-create.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-location-create',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './location-create.html',
  styleUrl: './location-create.scss',
})
export class LocationCreate {

  locationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.locationForm = this.fb.group({
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  submit() {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const payload: LocationCreateDto = this.locationForm.value;

    this.locationService.createLocation(payload).subscribe({
      next: () => {
        alert('Location created successfully!');
        this.router.navigate(['/transaction-create']); // adjust the navigation as needed
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create location.');
      }
    });
  }
}
