import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-supertokens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supertokens.component.html',
  styleUrl: './supertokens.component.scss',
})
export class SupertokensComponent implements OnDestroy, AfterViewInit {
  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngAfterViewInit() {
    this.loadScript(
      'https://cdn.jsdelivr.net/gh/supertokens/prebuiltui@v0.46.0/build/static/js/main.57ef81a3.js',
    );
  }

  ngOnDestroy() {
    // Remove the script when the component is destroyed
    const script = this.document.getElementById('supertokens-script');
    if (script) {
      script.remove();
    }
  }

  private loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.id = 'supertokens-script';
    script.onload = () => {
      (window as any).supertokensUIInit('supertokensui', {
        appInfo: {
          appName: environment.appName,
          apiDomain: environment.apiDomain,
          websiteDomain: environment.websiteDomain,
          apiBasePath: `${environment.apiBasePath}/auth`,
          websiteBasePath: '/auth',
        },
        recipeList: [
          (window as any).supertokensUIEmailPassword.init(),
          (window as any).supertokensUIThirdParty.init({
            signInAndUpFeature: {
              providers: [
                (window as any).supertokensUIThirdParty.Github.init(),
                (window as any).supertokensUIThirdParty.Google.init(),
                (window as any).supertokensUIThirdParty.Facebook.init(),
                (window as any).supertokensUIThirdParty.Apple.init(),
              ],
            },
          }),
          (window as any).supertokensUISession.init(),
        ],
      });
    };
    this.renderer.appendChild(this.document.body, script);
  }
}
