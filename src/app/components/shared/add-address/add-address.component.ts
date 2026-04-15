import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AddressService } from '../../../services/address.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-address',
  imports: [],
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.scss',
})
export class AddAddressComponent {
 private fb = inject(FormBuilder);
  private addressService = inject(AddressService);
  private authService = inject(AuthService);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<any>();
  loading = signal(false);

  form = this.fb.group({
    fullName: [''],
    phone: [''],
    street: [''],
    postalCode: [''],
    instructions: ['']
  });

  save() {
    if (this.form.invalid) return;

    const user = this.authService.getCurrentUser();

    const payload = {
      type: 'HOME',
      userId: user.id,
      ...this.form.value,
      isDefault: false
    };

    this.loading.set(true);

    this.addressService.addAddress(payload).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.saved.emit(res);   // 👈 يرجع للـ parent
        this.close.emit();
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}
