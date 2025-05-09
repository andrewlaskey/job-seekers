// types/google-one-tap.d.ts
declare module "google-one-tap" {
  export interface CredentialResponse {
    clientId: string;
    credential: string;
    select_by: string;
  }

  export interface IdConfiguration {
    client_id: string;
    auto_select?: boolean;
    callback?: (response: CredentialResponse) => void;
    login_uri?: string;
    native_callback?: Function;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: string;
    state_cookie_domain?: string;
    ux_mode?: string;
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: Function;
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
  }

  export interface GsiButtonConfiguration {
    type?: string;
    theme?: string;
    size?: string;
    text?: string;
    shape?: string;
    logo_alignment?: string;
    width?: string;
    locale?: string;
  }

  export interface Google {
    accounts: {
      id: {
        initialize: (idConfiguration: IdConfiguration) => void;
        prompt: (momentListener?: (promptMoment: any) => void) => void;
        renderButton: (
          parent: HTMLElement,
          options: GsiButtonConfiguration
        ) => void;
        disableAutoSelect: () => void;
        storeCredential: (credential: any, callback: Function) => void;
        cancel: () => void;
        revoke: (hint: string, callback: Function) => void;
      };
    };
  }

  global {
    interface Window {
      google: Google;
    }
  }
}
