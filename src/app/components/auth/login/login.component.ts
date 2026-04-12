import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  RouterModule],
  templateUrl: 'login.component.html',
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  loading = signal(false);
  showPwd = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  // 👇 مثال roles (تعدله حسب مشروعك)
  private readonly ADMIN_ROLES = [
    'SUPER_ADMIN',
    'COMMUNITY_ADMIN',
    'FACILITY_MANAGER'
  ];

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMsg.set(null);

    const { username, password } = this.form.value as any;

    this.auth.login({ username, password }).subscribe({
      next: (res) => {

        // 🔑 حفظ التوكن
        this.auth.saveToken(res.access_token);

        // 👇 لو عندك API للـ user
        this.auth.saveCurrentUser?.(res.user);

        this.loading.set(false);
        console.log('LOGIN SUCCESS'); // 👈 مهمd

        this.toastr.success('Welcome back');

        const returnUrl =
          this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard/home';

        this.router.navigateByUrl(returnUrl);
        console.log('token:',res.access_token);
        
        
      },
      
      error: (err) => {
        this.loading.set(false);

        const msg =
  err?.error?.message ||
  err?.error?.errors?.[0] ||
  'Login failed';

        this.errorMsg.set(msg);
        this.toastr.error(msg);
      }
    });
  }

  togglePassword() {
    this.showPwd.set(!this.showPwd());
  }

  /**
   * Check role (لو هتستخدمها)
   */
  isAdmin(role: string): boolean {
    return this.ADMIN_ROLES.includes(role?.toUpperCase());
  }
}