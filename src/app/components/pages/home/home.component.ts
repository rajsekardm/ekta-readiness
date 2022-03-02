import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Web3 from 'web3';
// Connect Wallet
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';

// Set web3 and connector
let web3 = new Web3(window['ethereum']);
let connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('uiWallet') uiWallet;
  @ViewChild('addNetwork') addNetwork;
  @ViewChild('addToken') addToken;
  ethereum: any;
  account: any = {};
  alertSuccess: boolean = true;
  connector: any;
  ektaMainnet: boolean = false;
  bscMainnet: boolean = false;
  ethToken: boolean = false;
  bscToken: boolean = false;
  thankyou: boolean = false;
  
  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.ethereum = window['ethereum'];
    this.account = this.storageService.getItem('account') === null ? { address: "", network: "", chainId: "", provider: "" } : JSON.parse(this.storageService.getItem('account'));
    this.accountService.accountObserve.subscribe(response => {
      this.account = response;
    });
  }

  connectWallet(){
      let account = { status: true };
      this.accountService.connectionStatus(account);
  }

  formSubmit(){
    this.thankyou = true;
  }
  addBscMainnet(){
    window['ethereum'].request({ 
     method: 'wallet_addEthereumChain',
     params: [{
     chainId: '0x38',
     chainName: 'Binance',
     nativeCurrency: {
         name: 'BNB',
         symbol: 'BNB',
         decimals: 18
     },
     rpcUrls: ['https://bsc-dataseed1.binance.org/'],
     blockExplorerUrls: ['https://bscscan.com/']
     }]
   })
     .then((success) => {
      console.log("receipt",success);
       this.toastr.success("Network Added Successfully");
       this.bscMainnet = true;
     })
     .catch((error) => {
      console.log("error",error);
       if (error.code === 4001){
         this.toastr.error('User rejected');
       }
       else{
         this.toastr.error("Something went wrong");
       } 
     });
   
 }
 
  addEktaMainet(){
    window['ethereum'].request({ 
      method: 'wallet_addEthereumChain',
      params: [{
      chainId: '0x7ca',
      chainName: 'Ekta',
      nativeCurrency: {
          name: 'Ekta',
          symbol: 'Ekta',
          decimals: 18
      },
      rpcUrls: ['https://main.ekta.io'],
      blockExplorerUrls: ['https://ektascan.io']
      }]
    })
    .then((success) => {
      console.log("receipt",success);
      this.toastr.success("Network Added Successfully");
      this.ektaMainnet = true;
    })
    .catch((error) => {
      console.log("error",error);
      if (error.code === 4001){
        this.toastr.error('User rejected');
      }
      else{
        this.toastr.error("Something went wrong");
      }
    });
  }

  async addEthToken(){
    // this.addToken.nativeElement.click();
    if(this.account.chainId == '' || this.account.chainId == undefined){
      // this.uiWallet.nativeElement.click();
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x1'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x1'}]});
        setTimeout(()=>  this.importEthToken(), 500)
      return;
    }
    else{
      this.importEthToken();
    }
  }
  async addBscToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      // this.uiWallet.nativeElement.click();
      let account = { status: true };
      this.accountService.connectionStatus(account);
      return
    }
    else if(this.account.chainId != '0x38'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x38'}]});
        setTimeout(()=>  this.importBscToken(), 500)
      return;
    }
    else{
      this.importBscToken();
    }
  }

  importBscToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x45808ce43eb2d7685ff0242631f0feb6f3d8701a',
         symbol: 'BNB',
         decimals: 18,
         image: 'https://bscscan.com/token/images/ektaworld_32.png',
       },
     },
   })
   .then((success) => {
    this.bscToken = true;
  })
   .catch((error) => {
    });
 }
 importEthToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x2f75113b13D136F861d212Fa9b572F2C79Ac81C4',
         symbol: 'ETH',
         decimals: 18,
         image: 'https://etherscan.io/token/images/ektav2_32.png',
       },
     },
   })
   .then((success) => {
    this.ethToken = true;
   })
   .catch((error) => {
    });
 }


}
