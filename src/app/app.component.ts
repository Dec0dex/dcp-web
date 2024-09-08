import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeatureFlagService } from '@common/services/feature-flag.service';
import { environment } from '@environment/environment';
import SuperTokens from 'supertokens-web-js';
import EmailPassword from 'supertokens-web-js/recipe/emailpassword';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty';
import { TranslocoRootModule } from './transloco-root.module';
import { FFKey } from '@common/constants/feature-flag.constants';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslocoRootModule],
  providers: [FeatureFlagService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // MARK: Init
  constructor(private readonly featureFlagService: FeatureFlagService) {
    featureFlagService.initialize();
    this.initializeSuperTokensIfNeeded();
  }

  // MARK: Private methods
  private initializeSuperTokensIfNeeded() {
    this.featureFlagService
      .getFlag(FFKey.SUPERTOKENS_AUTH, false)
      .pipe(take(1)) // Ensures it checks the flag once
      .subscribe((flag) => {
        if (flag) {
          console.log('Initializing SuperTokens...');
          SuperTokens.init({
            appInfo: {
              apiDomain: environment.apiDomain,
              apiBasePath: `${environment.apiBasePath}/auth`,
              appName: environment.appName,
            },
            recipeList: [
              Session.init(),
              EmailPassword.init(),
              ThirdParty.init(),
            ],
          });
        }
      });
  }
}
