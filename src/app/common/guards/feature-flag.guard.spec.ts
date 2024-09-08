import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FeatureFlagService } from '@common/services/feature-flag.service';
import { of, throwError } from 'rxjs';
import { FFKey } from '../constants/feature-flag.constants';
import { FeatureFlagGuard } from './feature-flag.guard';

describe('FeatureFlagGuard', () => {
  let guard: FeatureFlagGuard;
  let featureFlagService: jest.Mocked<FeatureFlagService>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    featureFlagService = {
      getFlag: jest.fn(),
    } as unknown as jest.Mocked<FeatureFlagService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        FeatureFlagGuard,
        { provide: FeatureFlagService, useValue: featureFlagService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(FeatureFlagGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if the feature flag is enabled', (done) => {
    const flagKey: FFKey = FFKey.SUPERTOKENS_AUTH;
    featureFlagService.getFlag.mockReturnValue(of(true));

    (
      guard.canActivate(
        { data: { featureFlag: flagKey } } as any,
        {} as any,
      ) as any
    ).subscribe((result: any) => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to 404 and disallow activation if the feature flag is disabled', (done) => {
    const flagKey: FFKey = FFKey.SUPERTOKENS_AUTH;
    featureFlagService.getFlag.mockReturnValue(of(false));

    (
      guard.canActivate(
        { data: { featureFlag: flagKey } } as any,
        {} as any,
      ) as any
    ).subscribe((result: any) => {
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/404']);
      done();
    });
  });

  it('should handle error and disallow activation if there is an error', (done) => {
    const flagKey: FFKey = FFKey.SUPERTOKENS_AUTH;
    featureFlagService.getFlag.mockReturnValue(
      throwError(() => new Error('Test Error')),
    );

    (
      guard.canActivate(
        { data: { featureFlag: flagKey } } as any,
        {} as any,
      ) as any
    ).subscribe((result: any) => {
      expect(result).toBe(false);
      done();
    });
  });
});
