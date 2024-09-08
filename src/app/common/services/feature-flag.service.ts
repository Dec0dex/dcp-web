import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '@environment/environment';
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
import { LDFlagSet, LDFlagValue } from 'launchdarkly-js-client-sdk';
import { BehaviorSubject, Observable } from 'rxjs';
import { LDUser } from '../types/ld-user.type';
import { FFKey } from '../constants/feature-flag.constants';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService implements OnDestroy {
  private client?: LaunchDarkly.LDClient;
  private flags: LDFlagSet = {};

  private _flagChange$: BehaviorSubject<object> = new BehaviorSubject<object>(
    {},
  );
  flagChange$: Observable<object> = this._flagChange$.asObservable();

  async ngOnDestroy() {
    await this.client?.close();
  }

  initialize(): boolean {
    const context = this.getAnonymousContext();
    this.client = LaunchDarkly.initialize(
      environment.launchDarklyClientId,
      context,
    );

    return this.client ? true : false;
  }

  getFlag(flagKey: FFKey, defaultValue: LDFlagValue): Observable<LDFlagValue> {
    this.client?.waitUntilReady().then(() => {
      this.flags = this.client?.allFlags() || {};
      const flagsArray = Object.entries(this.flags || []);

      flagsArray.filter(([key, value]) => {
        if (key === flagKey) {
          this.setFlag(key, defaultValue);
          return value;
        } else {
          return defaultValue;
        }
      });

      this.client?.on('initialized', (flags) => {
        this.flags = { ...flags };
      });

      this.client?.on(`change:${flagKey}`, (_) => {
        this.setFlag(flagKey, defaultValue);
      });
    });

    return this.flagChange$;
  }

  changeUser(user: LDUser) {
    if (user.type == 'anonymous') {
      this.client?.identify(this.getAnonymousContext());
    } else {
      this.client?.identify(this.getUserContext(user));
    }
  }

  private getAnonymousContext(): LaunchDarkly.LDSingleKindContext {
    return {
      anonymous: true,
      kind: 'user',
      key: 'anonymous',
    };
  }

  private getUserContext(user: LDUser): LaunchDarkly.LDSingleKindContext {
    return {
      anonymous: false,
      kind: 'user',
      key: user.id,
      name: user.name,
    };
  }

  private setFlag(flagKey: string, defaultValue: LDFlagValue) {
    if (this.client)
      this._flagChange$.next(this.client.variation(flagKey, defaultValue));
  }
}

export function initializeFeatureFlag(
  featureFlagService: FeatureFlagService,
): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        if (featureFlagService.initialize()) {
          resolve(true);
        } else {
          reject(false);
        }
        console.log('Initialized LaunchDarkly...');
      } catch (error) {
        reject(error);
      }
    });
  };
}
