
export class Settings {

  accessTokenName       = 'accessToken';
  storageUserName       = 'currentUser';
  storageCartName       = 'currentCart';
  dataLocalStorageName  = 'data';

  haveCatalogAccess     = false;
  nameDevice            = 'Device';
  codeDevice            = 'PWA_0';
  title                 = 'D-menu';
  defImgPath            = 'assets/';
  defImgFileName        = 'no-image_100.png';

  errors: Array<string> = [];

  currentOrderId        = 0;
  waiterId              = 0;
  callWaiter            = 0;

  showOrder             = false;
  showCatalog           = true;

  constructor() {

    /*
    accessPair: Array<{ mac: string, token: string }> = [
      {mac: '00:00:00:00', token: ''}
    ];
    */
    /*
    this.accessPair.push (
      {mac: '00:00:00:00', token: ''}
    );
    */

  }


}

