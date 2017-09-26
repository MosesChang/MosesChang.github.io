var RollerSlot = (function () {
    function RollerSlot(inSymbol, level, symbolX, symbolY, lightX, lightY) {
        this.symbol = inSymbol;
        this.spriteSymbolNormal = level.fGroupSymbolNormal.create(symbolX, symbolY, "GameImage1", this.symbol.keyName + "_1");
        this.spriteSymbolLight = level.fGroupSymbolLight.create(symbolX, symbolY, "GameImage1", this.symbol.keyName + "_2");
        this.spriteLightNormal = level.fGroupLightNormal.create(lightX, lightY, "GameImage1", "BU_LT01");
        this.spriteLightLight = level.fGroupLightLight.create(lightX, lightY, "GameImage1", "BU_LT02");
        this.lightOnOff(false);
    }
    RollerSlot.prototype.lightOnOff = function (bOnOff) {
        this.spriteSymbolNormal.visible = !bOnOff;
        this.spriteSymbolLight.visible = bOnOff;
        this.spriteLightNormal.visible = !bOnOff;
        this.spriteLightLight.visible = bOnOff;
    };
    RollerSlot.prototype.checkVisible = function () {
        return this.spriteSymbolLight.visible;
    };
    return RollerSlot;
}());
