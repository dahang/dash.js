ConaxDashIf = function () {

    var cx = new Conax();

    var getAuthenticationPlayReadyDataToken;
    var getAuthenticationWidevineDataToken;


    return {
        getCxCustomDataForPlayReady: function () {
            var authenticationDataToken = getAuthenticationPlayReadyDataToken();
            return cx.generatePlayReaderHeader(authenticationDataToken);
        },

        getCxCustomDataForWidevine: function () {
            var authenticationDataToken = getAuthenticationWidevineDataToken();
            return cx.getCxCustomData(authenticationDataToken, 'Widevine');
        },

        getCxClientInfoForWidevine: function () {
            return cx.getCxClientInfoForWidevine();
        },

        getCxClientInfoForPlayReady: function () {
            return cx.getCxClientInfoForPlayReady();
        },

        setGetAuthPlayReadyDataCallback: function(callback){
            getAuthenticationPlayReadyDataToken = callback;
        },

        setGetAuthWidevineDataCallback: function(callback){
            getAuthenticationWidevineDataToken = callback;
        }
    }
};

