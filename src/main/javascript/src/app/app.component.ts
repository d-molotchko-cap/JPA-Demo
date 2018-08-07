import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './services/notification.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Branding & Company info
  private backgroundColor: String = '#cfe2f3';
  private companyName: String = 'Vacation Approval';
  private companyWWW: String = 'http://www.rougevalley.ca';
  private companyAddress: String = '3030 Birchmount Rd. Scarborough, ON  M1W 3W3';
  private companyEmail: String = 'patientrelations@rougevalley.ca';
  private companyPhone: String = '416-495-2400';
  private companyFax: String = '-';
  protected principal: string;
  private principalSub;

  constructor(
    private translate: TranslateService,
    private notification: NotificationService,
    private loginService: LoginService
  ) {
    notification.initializeWebSocketConnection();
    translate.addLangs(['ar', 'de', 'en', 'es', 'fr', 'it', 'ja', 'ko', 'pt']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/ar|de|en|es|fr|it|ja|ko|pt/) ? browserLang : 'en');
  }

  ngOnInit() {
    this.principalSub = this.loginService.principal.subscribe(data => {
        this.principal = data;
    });
  }

  ngOnDestroy(): void {
    this.principalSub.unsibscribe();
  }

  onLogout(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.loginService.logout();

  }
}
