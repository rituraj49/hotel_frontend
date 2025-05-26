import { useEffect, useState } from "react";
import keycloak from "./keycloak";

let alreadyInitialized = false;

export function useKeycloakInit() {
    const [keycloakReady, setKeycloakReady] = useState(false);
  
    useEffect(() => {
      console.log('calling keycloak init', alreadyInitialized);
      if(alreadyInitialized) {
        setKeycloakReady(true);
        return;
      }

      keycloak
        .init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
        })
        .then(() => {
          console.log('inittttt', alreadyInitialized)
          alreadyInitialized = true;
          setKeycloakReady(true);
        })
        .catch((err) => console.error("Keycloak init failed", err));
    }, []);
  
    return { keycloak, keycloakReady };
  }