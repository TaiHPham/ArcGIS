import Portal from "@arcgis/core/portal/Portal.js";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo.js";
import esriId from "@arcgis/core/identity/IdentityManager.js"
import { map as initializeMap } from './map_esm.js';
import { search as searchAddress } from './search_esm.js';

export function authenticate() {
    const info = new OAuthInfo({
        appId: "h36KOnp2nf67b5C4",
        popup: false
    });
    esriId.registerOAuthInfos([info]);

    esriId
        .checkSignInStatus(info.portalUrl + "/sharing")
        .then(() => {
            handleSignedIn();
        })
        .catch(() => {
            handleSignedOut();
        });

    document.getElementById("sign-in").addEventListener("click", function () {
        esriId.getCredential(info.portalUrl + "/sharing");
    });

    document.getElementById("sign-out").addEventListener("click", function () {
        esriId.destroyCredentials();
        window.location.reload();
    });

    function handleSignedIn() {
        document.getElementById("sign-in").style.display = "none";
        document.getElementById("sign-out").style.display = "block";
        document.getElementById("results").innerText = "Signed In"
        
        const portal = new Portal();
        portal.load().then(() => {
            // const results = { username: portal.user.username };
            //document.getElementById("results").innerText = JSON.stringify(results, null, 2);
        });
        initializeMap();
        searchAddress();
    }
    function handleSignedOut() {
        document.getElementById("sign-in").style.display = "block";
        document.getElementById("sign-out").style.display = "none";
        document.getElementById("results").innerText = 'Signed Out'
    }
}
