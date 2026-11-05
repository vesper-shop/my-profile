export interface TerminalConfig {
  /** Shown in the title bar and prompt as `user@host` */
  user: string;
  host: string;

  /** /social output */
  social: Array<{ name: string; url: string }>;

  /** /contact output */
  contact: {
    email: string;
    telegram?: string;
    wechat?: string;
  };

  /** /links output */
  friends: Array<{ name: string; url: string }>;

  /** /go destinations — key is the route name, value is the path */
  routes: Record<string, string>;

  /** MOTD profile section */
  profile: {
    displayName: string;
    username: string;
    location?: string;
    university?: string;
    degree?: string;
    graduationYear?: string;
    bio?: string;
    contributions: Array<{ label: string; url: string }>;
    founded: Array<{ label: string; url: string }>;
  };
}
