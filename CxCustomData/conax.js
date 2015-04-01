Conax = function () {

    var generateUUID = function() {
        var lut = [];
        for (var i = 0; i < 256; i++) {
            lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
        }
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }

    var getOrCreateCxDeviceId = function(drmClientType) {
        if (typeof(Storage) !== "undefined") {
            var cxDeviceId = localStorage.getItem("cxDeviceId." + drmClientType);
            if (cxDeviceId == null) {
                cxDeviceId = generateUUID();
                localStorage.setItem("cxDeviceId." + drmClientType, cxDeviceId);
            }
            return cxDeviceId;
        } else {
            throw 'No Web Storage support';
        }
    }

    var getCxDeviceId = function(drmClientType) {
        if (typeof(Storage) !== "undefined") {
            var cxDeviceId = localStorage.getItem("cxDeviceId." + drmClientType);
            if (cxDeviceId == null) {
                throw 'Device id not found';
            }
            return cxDeviceId;
        } else {
            throw 'No Web Storage support';
        }
    }

    var getCxCustomData = function (authenticationDataToken, drm) {
        return JSON.stringify(
            {
                Version: "1.0.0",
                CxAuthenticationDataToken: authenticationDataToken,
                CxClientInfo: {
                    CxDeviceId: getCxDeviceId(drm),
                    DeviceType: "Browser",
                    DrmClientType: drm + "-HTML5",
                    DrmClientVersion: "1.0.0"
                }
            }
        );
    };

    var generatePlayReadyHeader = function (authenticationDataToken) {

        function toUTF16LEArray(str) {
            var array = new Uint8Array(str.length * 2);
            for (var i = 0; i < str.length; i++) {
                var n = str.charCodeAt(i);
                array[i * 2] = n & 0xff;
                array[i * 2 + 1] = (n >> 8) & 0xff;
            }
            return array;
        }

        var cxCustData = getCxCustomData(authenticationDataToken, 'PlayReady');
        var cdmData = '<PlayReadyCDMData type="LicenseAcquisition">' +
                '<LicenseAcquisition version="1.0">' +
                '<CustomData encoding="base64encoded">' +
                BASE64.encode(String.fromCharCode.apply(null, toUTF16LEArray(cxCustData))) +
                '</CustomData>' +
                '</LicenseAcquisition>' +
                '</PlayReadyCDMData>';

        return toUTF16LEArray(cdmData);
    };

    var getCxClientInfo = function (drmClientType) {
        if (typeof(Storage) !== "undefined") {
            var cxDeviceId = getOrCreateCxDeviceId(drmClientType);
            if (cxDeviceId == null) {
                cxDeviceId = generateUUID();
                localStorage.setItem("cxDeviceId." + drmClientType, cxDeviceId);
            }
            cxClientInfo = {
                cxDeviceId: cxDeviceId,
                deviceType: "PC",
                drmClientType: drmClientType,
                drmClientVersion: "1.0.0"
            };
            return cxClientInfo;
        } else {
            throw 'No Web Storage support';
        }
    };

    return {

        generatePlayReaderHeader: function (authenticationDataToken) {
            return generatePlayReadyHeader(authenticationDataToken);
        },

        getCxCustomData: function (authenticationDataToken, drmType) {
            return getCxCustomData(authenticationDataToken, drmType);
        },

        getCxClientInfoForWidevine: function () {
            return getCxClientInfo('Widevine');
        },

        getCxClientInfoForPlayReady: function () {
            return getCxClientInfo('PlayReady');
        }
    }
};

