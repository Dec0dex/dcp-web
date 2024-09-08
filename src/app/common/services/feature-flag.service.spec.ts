import { TestBed } from '@angular/core/testing';
import * as LaunchDarkly from 'launchdarkly-js-client-sdk';
import {
  FeatureFlagService,
  initializeFeatureFlag,
} from './feature-flag.service';
import { FFKey } from '@common/constants/feature-flag.constants';

jest.mock('launchdarkly-js-client-sdk', () => ({
  initialize: jest.fn(),
}));

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let mockLDClient: jest.Mocked<LaunchDarkly.LDClient>;

  beforeEach(() => {
    // Create a mocked instance of LDClient
    mockLDClient = {
      allFlags: jest.fn(),
      variation: jest.fn(),
      identify: jest.fn(),
      on: jest.fn(),
      waitUntilReady: jest.fn(),
      close: jest.fn(),
    } as any;

    // Mock LaunchDarkly.initialize to return the mocked client
    (LaunchDarkly.initialize as jest.Mock).mockReturnValue(mockLDClient);

    TestBed.configureTestingModule({
      providers: [FeatureFlagService],
    });

    service = TestBed.inject(FeatureFlagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize LaunchDarkly client', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    const result = service.initialize();
    expect(result).toBe(true);
    expect(LaunchDarkly.initialize).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
    );
  });

  it('should get correct feature flag', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    service.initialize();
    mockLDClient.waitUntilReady.mockResolvedValue(Promise.resolve());
    mockLDClient.allFlags.mockReturnValue({ 'supertokens-auth': true });
    service.getFlag(FFKey.SUPERTOKENS_AUTH, false).subscribe((value) => {
      expect(value).toBe(true);
      expect(mockLDClient.allFlags).toHaveBeenCalled();
    });
  }, 500);

  it('should not get correct feature flag', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    service.initialize();
    mockLDClient.waitUntilReady.mockResolvedValue(Promise.resolve());
    mockLDClient.allFlags.mockReturnValue({ 'supertokens-auth': false });
    service.getFlag(FFKey.SUPERTOKENS_AUTH, false).subscribe((value) => {
      expect(value).toBe(false);
      expect(mockLDClient.allFlags).toHaveBeenCalled();
    });
  }, 500);

  it('should handle empty flags', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    service.initialize();
    mockLDClient.waitUntilReady.mockResolvedValue(Promise.resolve());
    mockLDClient.allFlags.mockReturnValue({});
    service.getFlag(FFKey.SUPERTOKENS_AUTH, false).subscribe((value) => {
      expect(value).toBe(false);
      expect(mockLDClient.allFlags).toHaveBeenCalled();
    });
  }, 500);

  it('should change context to anonymous', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    service.initialize();
    mockLDClient.identify.mockResolvedValue({});
    service.changeUser({ id: 'someId', name: 'someName', type: 'anonymous' });
    expect(mockLDClient.identify).toHaveBeenCalledWith({
      anonymous: true,
      kind: 'user',
      key: 'anonymous',
    });
  });

  it('should change context to user', () => {
    mockLDClient.waitUntilReady.mockResolvedValue(undefined);
    service.initialize();
    mockLDClient.identify.mockResolvedValue({});
    service.changeUser({ id: 'someId', name: 'someName', type: 'user' });
    expect(mockLDClient.identify).toHaveBeenCalledWith({
      key: 'someId',
      name: 'someName',
      kind: 'user',
      anonymous: false,
    });
  });
});

describe('initializeFeatureFlag', () => {
  let service: FeatureFlagService;
  let mockLDClient: jest.Mocked<LaunchDarkly.LDClient>;

  beforeEach(() => {
    mockLDClient = {
      allFlags: jest.fn(),
      variation: jest.fn(),
      identify: jest.fn(),
      on: jest.fn(),
      waitUntilReady: jest.fn(),
      close: jest.fn(),
    } as any;

    (LaunchDarkly.initialize as jest.Mock).mockReturnValue(mockLDClient);

    TestBed.configureTestingModule({
      providers: [FeatureFlagService],
    });

    service = TestBed.inject(FeatureFlagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject when initialize returns false', async () => {
    jest.spyOn(service, 'initialize').mockReturnValue(false);

    const initialize = initializeFeatureFlag(service);

    await expect(initialize()).rejects.toBe(false);
    expect(service.initialize).toHaveBeenCalled();
  });

  it('should reject when initialize throws an error', async () => {
    jest.spyOn(service, 'initialize').mockImplementation(() => {
      throw new Error('Initialization error');
    });

    const initialize = initializeFeatureFlag(service);

    await expect(initialize()).rejects.toThrow('Initialization error');
    expect(service.initialize).toHaveBeenCalled();
  });

  it('should log to the console when initialized', async () => {
    jest.spyOn(service, 'initialize').mockReturnValue(true);
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    const initialize = initializeFeatureFlag(service);

    await initialize();
    expect(consoleLogSpy).toHaveBeenCalledWith('Initialized LaunchDarkly...');

    consoleLogSpy.mockRestore();
  });
});
