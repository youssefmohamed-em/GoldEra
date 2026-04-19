import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { Lang, TranslateService } from '../../../services/translate.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule,TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
   private translate = inject(TranslateService);

  currentLang = this.translate.lang;

  isMenuOpen = signal(false);
  isUserMenuOpen = signal(false);
  showLogoutModal = signal(false);

  userFirstName = signal<string | null>(null);
  userEmail = signal<string | null>(null);

  selectedTab = signal<string>('overview');

  constructor() {
    const user = this.authService.getCurrentUser?.();
    this.userFirstName.set(user?.firstName ?? null);
    this.userEmail.set(user?.email ?? null);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) this.selectedTab.set(tab);
    });
  }
openNotifications() {
  console.log('Notifications clicked');
}
  // =====================
  // MENU CONTROLS
  // =====================
  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen.set(!this.isUserMenuOpen());
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  // close menus when clicking outside
  @HostListener('document:click')
  closeAllMenus() {
    this.isUserMenuOpen.set(false);
  }

  // =====================
  // NAVIGATION
  // =====================
  navigateTo(tab: string) {
    this.router.navigate(['/dashboard/profile-orders'], {
      queryParams: { tab }
    });

    this.closeUserMenu();
    this.closeMenu();
  }

  // =====================
  // LOGOUT
  // =====================
  logout() {
    this.showLogoutModal.set(true);
  }

  confirmLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeUserMenu();
    this.showLogoutModal.set(false);
  }

  cancelLogout() {
    this.showLogoutModal.set(false);
  }

toggleLanguage() {
  const newLang: Lang = this.translate.lang() === 'en' ? 'ar' : 'en';
  this.translate.setLang(newLang);
}
t(key: string) {
  return this.translate.translate(key);
}
}