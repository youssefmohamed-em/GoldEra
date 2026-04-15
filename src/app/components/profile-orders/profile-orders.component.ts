import { Component, inject, signal, OnInit } from '@angular/core';
import { ProfileUserService, UserAddress, UserProfile, UserProfileOverview } from '../../services/profile-user.service';
import { DelevryMethodsService } from '../../services/delevry-methods.service';
import { CartItemService } from '../../services/cart-item.service';
import { Order, OrderHistoryService, OrdersResponse } from '../../services/order-history.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AddressService } from '../../services/address.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile-orders',
  imports :[DatePipe,CommonModule, ReactiveFormsModule,FormsModule ],
  templateUrl: './profile-orders.component.html',
  styleUrl: './profile-orders.component.scss',
})
export class ProfileOrdersComponent implements OnInit {

  private addressService = inject(ProfileUserService);
  private deliveryService = inject(DelevryMethodsService);
 private cartService = inject(CartItemService);
 private addressservice = inject(AddressService);

 private orderService = inject(OrderHistoryService);
 private authService = inject(AuthService);
private userId = this.authService.getCurrentUser()?.id;
  // ================== STATE ==================
  addresses = signal<UserAddress[]>([]);
  countries = signal<any[]>([]);
  states = signal<any[]>([]);
  cities = signal<any[]>([]);
  deliveryMethods = signal<any[]>([]);
  marketStatus = signal<{ key: string; value: string } | null>(null);
  userProfile = signal<UserProfile | null>(null);
  editingAddress = signal<UserAddress | null>(null);
isEditMode = signal(false);
selectedOrderDetails = signal<any>(null);
orderDetailsLoading = signal(false);
editForm = signal<any>({
  fullName: '',
  street: '',
  phone: '',
  postalCode: '',
  specialInstructions: '',
  countryId: null,
  stateId: null,
  cityId: null,
});
confirmDeleteId = signal<number | null>(null);
selectedOrder = signal<Order | null>(null);
showOrderDetails = signal(false);

  selectedAddress = signal<UserAddress | null>(null);
  selectedCountry = signal<number | null>(null);
  selectedState = signal<number | null>(null);
  selectedCity = signal<number | null>(null);
  selectedDelivery = signal<number | null>(null);
  
userOverview = signal<UserProfileOverview | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
selectedTab = signal<'overview' | 'orders' | 'personal' | 'addresses' | 'security'>('overview');
  cartId = this.cartService.cartId;
  orders = signal<Order[]>([]);
ordersLoading = signal(false);
ordersError = signal<string | null>(null);
showAddressModal = signal(false);
newAddress = signal({
  fullName: '',
  street: '',
  phone: ''
});
openOrderId = signal<number | null>(null);

ordersPage = signal(0);
ordersTotal = signal(0);
ordersSize = signal(10);

  // ================== INIT ==================
  ngOnInit(): void {
    this.loadInitialData();
    this.cartService.loadCart();
  }

  loadInitialData() {
    this.loadAddresses();
    this.loadCountries();
    this.loadMarketStatus();
    this.loadUserOverview();
     this.loadUserProfile();
    this.loadOrders();
  }

  // ================== ADDRESSES ==================
  loadAddresses() {
    this.loading.set(true);

    this.addressService.getUserAddresses(383).subscribe({
      next: (res) => {
        this.addresses.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load addresses');
        this.loading.set(false);
      }
    });
  }

  selectAddress(address: UserAddress) {
    this.selectedAddress.set(address);
  }

  // ================== COUNTRIES ==================
  loadCountries() {
    this.deliveryService.getCountries().subscribe(res => {
      this.countries.set(res);
    });
  }

  onCountryChange(countryId: any) {
    const id = Number(countryId);
    this.selectedCountry.set(id);

    this.deliveryService.getStatesByCountry(id).subscribe(res => {
      this.states.set(res.content);
    });
  }
toggleOrderMenu(orderId: number) {
  this.openOrderId.set(
    this.openOrderId() === orderId ? null : orderId
  );
}
closeDropdown() {
  this.openOrderId.set(null);
}

  // ================== STATES ==================
  onStateChange(stateId: any) {
    const id = Number(stateId);
    this.selectedState.set(id);

    // cities
    this.deliveryService.getCitiesByState(id).subscribe(res => {
      this.cities.set(res.content);
    });

    // delivery methods
    this.deliveryService.getDeliveryMethodsByStateZone(id).subscribe(res => {
      this.deliveryMethods.set(res);
    });
  }
viewOrderDetails(order: Order) {
  this.selectedOrder.set(order);
  this.showOrderDetails.set(true);
}
openOrder(order: Order) {
  this.selectedOrder.set(order);
  this.showOrderDetails.set(true);

  this.orderDetailsLoading.set(true);

  this.orderService.getOrderDetails(order.id).subscribe({
    next: (res) => {
      this.selectedOrderDetails.set(res);
      this.orderDetailsLoading.set(false);
      console.log('📦 Order Details:', res);
    },
    error: (err) => {
      console.error('❌ Order details error', err);
      this.orderDetailsLoading.set(false);
    }
  });
}
  // ================== ORDER ==================
  createOrder() {
    const payload = {
      addressId: this.selectedAddress()?.id,
      countryId: this.selectedCountry(),
      stateId: this.selectedState(),
      cityId: this.selectedCity(),
      deliveryMethodId: this.selectedDelivery(),
      // ⚠️ لازم تضيف دول
      cartId: this.cartId(),
      paymentMethodId: 21
    };

    console.log('📦 payload:', payload);

    this.deliveryService.initOrder(payload).subscribe({
      next: (res) => {
        console.log('✅ Order created', res);
      },
      error: (err) => {
        console.error('❌ Order error', err);
      }
    });
  }


  selectTab(tab: any) {
  this.selectedTab.set(tab);
  this.closeDropdown();

  switch (tab) {
    case 'overview':
      this.loadInitialData();
      break;

    case 'orders':
      this.loadOrders(0);
      break;

    case 'personal':
     
      break;

    case 'addresses':
      this.loadAddresses();
      break;

    case 'security':
      // ❌ no API
      break;
  }
}
setDefaultAddress(address: UserAddress) {

  const payload = {
    ...address,
    isDefault: true,
  };

  this.addressservice.updateAddress(address.id!, payload).subscribe({
    next: () => {

      // ✅ update UI instantly (only one default allowed)
      const updated = this.addresses().map(a => ({
        ...a,
        isDefault: a.id === address.id
      }));

      this.addresses.set(updated);

      // optional UX sync
      this.selectedAddress.set(address);

      console.log('⭐ Default address updated');

    },
    error: (err) => {
      console.error('❌ Failed to set default', err);
    }
  });
}

loadMarketStatus() {
  this.cartService.loadMarketStatus().subscribe({
    next: (res) => {
      this.marketStatus.set(res);
      console.log('📊 Market Status:', res);
    },
    error: (err) => {
      console.error('❌ Market Status Error:', err);
      this.marketStatus.set(null);
    }
  });
}
loadUserProfile() {
  this.addressService.getUserProfile(this.userId).subscribe({
    next: (res) => {
      this.userProfile.set(res);
      console.log('👤 User Profile:', res);
    },
    error: (err) => {
      this.error.set('Failed to load user profile');
      console.error(err);
    }
  });
}
loadUserOverview() {
  this.addressService.getUserOverview(this.userId!).subscribe({
    next: (res) => {
      // ناخد أول عنصر
      this.userOverview.set(res.content?.[0] ?? null);

      console.log('👤 Overview:', res.content);
    },
    error: (err) => {
      this.error.set('Failed to load user overview');
      console.error(err);
    }
  });
}
loadOrders(page: number = 0) {
  this.ordersLoading.set(true);
  this.ordersError.set(null);

  this.orderService.getUserOrders(page, this.ordersSize()).subscribe({
    next: (res: OrdersResponse) => {
      this.orders.set(res.content);
      this.ordersTotal.set(res.totalElements);
      this.ordersPage.set(res.number);
      this.ordersLoading.set(false);
    },
    error: (err) => {
      this.ordersError.set('Failed to load orders');
      this.ordersLoading.set(false);
      console.error(err);
    }
  });
}
openEditAddress(address: UserAddress) {
  this.editingAddress.set(address);
  this.isEditMode.set(true);

  this.editForm.set({
    fullName: address.fullName,
    street: address.street,
    phone: address.phone,
    postalCode: (address as any).postalCode ?? '',
    specialInstructions: (address as any).specialInstructions ?? '',

      countryId: address.country?.id,
  stateId: address.state?.id,
  cityId: address.city?.id,
  });
}
saveAddressEdit() {
  const address = this.editingAddress();
  const form = this.editForm();

  if (!address?.id || !form) return;

  const payload = {
    id: address.id,
    type: (address as any).type ?? 'HOME',
    isDefault: (address as any).isDefault ?? false,
    fullName: form.fullName,
    street: form.street,
    phone: form.phone,
    postalCode: form.postalCode,
    specialInstructions: form.specialInstructions,
    countryId: form.countryId,
    stateId: form.stateId,
    cityId: form.cityId
  };

  this.addressservice.updateAddress(address.id, payload).subscribe({
    next: () => {

      // ✅ تحديث الكارد مباشرة
      const updated = this.addresses().map(a =>
        a.id === address.id
          ? {
              ...a,
              fullName: form.fullName,
              street: form.street,
              phone: form.phone,
              country: { ...a.country, id: form.countryId },
              state: { ...a.state, id: form.stateId },
              city: { ...a.city, id: form.cityId }
            }
          : a
      );

      this.addresses.set(updated);

      // إغلاق المودال
      this.isEditMode.set(false);
      this.editingAddress.set(null);

      // (اختياري) إعادة تحميل من السيرفر للتأكيد
      this.loadAddresses();

      console.log('✅ UI Updated instantly');
    },
    error: (err) => {
      console.error('❌ Update failed', err);
    }
  });
}
updateEditForm(field: string, value: any) {
  this.editForm.set({
    ...this.editForm(),
    [field]: value
  });
}
deleteAddress(addressId: number) {
  if (!confirm('Are you sure you want to delete this address?')) return;

  this.addressservice.deleteAddress(addressId).subscribe({
    next: () => {
      console.log('✅ Address deleted');

      // ✅ نحذف من UI فورًا
      const updated = this.addresses().filter(a => a.id !== addressId);
      this.addresses.set(updated);
      this.loadAddresses();

      // optional: لو عايز refresh من السيرفر
      // this.loadAddresses();
    },
    error: (err) => {
      console.error('❌ Delete failed', err);
    }
  });
}
handleDeleteConfirm() {
  const id = this.confirmDeleteId();
  if (!id) return;

  this.addressservice.deleteAddress(id).subscribe({
    next: () => {
      this.addresses.set(this.addresses().filter(a => a.id !== id));

      // reset
      this.confirmDeleteId.set(null);

      // لو كان selected
      if (this.selectedAddress()?.id === id) {
        this.selectedAddress.set(null);
      }

      console.log('✅ Deleted with modal');
    },
    error: (err) => {
      console.error('❌ Delete failed', err);
      this.confirmDeleteId.set(null);
    }
  });
}
tabs=[
  { key: 'overview', label: 'Overview', icon: 'pi pi-home' },
  { key: 'orders', label: 'Orders', icon: 'pi pi-shopping-bag' },
  { key: 'personal', label: 'Personal Info', icon: 'pi pi-user' },
  { key: 'addresses', label: 'Addresses', icon: 'pi pi-map-marker' },
];
addAddress() {
  this.addressservice.addAddress(this.newAddress()).subscribe({
    next: () => {
      this.showAddressModal.set(false);
      this.loadAddresses();
    }
  });
}
}