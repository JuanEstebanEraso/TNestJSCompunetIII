"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bet_dto_1 = require("./create-bet.dto");
class UpdateBetDto extends (0, swagger_1.PartialType)(create_bet_dto_1.CreateBetDto) {
}
exports.UpdateBetDto = UpdateBetDto;
//# sourceMappingURL=update-bet.dto.js.map