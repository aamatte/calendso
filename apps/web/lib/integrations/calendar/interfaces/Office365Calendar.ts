export type BufferedBusyTime = {
  start: string;
  end: string;
};

export type O365AuthCredentials = {
  expiry_date: number;
  access_token: string;
  refresh_token: string;
};
