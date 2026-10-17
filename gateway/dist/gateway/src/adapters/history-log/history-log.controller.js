"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryLogController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../domain/identity/jwt-auth.guard");
const history_log_service_1 = require("./history-log.service");
let HistoryLogController = class HistoryLogController {
    constructor(historyLogService) {
        this.historyLogService = historyLogService;
    }
    findAll(limit) {
        const parsedLimit = Number(limit);
        return this.historyLogService.findAll(Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 500) : 200);
    }
};
exports.HistoryLogController = HistoryLogController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoryLogController.prototype, "findAll", null);
exports.HistoryLogController = HistoryLogController = __decorate([
    (0, common_1.Controller)('history-logs'),
    __metadata("design:paramtypes", [history_log_service_1.HistoryLogService])
], HistoryLogController);
//# sourceMappingURL=history-log.controller.js.map