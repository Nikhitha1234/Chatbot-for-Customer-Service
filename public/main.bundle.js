webpackJsonp([1,4],{

/***/ 343:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 343;


/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(453);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(452);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/Users/BHAVESH/Desktop/NODEJS/ibmwatson/kpmghelpdeskbot/client/src/main.js.map

/***/ }),

/***/ 451:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(283);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(http) {
        this.http = http;
        this.message = "";
        this.messages = [];
        this.backend = "http://localhost:3000/upload";
    }
    // adding a comment just to trigger buil
    AppComponent.prototype.send = function () {
        var _this = this;
        this.messages.push({ "text": this.message, "from": { name: "user" } });
        console.log("posting to backend");
        this.http.post(this.backend, {
            "input": {
                "text": this.message
            },
            "context": this.context
        }).subscribe(function (data) {
            var packet = JSON.parse(data["_body"]);
            _this.messages.push({
                "text": packet.text,
                "img": packet.img,
                "from": { name: "watson" }
            });
            _this.context = packet.context;
            console.log("current_context", _this.context);
        }, function (err) { return console.log(err); });
        this.message = "";
    };
    AppComponent.prototype.ngOnInit = function () {
        this.scrollToBottom();
    };
    AppComponent.prototype.ngAfterViewChecked = function () {
        this.scrollToBottom();
    };
    AppComponent.prototype.scrollToBottom = function () {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        }
        catch (err) { }
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["U" /* ViewChild */])('scrollMe'), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* ElementRef */]) === 'function' && _a) || Object)
    ], AppComponent.prototype, "myScrollContainer", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["V" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(608),
            styles: [__webpack_require__(607)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Http */]) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
//# sourceMappingURL=C:/Users/BHAVESH/Desktop/NODEJS/ibmwatson/kpmghelpdeskbot/client/src/app.component.js.map

/***/ }),

/***/ 452:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(422);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(283);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(451);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/Users/BHAVESH/Desktop/NODEJS/ibmwatson/kpmghelpdeskbot/client/src/app.module.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=C:/Users/BHAVESH/Desktop/NODEJS/ibmwatson/kpmghelpdeskbot/client/src/environment.js.map

/***/ }),

/***/ 607:
/***/ (function(module, exports) {

module.exports = "* {\r\n  box-sizing: border-box;\r\n}\r\n\r\nbody {\r\n  background-color: #edeff2;\r\n  font-family: \"Segoe UI\", \"Calibri\", \"Roboto\", sans-serif;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n}\r\n\r\n.chat_window {\r\n  position: absolute;\r\n  width: calc(100% - 20px);\r\n  max-width: 800px;\r\n  height: calc(100% - 20px);\r\n  left: 50%;\r\n  top: 50%;\r\n  -webkit-transform: translateX(-50%) translateY(-50%);\r\n          transform: translateX(-50%) translateY(-50%);\r\n  box-shadow: 0px 4px 61px -2px rgba(0,0,0,0.28);\r\n  background-color: #fcfcfc;\r\n  overflow-x: hidden;\r\n  border: 1px #eee solid;\r\n}\r\n\r\n.top_menu {\r\n  background-color: #2b303e;\r\n  padding: 10px 16px;\r\n  height: 56px;\r\n}\r\n\r\n.top_menu .title {\r\n  font-size: 16px;\r\n  font-family: sans-serif, \"Segoe UI\";\r\n  color: rgb(248, 251, 255);\r\n  font-weight: 300;\r\n  vertical-align: middle;\r\n}\r\n\r\n\r\n.top_menu .sub-title {\r\n  font-size: 13px;\r\n  font-family: sans-serif, \"Segoe UI\";\r\n  color: rgb(248, 251, 255);\r\n  font-weight: 200;\r\n  vertical-align: middle;\r\n  padding-top: 2px;\r\n}\r\n\r\n.messages {\r\n  position: relative;\r\n  list-style: none;\r\n  padding: 20px 10px 0 10px;\r\n  height: calc(100% - 125px);\r\n  overflow: scroll;\r\n  overflow-x: hidden;\r\n  margin-top: 1px;\r\n}\r\n.user {\r\n  border-radius: 2px;\r\n  background-color: rgb(216, 216, 216);\r\n  padding: 15px 20px 15px 20px;\r\n  margin-left: 40px;\r\n /* margin-right: 25px; */\r\n  margin-bottom: 20px;\r\n  display: inline-block;\r\n  float: right;\r\n  clear: both;\r\n\r\n}\r\n\r\n.user span {\r\n  font-size: 16px;\r\n  color: rgb(37, 53, 85);\r\n  line-height: 1.2;\r\n  font-weight: 300;\r\n  font-family: \"Segoe UI\", \"Open Sans\", Arial, sans-serif;\r\n}\r\n\r\n\r\n.watson{\r\n  border-radius: 2px;\r\n  background-color: rgb(117, 156, 209);\r\n  color: rgb(37, 53, 85);\r\n  padding: 20px;\r\n  margin-right: 40px;\r\n  margin-bottom: 22px;\r\n  display: block;\r\n  float: left;\r\n  clear: both;\r\n}\r\n\r\n.watson span{\r\n  font-size: 16px;\r\n  margin-top: -11px;\r\n  color: white;\r\n  line-height: 1.4;\r\n  font-weight: 300;\r\n  font-family: \"Segoe UI\", \"Open Sans\", Arial, sans-serif;\r\n}\r\n\r\n.I_can_help_you_with_incident_reporting__searchi {\r\n  font-size: 16px;\r\n  font-family: \"Segoe UI\";\r\n  color: rgb(255, 255, 255);\r\n  line-height: 1.2;\r\n  text-align: left;\r\n  position: absolute;\r\n  left: 53px;\r\n  top: 189.398px;\r\n  width: 521px;\r\n  height: 36px;\r\n  z-index: 26;\r\n}\r\n\r\n\r\n.header-icon::before\r\n{\r\n  position: relative;\r\n  top: -3px;\r\n  display: inline-block;\r\n  height: 37px;\r\n  width: 30px;\r\n  content: url(\"../assets/img/chat-header-icon.svg\");\r\n  float: left;\r\n  margin-right: 8px;\r\n}\r\n\r\n\r\n\r\n.bottom_wrapper {\r\n\r\n  position: relative;\r\n  width: 100%;\r\n  background: #f2f2f2;\r\n  padding: 20px 20px;\r\n  position: absolute;\r\n  bottom: 0;\r\n  border-bottom: #eee 1px solid;\r\n  border-top: #cccccc 1px solid;\r\n\r\n}\r\n.bottom_wrapper .message_input_wrapper {\r\n\r\n  width: calc(100% - 110px);\r\n  position: relative;\r\n  padding: 0 20px;\r\n  display: inline-block;\r\n  border-width: 0px;\r\n  background: #f2f2f2;\r\n  height: 30px;\r\n  font-weight: 300;\r\n  border: none;\r\n}\r\n\r\n.bottom_wrapper .message_input_wrapper .message_input {\r\n  border: none;\r\n  height: 100%;\r\n  box-sizing: border-box;\r\n  width: calc(100% - 40px);\r\n  position: absolute;\r\n  outline-width: 0;\r\n  color: gray;\r\n  font-size: 16px;\r\n  background: transparent;\r\n}\r\n\r\n.bottom_wrapper .send_message {\r\n  display: inline-block;\r\n  float: right;\r\n  cursor: pointer;\r\n  margin-right: 30px;\r\n  position: relative;\r\n  top: 4px;\r\n}\r\n\r\n.bottom_wrapper .send_message:before {\r\n  content: \"\\f1d9\";\r\n  font-family: FontAwesome;\r\n  font-size: 22px;\r\n  color: #4d85d1;\r\n\r\n}\r\n\r\n.bottom_wrapper .send_message:hover:before {\r\n  color: #0059d1;\r\n}\r\n\r\n.bottom_wrapper .send_voice {\r\n  display: inline-block;\r\n  float: right;\r\n  cursor: pointer;\r\n  position: relative;\r\n  top: 4px;\r\n}\r\n\r\n.bottom_wrapper .send_voice:before {\r\n  content: \"\\f130\";\r\n  font-family: FontAwesome;\r\n  font-size: 22px;\r\n  color: #aaa;\r\n}\r\n\r\n\r\n.bottom_wrapper .send_voice:hover:before {\r\n  color: #0059d1;\r\n}\r\n\r\n.bottom_wrapper .active:before {\r\n  content: \"\\f130\";\r\n  font-family: FontAwesome;\r\n  font-size: 22px;\r\n  color: #4d85d1 !important;\r\n}\r\n\r\n\r\n/*\r\n\r\n.bottom_wrapper .send_message {\r\n  display: inline-block;\r\n  float: right;\r\n  transition: all 0.2s linear;\r\n  width: 89px;\r\n  height: 30px;\r\n  padding: 0;\r\n  color: white;\r\n  text-align: center;\r\n  background: rgb(102, 204, 51);\r\n  border: 0;\r\n  border-radius: 6px;\r\n  border-bottom: 1px solid #4c9726;\r\n  cursor: pointer;\r\n  -webkit-box-shadow: inset 0 -2px #4c9726;\r\n  box-shadow: inset 0 -2px #4c9726;\r\n  font-weight: 400;\r\n  margin-left: 20px;\r\n  font-family: 'roboto', sans-serif;\r\n}\r\n\r\n.bottom_wrapper .send_message:hover {\r\n  background: #33cc8d;\r\n  -webkit-box-shadow: inset 0 -2px #38701c;\r\n  box-shadow: inset 0 -2px #38701c\r\n}\r\n */\r\n\r\n\r\n.bottom_wrapper .send_message .text {\r\n  font-size: 16px;\r\n  font-weight: 300;\r\n  display: inline-block;\r\n  line-height: 26px;\r\n}\r\n\r\n.message_template {\r\n  display: none;\r\n}\r\n\r\n.icon {\r\n  background-image: url(\"../assets/img/send.svg\");\r\n  width: 16px;\r\n  height: 16px;\r\n  float: left;\r\n  text-rendering: optimizeLegibility;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n  margin-top: 6px;\r\n  margin-left: 10px;\r\n}\r\n\r\n"

/***/ }),

/***/ 608:
/***/ (function(module, exports) {

module.exports = "<div class=\"chat_window\">\r\n  <div class=\"top_menu\">\r\n    <div class=\"title\"><span class=\"header-icon\"></span>Help Desk</div>\r\n    <div class=\"sub-title\">This bot is built to work as a helpdesk</div>\r\n  </div>\r\n  <ul #scrollMe class=\"messages\">\r\n\r\n\r\n    <li *ngFor=\"let message of messages\" class={{message.from.name}}>\r\n\r\n      <span style=\"white-space: pre-line\" *ngIf=\"message.text!==undefined\"> <div innerHTML=\"{{message.text}}\"></div></span>\r\n      <img [src]=\"message.img\" *ngIf= \"message.img!==undefined\" width=\"600\" height=\"400\">\r\n\r\n    </li>\r\n  </ul>\r\n  <div class=\"bottom_wrapper clearfix\">\r\n    <div class=\"message_input_wrapper\">\r\n      <input class=\"message_input\" placeholder=\"Type your message here...\" [(ngModel)]=\"message\" (keyup.enter)=\"send()\" />\r\n    </div>\r\n   <!-- <div class=\"send_voice\" (click)=\"send()\"> \r\n\r\n    </div>\r\n  <div class=\"send_message\" (click)=\"send()\"> \r\n\r\n    </div> -->\r\n\r\n  </div>\r\n</div>"

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(344);


/***/ })

},[621]);
//# sourceMappingURL=main.bundle.map