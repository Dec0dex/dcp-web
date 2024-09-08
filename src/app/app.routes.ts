import { Routes } from '@angular/router';
import { FeatureFlagGuard } from '@common/guards/feature-flag.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@pages/auth/supertokens/supertokens.routes').then(
        (m) => m.routes,
      ),
    canActivate: [FeatureFlagGuard],
    data: { featureFlag: 'supertokens-auth' }, // Different feature flag key
  },
];
