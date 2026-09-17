/**
 * GoogleAuthService
 *
 * Uses the official Google Identity Services (GSI) `window.onGoogleLibraryLoad`
 * callback — the correct way to know when the GSI script has finished loading.
 * This eliminates any need for polling or setTimeout hacks in components.
 *
 * Reference: https://developers.google.com/identity/gsi/web/guides/client-library
 */

import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  /**
   * A Promise that resolves when the Google GSI SDK is initialized and ready.
   * Components await this before calling google.accounts.id.prompt().
   */
  private readyPromise: Promise<void>;
  private resolveReady!: () => void;

  private callback: ((response: any) => void) | null = null;

  constructor() {
    this.readyPromise = new Promise<void>((resolve) => {
      this.resolveReady = resolve;
    });

    if (typeof window !== 'undefined') {
      this.registerLibraryLoad();
    }
  }

  private registerLibraryLoad() {
    const google = (window as any).google;

    if (google?.accounts?.id) {
      // SDK already loaded (e.g. hot-reload / navigated back to page)
      this.initSdk();
    } else {
      // Official Google callback — fires exactly once when GSI script finishes
      (window as any)['onGoogleLibraryLoad'] = () => {
        this.initSdk();
      };
    }
  }

  private initSdk() {
    if (!environment.googleClientId) return;

    try {
      (window as any).google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => {
          if (this.callback) {
            this.callback(response);
          }
        }
      });
      this.resolveReady();
    } catch (err) {
      console.error('[GoogleAuthService] init error:', err);
    }
  }

  /**
   * Set the handler that receives the Google credential response.
   * Call this before prompt() — e.g. in ngOnInit of each component.
   */
  setCallback(fn: (response: any) => void) {
    this.callback = fn;
  }

  /**
   * Returns a Promise that resolves when the SDK is ready.
   * Safe to await multiple times — resolves immediately if already ready.
   */
  ready(): Promise<void> {
    return this.readyPromise;
  }

  /**
   * Render the official Google Sign-In button into a target container element.
   * Clicking this button opens Google's native account chooser popup window.
   */
  async renderButton(element: HTMLElement, options: any = {}): Promise<void> {
    await this.readyPromise;

    const google = (window as any).google;
    if (!google?.accounts?.id) {
      throw new Error('Google Identity SDK not available');
    }

    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: element.clientWidth || 320,
      ...options
    });
  }

  /**
   * Show the Google One Tap / Sign In prompt.
   * Automatically waits for the SDK to be ready before prompting.
   */
  async prompt(): Promise<void> {
    await this.readyPromise;

    const google = (window as any).google;
    if (!google?.accounts?.id) {
      throw new Error('Google Identity SDK not available');
    }

    return new Promise((resolve) => {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason?.();
          console.warn('[GoogleAuthService] prompt not displayed:', reason);
        }
        resolve();
      });
    });
  }
}
