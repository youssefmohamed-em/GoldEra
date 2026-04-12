  import { Component, inject, signal } from '@angular/core';
  import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
  import { Router, RouterModule, RouterOutlet } from '@angular/router';
  import { AuthService } from '../../../services/auth.service';
  import { ToastrService } from 'ngx-toastr';
  @Component({
    selector: 'app-register',
    imports: [ ReactiveFormsModule, RouterModule, ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
  })
  export class RegisterComponent {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private toastr = inject(ToastrService);
    private router = inject(Router);


    loading = signal(false);
    showPwd = signal(false);
    errorMsg = signal<string | null>(null);

    registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
      phone: [''],
      dateOfBirth: [''],
      nationality: ['']
    })
 onSubmit() {
  if (this.registerForm.invalid) {
    this.toastr.error('Please fill in all required fields correctly.');
    this.registerForm.markAllAsTouched();
    return;
  };

  this.loading.set(true);

  this.auth.register(this.registerForm.value).subscribe({
    next: (res) => {
      this.loading.set(false);

      console.log('Registered:', res);
      this.toastr.success('Registration successful! Please log in.');
      this.registerForm.reset();
      this.router.navigate(['/login']);
    },

    error: (err) => {
      this.loading.set(false);

      console.error('Registration error:', err);

      // 👇 1. لو فيه message (زي حالة email already exists)
      if (err.error?.message) {
        this.toastr.error(err.error.message);
        return;
      }

      // 👇 2. لو فيه validation errors (object)
      if (err.error?.errors) {
        Object.values(err.error.errors).forEach((msg: any) => {
          this.toastr.error(msg);
        });
        return;
      }

      // 👇 3. fallback
      this.toastr.error('Registration failed. Please try again.');
    }
  });
}
    togglePassword() {
      this.showPwd.set(!this.showPwd());
    }
  }
