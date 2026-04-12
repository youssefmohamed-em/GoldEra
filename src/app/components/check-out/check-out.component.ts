import { Component, inject, OnInit, signal } from '@angular/core';
import { CartItem, CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';
import { Branch, BranchesService } from '../../services/branches.service';
import { DelevryMethodsService } from '../../services/delevry-methods.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { AddressService } from '../../services/address.service';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss',
})
export class CheckOutComponent implements OnInit {
  private branchService = inject(BranchesService);
  private cartService = inject(CartItemService);
  private deliveryService = inject(DelevryMethodsService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentMethodsService);
  private addressService = inject(AddressService);

  //--------------- signals --------------------
  cart = signal<CartItem[]>([]);
  selectedMethod = signal<'delivery' | 'pickup' | null>(null);
  branches = signal<Branch[]>([]);
  showBranches = signal(false);
  selectedBranch = signal<Branch | null>(null);
  loadingBranches = signal(false);
  currentStep = signal<number>(1);
  paymentMethod = signal<string | null>(null);
  deliveryMethods = signal<any[]>([]);
  selectedDeliveryMethod = signal<any | null>(null);
  loadingDeliveryMethods = signal(false);
  showDeliveryAddressCard = signal(false);
  userAddress = signal<any>(null);
  addresses = signal<any[]>([]);
  selectedAddress = signal<any | null>(null);
  showAddressForm = signal(false);
  paymentMethods = signal<any[]>([]);
  selectedPaymentMethod = signal<any | null>(null);
  loadingPaymentMethods = signal(false);
  deliveryMethodsByZoneLoaded = signal(false); // ✅ تغيير المتغير

  addressForm = this.fb.group({
    fullName: [''],
    email: [''],
    phone: [''],
    street: [''],
    country: [''],
    state: [''],
    city: [''],
    postalCode: [''],
    instructions: ['']
  });

  ngOnInit() {
    const user = this.authService.getCurrentUser();

    if (user) {
      this.addressForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      });
    }
    this.cartService.loadCart();
    this.cart = this.cartService.cart;
    this.cartService.loadMarketStatus();
    this.loadPaymentMethods();
  }

  setMethod(method: 'delivery' | 'pickup') {
    this.selectedMethod.set(method);
    this.currentStep.set(1);

    this.selectedBranch.set(null);
    this.branches.set([]);
    this.selectedDeliveryMethod.set(null);
    this.userAddress.set(null);

    if (method === 'pickup') {
      this.loadBranches();
    }

    if (method === 'delivery') {
      this.loadUserAddress();
      this.loadDeliveryMethods();
    }
  }

  getTotal(): number {
    return this.cart().reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  }

  placeOrder() {
    if (!this.selectedMethod()) return;

    if (this.selectedMethod() === 'pickup' && !this.selectedBranch()) {
      alert('Please select a branch');
      return;
    }

    const order = {
      items: this.cart(),
      total: this.getTotal(),
      method: this.selectedMethod(),
      branch: this.selectedBranch(),
      address: this.selectedAddress(),
      paymentMethod: this.selectedPaymentMethod(),
      deliveryMethod: this.selectedDeliveryMethod()
    };

    console.log('ORDER 👉', order);
  }

  loadBranches() {
    this.loadingBranches.set(true);

    this.branchService.getBranches().subscribe({
      next: (res: any) => {
        this.branches.set(res.items || []);
        this.showBranches.set(true);
        this.loadingBranches.set(false);
      },
      error: (err) => {
        console.error('Branches Error 👉', err);
        this.loadingBranches.set(false);
      }
    });
  }

  nextStep() {
    if (!this.isNextEnabled()) return;

    const current = this.currentStep();

    // ✅ عند دخول step 2 (Payment) - نحمّل Delivery Methods حسب State Zone
    if (current === 1 && !this.deliveryMethodsByZoneLoaded()) {
      this.loadDeliveryMethodsByZone();
      this.deliveryMethodsByZoneLoaded.set(true);
    }

    this.currentStep.update(step => Math.min(step + 1, 3));
  }

  prevStep() {
    this.currentStep.update(step => step - 1);
  }

  goBack() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  loadUserAddress() {
    this.authService.getUserAddresses().subscribe({
      next: (res: any) => {
        this.addresses.set(res || []);
      },
      error: (err) => {
        console.error('Load addresses error', err);
      }
    });
  }

  isNextEnabled(): boolean {
    const step = this.currentStep();
    const method = this.selectedMethod();

    if (step === 1) {
      if (!method) return false;

      if (method === 'pickup') {
        return !!this.selectedBranch();
      }

      if (method === 'delivery') {
        return !!this.selectedAddress(); // ✅ تحقق من تحديد العنوان
      }
    }

    if (step === 2) {
      return !!this.selectedPaymentMethod(); // ✅ تحقق من دفع الدفع
    }

    if (step === 3) {
      if (method === 'delivery') {
        return !!this.selectedDeliveryMethod(); // ✅ تحقق من طريقة التوصيل
      }
      return true;
    }

    return false;
  }

  selectPayment(method: any) {
    this.selectedPaymentMethod.set(method);
    this.paymentMethod.set(method.id);
  }

  loadDeliveryMethods() {
    this.loadingDeliveryMethods.set(true);

    this.deliveryService.getDeliveryMethods().subscribe({
      next: (res: any) => {
        const methods = res.items || [];
        this.deliveryMethods.set(methods);

        if (methods.length > 0) {
          this.selectedDeliveryMethod.set(methods[0]);
        }

        this.loadingDeliveryMethods.set(false);
      },
      error: (err) => {
        console.error('Delivery Methods Error 👉', err);
        this.loadingDeliveryMethods.set(false);
      }
    });
  }

  saveAddress() {
    if (this.addressForm.invalid) return;

    const form = this.addressForm.value;

    const payload = {
      type: 'HOME',
      fullName: form.fullName,
      phone: form.phone,
      street: form.street,
      cityId: form.city,
      stateId: form.state,
      countryId: form.country,
      postalCode: form.postalCode,
      isDefault: false,
      specialInstructions: form.instructions
    };

    this.authService.addUserAddress(payload).subscribe({
      next: (res: any) => {
        this.loadUserAddress();
        this.selectedAddress.set(res);
        this.showAddressForm.set(false);
        this.addressForm.reset();
      },
      error: (err) => {
        console.error('Add Address Error 👉', err);
      }
    });
  }

  loadPaymentMethods() {
    this.loadingPaymentMethods.set(true);

    this.paymentService.getPaymentMethods().subscribe({
      next: (res: any) => {
        const methods = res.items || [];
        this.paymentMethods.set(methods);

        if (methods.length) {
          this.selectedPaymentMethod.set(methods[0]);
        }

        this.loadingPaymentMethods.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingPaymentMethods.set(false);
      }
    });
  }

  // ✅ تحميل Delivery Methods حسب State Zone
  loadDeliveryMethodsByZone() {
    this.loadingDeliveryMethods.set(true);

    // ✅ احصل على stateId من العنوان المختار
    const stateId = this.selectedAddress()?.stateId;

    if (!stateId) {
      console.warn('⚠️ No stateId found in selected address');
      this.loadingDeliveryMethods.set(false);
      return;
    }

    console.log(`📍 Loading delivery methods for state: ${stateId}`);

    this.deliveryService.getDeliveryMethodsByStateZone(stateId).subscribe({
      next: (res: any[]) => {
        // ✅ احفظ في deliveryMethods (مش paymentMethods!)
        this.deliveryMethods.set(res || []);

        // ✅ Select first delivery method
        if (res && res.length > 0) {
          this.selectedDeliveryMethod.set(res[0]);
          console.log('✅ Delivery methods loaded:', res);
        } else {
          console.warn('⚠️ No delivery methods available for this zone');
        }

        this.loadingDeliveryMethods.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading delivery methods by zone:', err);
        this.loadingDeliveryMethods.set(false);
      }
    });
  }
}