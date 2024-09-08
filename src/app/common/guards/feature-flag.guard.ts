import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FeatureFlagService } from '@common/services/feature-flag.service';
import { FFKey } from '../constants/feature-flag.constants';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private featureFlagService: FeatureFlagService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const flagKey: FFKey = route.data['featureFlag'];

    return this.featureFlagService.getFlag(flagKey, false).pipe(
      map((flagValue) => {
        if (flagValue) {
          return true;
        } else {
          this.router.navigate(['/404']);
          console.error(`Feature flag guard: ${flagKey} is disabled`);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Feature flag guard error', error);
        return of(false);
      }),
    );
  }
}
