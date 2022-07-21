import { Component, OnInit } from '@angular/core';
import { SecretNetworkClient, MsgExecuteContractParams, Permit } from 'secretjs';
import { Window as KeplrWindow } from '@keplr-wallet/types';
import {
  MsgExecuteContract,
  MsgSnip721AddMinter,
  QueryContractRequest,
  ViewingKey,
} from 'secretjs';
import { CreateViewingKeyContractParams } from 'secretjs/dist/extensions/access_control/viewing_key/params';
import { Snip721MintOptions } from 'secretjs/dist/extensions/snip721/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

interface SecretContract {
  address: string;
  codeHash: string;
}

interface Auth {
  permit?: Permit;
  viewer?: {
    viewing_key: ViewingKey;
    address: string;
  };
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  yourAddress: string = '';
  amount: number = 0;

  constructor(private window: Window) { }

  ngOnInit(): void {
  }

  askToEnable() {
    this.window.keplr?.enable('secretdev-1').then(
      () => {
        // this.getData();
        // this.window.keplr?.experimentalSuggestChain().then((res) => {console.log(res)})
        this.sign();
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  mint() {
    this.window.keplr?.enable('secretdev-1').then(() => {
      // @ts-ignore: Object is possibly 'undefined'.
      const offlineSigner = this.window?.getOfflineSigner('secretdev-1');
      offlineSigner.getAccounts().then((account: any) => {
        const secretjs = SecretNetworkClient.create({
          grpcWebUrl: 'http://localhost:9091',
          chainId: 'secretdev-1',
          // @ts-ignore: Object is possibly 'undefined'.
          wallet: this.window.getOfflineSignerOnlyAmino('secretdev-1'),
          walletAddress: account[0].address,
          // @ts-ignore: Object is possibly 'undefined'.
          encryptionUtils: this.window.getEnigmaUtils('secretdev-1'),
        });
        secretjs.then((secretjs) => {
          // const auth_mint: MsgExecuteContractParams<Snip721AddMinterOptions> = {
          //   sender: this.yourAddress,
          //   contractAddress: "secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy",
          //   codeHash: "711CFF84992F537F654134E3B946947782F268184FD6795C565B9F42FB3AFE2E",
          //   msg: {
          //     add_minters: {
          //       minters: [this.yourAddress]
          //     }
          //   }
          // }
          // secretjs.tx.snip721.addMinter(auth_mint);
          secretjs.query.snip721
            .contractCodeHash('secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy')
            .then((hash) => {
              const msg: MsgExecuteContractParams<Snip721MintOptions> = {
                sender: this.yourAddress,
                contractAddress:
                  'secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy',
                codeHash: hash,
                msg: {
                  mint_nft: {
                    owner: this.yourAddress,
                  },
                },
              };
              secretjs.tx.snip721.mint(msg).then((v) => {
                console.log(v);
              });
            });
        });
      });
    });
  }

  getData() {
    this.window.keplr
      ?.experimentalSuggestChain({
        chainId: 'secretdev-1',
        chainName: 'LocalSecret',
        rpc: 'http://localhost:26657',
        rest: 'http://localhost:1317',
        bip44: {
          coinType: 529,
        },
        bech32Config: {
          bech32PrefixAccAddr: 'secret',
          bech32PrefixAccPub: 'secretpub',
          bech32PrefixValAddr: 'secretvaloper',
          bech32PrefixValPub: 'secretvaloperpub',
          bech32PrefixConsAddr: 'secretvalcons',
          bech32PrefixConsPub: 'secretvalconspub',
        },
        currencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
            coinGeckoId: 'secret',
          },
        ],
        feeCurrencies: [
          {
            coinDenom: 'SCRT',
            coinMinimalDenom: 'uscrt',
            coinDecimals: 6,
            coinGeckoId: 'secret',
          },
        ],
        stakeCurrency: {
          coinDenom: 'SCRT',
          coinMinimalDenom: 'uscrt',
          coinDecimals: 6,
          coinGeckoId: 'secret',
        },
        coinType: 529,
        gasPriceStep: {
          low: 0.1,
          average: 0.25,
          high: 1,
        },
        features: ['secretwasm', 'stargate', 'ibc-transfer', 'ibc-go'],
      })
      .then(() => {
        this.window.keplr?.getKey('secretdev-1').then(async (res: any) => {
          const secretjs = await SecretNetworkClient.create({
            grpcWebUrl: 'http://localhost:9091',
            chainId: 'secretdev-1',
          });

          this.setAddress(res);
          this.askToEnable();
          secretjs.query.bank
            .balance({
              address: this.yourAddress,
              denom: 'uscrt',
            })
            .then((v) => {
              console.log(v);
            });
        });
      });
  }

  setAddress(res: any) {
    this.yourAddress = res.bech32Address;
  }


  async sign() {
    // const enigmaUtilsUInt8 = this.window.keplr?.getOfflineSignerAuto('secret').then((res) => console.log(res));
    // this.window.keplr?.getEnigmaUtils('secret').decrypt(enigmaUtilsUInt8)
    // console.log(enigmaUtils)
    // const offlineSigner = this.window.keplr?.getOfflineSigner('secretdev-1');

    // const accounts = await offlineSigner?.getAccounts() || [];

    // @ts-ignore: Object is possibly 'undefined'.
    const offlineSigner = this.window?.getOfflineSigner('secretdev-1');
    offlineSigner.getAccounts().then((account: any) => {
      SecretNetworkClient.create({
        grpcWebUrl: 'http://localhost:9091',
        chainId: 'secretdev-1',
        // @ts-ignore: Object is possibly 'undefined'.
        wallet: this.window.getOfflineSignerOnlyAmino('secretdev-1'),
        walletAddress: account[0].address,
        // @ts-ignore: Object is possibly 'undefined'.
        encryptionUtils: this.window.getEnigmaUtils('secretdev-1'),
      }).then((secretjs) => {
        if (localStorage.getItem('permit')) {
          this.getToken(
            secretjs,
            JSON.parse(localStorage.getItem('permit') || '')
          );
        } else {
          const viewKeyParams: CreateViewingKeyContractParams = {
            sender: this.yourAddress,
            contractAddress: 'secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy',
            msg: {
              create_viewing_key: {
                entropy: 'hello entroyp',
                padding: 'end',
              },
            },
          };
          // secretjs.tx.snip721.createViewingKey(viewKeyParams).then((v) => {
          //   console.log(v);
          // })
          secretjs.utils.accessControl.permit
            .sign(
              this.yourAddress,
              'secretdev-1',
              'one-net-auth',
              ['secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy'],
              ['owner'],
              true
            )
            .then((_permit: Permit) => {
              localStorage.setItem('permit', JSON.stringify(_permit));
              this.getToken(secretjs, _permit);
              // secretjs.query.snip721.contractCodeHash('secret1w6eltdpnxea487ukj6p2num2gcyp9gql83vww5').then((res) => {
              //   let contract: SecretContract = {
              //     address: 'secret1w6eltdpnxea487ukj6p2num2gcyp9gql83vww5',
              //     codeHash: res
              //   };
              //   this.getToken();

              // let ownedTokenReq: {contract: SecretContract, auth: Auth, owner: string } = {
              //   contract: contract,
              //   auth: {permit: _permit},
              //   owner: this.yourAddress
              // }
              // secretjs.query.snip721.GetOwnedTokens(ownedTokenReq).then((res) => console.log(res))
              // });

              // secretjs.tx.snip721.createViewingKey()
            });
        }
      });
    });
  }

  getToken(secretjs: SecretNetworkClient, permit: Permit) {
    secretjs.query.snip721
      .contractCodeHash('secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy')
      .then((res) => {
        let contract: SecretContract = {
          address: 'secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy',
          codeHash: res,
        };
        let queryContractRequest = {
          contractAddress: 'secret174kgn5rtw4kf6f938wm7kwh70h2v4vcfft5mqy',
          codeHash: res,
          query: { num_tokens: {} },
        };
        // secretjs.query.snip721.queryContract(queryContractRequest).then((res) => {
        //   console.log(res)
        // })
        let ownedTokenReq = {
          contract: contract,
          auth: {
            permit: permit,
          },
          owner: this.yourAddress,
        };
        let currentIds: string[] = [];
        secretjs.query.snip721.GetOwnedTokens(ownedTokenReq).then((v) => {
          currentIds = v.token_list.tokens;
          let tokenInfoReq: {
            contract: SecretContract;
            auth: Auth;
            token_id: string;
          } = {
            contract: contract,
            auth: { permit: permit },
            token_id: currentIds[0],
          };
          secretjs.query.snip721.GetTokenInfo(tokenInfoReq).then((res) => {
            console.log(res);
          });
        });
      });

    // let queryContract: {contractAddress: string, codeHash: string, query: {} } = {
    //   contractAddress: 'secret1w6eltdpnxea487ukj6p2num2gcyp9gql83vww5',
    //   codeHash: res,
    //   query: {owner_of: {token_id: "482"}}
    // }
    // secretjs.query.snip721.queryContract(queryContract).then((res) => console.log(res))
  }

  disable() {
    this.window.keplr = undefined;
  }

  getKeplr(): any {
    if (window.keplr) {
      return window.keplr;
    }

    if (document.readyState === 'complete') {
      return window.keplr;
    }

    return new Promise((resolve) => {
      const documentStateChange = (event: Event) => {
        if (
          event.target &&
          (event.target as Document).readyState === 'complete'
        ) {
          resolve(window.keplr);
          document.removeEventListener('readystatechange', documentStateChange);
        }
      };

      document.addEventListener('readystatechange', documentStateChange);
    });
  }
}
