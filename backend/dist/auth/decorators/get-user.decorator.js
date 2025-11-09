"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((data, context) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new common_1.InternalServerErrorException('Usuario no encontrado (request)');
    }
    return data ? user[data] : user;
});
//# sourceMappingURL=get-user.decorator.js.map