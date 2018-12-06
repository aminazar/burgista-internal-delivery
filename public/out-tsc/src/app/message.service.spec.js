"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var message_service_1 = require("./message.service");
describe('MessageService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [message_service_1.MessageService]
        });
    });
    it('should ...', testing_1.inject([message_service_1.MessageService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/burgista-delivery-client/src/src/app/message.service.spec.js.map