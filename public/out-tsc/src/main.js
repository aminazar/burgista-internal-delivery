"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfills.ts");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var environment_1 = require("./environments/environment");
var _1 = require("./app/");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(_1.AppModule);
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/main.js.map