import { Component, inject, OnInit, signal } from '@angular/core';
import { CartItem, CartItemService } from '../../services/cart-item.service';
import { CommonModule } from '@angular/common';
import { Branch, BranchesService } from '../../services/branches.service';
import { DelevryMethodsService } from '../../services/delevry-methods.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaymentMethodsService } from '../../services/payment-methods.service';
import { AddressService } from '../../services/address.service';
import { Router } from '@angular/router';
import { AddAddressComponent } from "../shared/add-address/add-address.component";

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, ReactiveFormsModule, AddAddressComponent],
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
   private router = inject(Router);



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
  countries = signal<any[]>([]);
loadingCountries = signal(false);
states = signal<any[]>([]);
cities = signal<any[]>([]);
loadingStates = signal(false);
loadingCities = signal(false);
isPlacingOrder = signal(false);
cartId = signal<number | null>(null);
showAddressModal = signal(false);



  // ✅ Market Status & Agreement
  isMarketOpen = signal(true);
  agreePriceChange = signal(false);

addressForm = this.fb.group({
  fullName: [''],
  email: [''],
  phone: [''],
  street: [''],

  country: [null as number | null],
  state: [null as number | null],
  city: [null as number | null],

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
    this.checkMarketStatus();
    this.loadPaymentMethods();
  }

  // ✅ جديد: فحص حالة السوق
  checkMarketStatus() {
    // يمكن الحصول على حالة السوق من الـ service
    // للآن: نفترض أن السوق مفتوح في ساعات العمل
    const now = new Date();
    const hour = now.getHours();
    
    // السوق مفتوح من 11 AM إلى 11 PM
    if (hour >= 11 && hour < 23) {
      this.isMarketOpen.set(true);
    } else {
      this.isMarketOpen.set(false);
    }
    
    console.log('Market Status:', this.isMarketOpen() ? 'Open' : 'Closed');
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
  const address = this.selectedAddress();
  const cartId = this.cartService.cartId();
  const payment = this.selectedPaymentMethod();

  if (!this.selectedMethod()) return;
  if (this.selectedMethod() === 'pickup' && !this.selectedBranch()) return;
  if (this.selectedMethod() === 'delivery' && !address) return;
  if (!cartId) return;
  if (!payment) return;

  const orderPayload = {
    cartId: cartId,
    currency: 'EGP',
    totalAmount: this.getTotal(),
    lang: 'en',
    returnUrl: 'https://gold-era.eg/profile#orders',
    fulfillmentType:
      this.selectedMethod() === 'delivery' ? 'DELIVERY' : 'PICKUP',
    deliveryMethodId: this.selectedDeliveryMethod()?.id,
    userAddressId: address.id,
    paymentMethodId: payment.id
  };

  const paymentName = payment?.nameEn?.toLowerCase();

  // 🔥 Instapay
  if (paymentName === 'instapay') {
    this.createInstapayOrder(orderPayload);
    return;
  }

  // 🔥 Forsa (الحل المطلوب)
  if (paymentName === 'forsa') {
    this.createForsaOrder(orderPayload);
    return;
  }

  // باقي الحالات
  this.createNormalOrder(orderPayload);
}

createNormalOrder(payload: any) {
  this.isPlacingOrder.set(true);

  this.deliveryService.initOrder(payload).subscribe({
    next: (res: any) => {
      this.isPlacingOrder.set(false);

      console.log('✅ Normal Order:', res);

      const orderNumber = res?.orderNumber;

      if (orderNumber) {
       this.router.navigate(['/dashboard/orders', orderNumber]);
      } else {
        console.warn('⚠️ orderNumber not found');
      }
    },
    error: (err) => {
      console.error('❌ Error:', err);
      this.isPlacingOrder.set(false);
    }
  });
}
initForsaOrder(payload: any) {
  this.isPlacingOrder.set(true);

  this.deliveryService.initOrder(payload).subscribe({
    next: (res: any) => {
      console.log('INIT ORDER 👉', res);

      this.isPlacingOrder.set(false);

      if (res?.paymentUrl) {
        window.open(res.paymentUrl, '_blank'); // 👈 فتح صفحة خارجية
       
       this.router.navigate(['/dashboard/profile-orders'], {
  fragment: 'orders'
});
       
      } else {
        console.warn('No payment URL returned');
      }
    },
    error: (err) => {
      console.error('INIT ORDER ERROR 👉', err);
      this.isPlacingOrder.set(false);
    }
  });
}
createForsaOrder(payload: any) {
  this.isPlacingOrder.set(true);

  this.deliveryService.initOrder(payload).subscribe({
    next: (res: any) => {
      this.isPlacingOrder.set(false);

      const url = res?.paymentUrl;

      if (url) {
        // 🔥 فتح خارجي فقط
        window.open(url, '_blank');

        // optional redirect بعد الفتح
       this.router.navigate(['/dashboard/profile-orders']);
      } else {
        console.warn('⚠️ No paymentUrl for Forsa');
      }
    },
    error: (err) => {
      console.error('❌ Forsa Error:', err);
      this.isPlacingOrder.set(false);
    }
  });
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
selectAddress(address: any) {
  this.selectedAddress.set(address);
}
loadUserAddress() {
  const user = this.authService.getCurrentUser();

  if (!user?.id) {
    console.error('❌ User ID not found');
    return;
  }

  this.addressService.getUserAddressesByUser(user.id).subscribe({
    next: (res: any) => {
      this.addresses.set(res || []);

      // auto select default
      if (res?.length) {
        this.selectedAddress.set(
          res.find((a: any) => a.isDefault) || res[0]
        );
      }

      console.log('📍 Addresses loaded:', res);
    },
    error: (err) => {
      console.error('❌ Load addresses error', err);
    }
  });
}

createInstapayOrder(payload: any) {
  this.isPlacingOrder.set(true);

  this.deliveryService.initOrder(payload).subscribe({
    next: (res: any) => {
      this.isPlacingOrder.set(false);

      console.log('✅ Instapay Order:', res);

      // 🔥 أهم نقطة
      const orderNumber = res?.orderNumber;

      if (orderNumber) {
        this.router.navigate(['dashboard/orders', orderNumber]);
      } else {
        console.warn('⚠️ orderNumber not found');
      }
    },
    error: (err) => {
      console.error('❌ Error:', err);
      this.isPlacingOrder.set(false);
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

  // ✅ جديد: التحقق من إمكانية وضع الطلب
  isPlaceOrderEnabled(): boolean {
    const step = this.currentStep();
    
    // يجب أن نكون في Step 3
    if (step !== 3) return false;

    // إذا كان السوق مغلقاً، يجب الموافقة على تغيير السعر
    if (!this.isMarketOpen() && !this.agreePriceChange()) {
      return false;
    }

    return true;
  }

selectPayment(method: any) {
  this.selectedPaymentMethod.set(method);
  this.paymentMethod.set(method.id);

  this.onPaymentMethodChange(method.id);
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
    fullName: form.fullName || '',
    phone: form.phone || '',
    street: form.street || '',

    cityId: Number(form.city),
    stateId: Number(form.state),
    countryId: Number(form.country),

    postalCode: form.postalCode || '',
    isDefault: false,
    specialInstructions: form.instructions || ''
  };

  console.log('📦 Payload 👉', payload);

  this.authService.addUserAddress(payload).subscribe({
    next: (res: any) => {
      this.loadUserAddress();
      this.selectedAddress.set(res);
      this.showAddressForm.set(false);
      this.addressForm.reset();
    },
    error: (err) => {
      console.error('❌ Add Address Error 👉', err);
      console.log('FULL ERROR:', err.error);
    }
  });
}

onPaymentMethodChange(paymentId: number) {

  console.log('💳 Selected Payment:', paymentId);

  // مثال: كول API
  this.paymentService.getPaymentMethods().subscribe({
    next: (res) => {
      console.log('🔁 Payment API called again:', res);
    },
    error: (err) => {
      console.error('❌ Error:', err);
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
  loadCountries() {
  this.loadingCountries.set(true);

  this.addressService.getCountries().subscribe({
    next: (res: any) => {
      this.countries.set(res.items || res || []);
      this.loadingCountries.set(false);
      console.log('Countries loaded 👉', this.countries());
    },
    error: (err) => {
      console.error('Countries Error 👉', err);
      this.loadingCountries.set(false);
    }
  });
}
openAddressForm() {
  this.showAddressForm.set(true);

  // مهم: نجيب countries أول ما يفتح الفورم
  this.loadCountries();
}

onCountryChange(event: any) {
  const countryId = Number(event.target.value);

  if (!countryId) return;

  this.loadStates(countryId);

  // مهم جداً
  this.addressForm.patchValue({
    country: countryId
  });
}
loadStates(countryId: number) {
  this.loadingStates.set(true);

  this.deliveryService.getStatesByCountry(countryId).subscribe({
    next: (res: any) => {
      this.states.set(res.items || res);
      this.loadingStates.set(false);
    },
    error: (err) => {
      console.error(err);
      this.loadingStates.set(false);
    }
  });
}
onStateChange(event: any) {
  const stateId = Number(event.target.value);

  if (!stateId) return;

  this.loadCities(stateId);

  this.addressForm.patchValue({
    state: stateId
  });
}
loadCities(stateId: number) {
  this.loadingCities.set(true);

  this.deliveryService.getCitiesByState(stateId).subscribe({
    next: (res: any) => {
      this.cities.set(res.items || res);
      this.loadingCities.set(false);
    },
    error: (err) => {
      console.error(err);
      this.loadingCities.set(false);
    }
  });
}
onCityChange(event: any) {
  const cityId = Number(event.target.value);

  this.addressForm.patchValue({
    city: cityId
  });
}
}